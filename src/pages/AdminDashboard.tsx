import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  FileText,
  Eye,
  Share2,
  TrendingUp,
  ExternalLink,
  Edit,
  Copy,
  Check,
  Trash2,
  Download,
  Upload,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockAnalytics, Profile } from "@/lib/data";
import { analytics } from "@/lib/analytics";
import { dataProvider } from "@/lib/dataProvider";
import { downloadProfileBackup, importProfiles } from "@/lib/profileSync";

// Lazy load heavy ProfileForm component
const ProfileForm = lazy(() =>
  import("@/components/ProfileForm").then((module) => ({
    default: module.ProfileForm,
  })),
);

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={`text-xs ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [copiedProfileId, setCopiedProfileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [liveAnalytics, setLiveAnalytics] = useState({
    totalPageViews: 0,
    totalQuoteViews: 0,
    profileStats: [],
  });
  const [loading, setLoading] = useState(true);

  // Emergency fallback - force load dashboard after 15 seconds
  useEffect(() => {
    const emergencyTimer = setTimeout(() => {
      if (loading) {
        console.warn(
          "🚨 Emergency fallback: Forcing dashboard to load after 15 seconds",
        );
        setLoading(false);
      }
    }, 15000);

    return () => clearTimeout(emergencyTimer);
  }, [loading]);

  // Load profiles and analytics on component mount
  useEffect(() => {
    async function loadData() {
      console.log("🔄 Starting AdminDashboard data load...");
      const startTime = Date.now();

      try {
        console.log("📥 Loading profiles...");
        console.log("🔧 Using data provider:", dataProvider.getStorageType());

        let profilesData: Profile[] = [];

        try {
          // Try data provider first (Supabase or localStorage)
          profilesData = await dataProvider.getAllProfiles();
          console.log("✅ Data provider successful");
        } catch (dataProviderError) {
          console.warn(
            "⚠️ Data provider failed, trying localStorage fallback:",
            dataProviderError,
          );

          // Try direct localStorage fallback
          try {
            const { getAllProfiles } = await import("../lib/data");
            profilesData = getAllProfiles();
            console.log("✅ Fallback to localStorage successful");
          } catch (fallbackError) {
            console.error(
              "❌ Even localStorage fallback failed:",
              fallbackError,
            );
            profilesData = [];
          }
        }

        console.log("✅ Profiles loaded:", profilesData?.length || 0);
        setProfiles(profilesData || []);

        // Load analytics separately to prevent blocking
        console.log("📊 Loading analytics...");
        try {
          const analyticsData = await dataProvider.getAnalytics();
          console.log("✅ Analytics loaded:", analyticsData);
          setLiveAnalytics(
            analyticsData || {
              totalPageViews: 0,
              totalQuoteViews: 0,
              profileStats: [],
            },
          );
        } catch (analyticsError) {
          console.warn(
            "⚠️ Analytics loading failed, using fallback:",
            analyticsError,
          );
          setLiveAnalytics({
            totalPageViews: 0,
            totalQuoteViews: 0,
            profileStats: [],
          });
        }
      } catch (error) {
        console.error("❌ Critical error loading dashboard data:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          time: `${Date.now() - startTime}ms`,
        });

        // Set empty data on error
        setProfiles([]);
        setLiveAnalytics({
          totalPageViews: 0,
          totalQuoteViews: 0,
          profileStats: [],
        });
      } finally {
        const loadTime = Date.now() - startTime;
        console.log(`✅ AdminDashboard loading complete (${loadTime}ms)`);
        setLoading(false);
      }
    }

    // Small delay to ensure the component is mounted
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.company &&
        profile.company.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleCreateProfile = () => {
    setEditingProfile(null);
    setShowProfileForm(true);
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setShowProfileForm(true);
  };

  const handleCloseForm = () => {
    setShowProfileForm(false);
    setEditingProfile(null);
  };

  const handleSaveProfile = async (profile: Profile) => {
    try {
      const success = await dataProvider.saveProfile(profile);
      if (success) {
        // Refresh profiles list
        const updatedProfiles = await dataProvider.getAllProfiles();
        setProfiles(updatedProfiles);
        setShowProfileForm(false);
        setEditingProfile(null);

        // Track profile creation/update
        await dataProvider.trackEvent(
          profile.id,
          editingProfile ? "profile_created" : "profile_created",
        );
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        const success = await dataProvider.deleteProfile(profileId);
        if (success) {
          const updatedProfiles = await dataProvider.getAllProfiles();
          setProfiles(updatedProfiles);
        } else {
          alert("Failed to delete profile. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Error deleting profile. Please try again.");
      }
    }
  };

  const handleCopyProfileLink = (profileId: string) => {
    const url = `${window.location.origin}/profile/${profileId}`;
    navigator.clipboard.writeText(url);
    setCopiedProfileId(profileId);
    setTimeout(() => setCopiedProfileId(null), 2000);
  };

  const handleExportData = () => {
    downloadProfileBackup(profiles);
  };

  const handleImportData = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const importedProfiles = await importProfiles(file);
            for (const profile of importedProfiles) {
              await dataProvider.saveProfile(profile);
            }
            // Refresh profiles list
            const updatedProfiles = await dataProvider.getAllProfiles();
            setProfiles(updatedProfiles);
            alert(`Successfully imported ${importedProfiles.length} profiles!`);
          } catch (error) {
            console.error("Import error:", error);
            alert("Import failed. Please check the file format.");
          }
        }
      };
      input.click();
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vouch-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Manage profiles and view analytics
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                onClick={handleImportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                onClick={handleExportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleCreateProfile}
                className="flex items-center gap-2 gradient-bg"
              >
                <Plus className="h-4 w-4" />
                Create Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Profiles"
            value={profiles.length.toString()}
            icon={Users}
          />
          <StatCard
            title="Total Page Views"
            value={liveAnalytics.totalPageViews.toString()}
            icon={Eye}
          />
          <StatCard
            title="Total Quote Views"
            value={liveAnalytics.totalQuoteViews.toString()}
            icon={FileText}
          />
          <StatCard title="Total Shares" value="0" icon={Share2} />
          <StatCard
            title="Unique Visitors"
            value={liveAnalytics.profileStats
              .reduce((acc, stat: any) => acc + (stat.uniqueVisitors || 0), 0)
              .toString()}
            icon={TrendingUp}
          />
        </div>

        {/* Profiles Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Profiles ({filteredProfiles.length})</CardTitle>
              <div className="mt-4 sm:mt-0 flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search profiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No profiles found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search term"
                    : "Get started by creating a new profile"}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <Button
                      onClick={handleCreateProfile}
                      className="gradient-bg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Profile
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => {
                  const profileStats = liveAnalytics.profileStats.find(
                    (stat: any) => stat.profileId === profile.id,
                  );

                  return (
                    <Card
                      key={profile.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {profile.photo ? (
                                <img
                                  src={profile.photo}
                                  alt={profile.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-vouch-100 flex items-center justify-center">
                                  <span className="text-vouch-600 font-semibold text-lg">
                                    {profile.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {profile.name}
                                </h3>
                                <p className="text-gray-600 text-xs">
                                  {profile.title}
                                </p>
                                {profile.company && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs mt-1"
                                  >
                                    {profile.company}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4 text-xs text-gray-500 mb-3">
                              <span>Views: {profileStats?.pageViews || 0}</span>
                              <span>
                                Quotes: {profileStats?.quoteViews || 0}
                              </span>
                              <span>
                                Visitors: {profileStats?.uniqueVisitors || 0}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs"
                              >
                                <Link to={`/profile/${profile.id}`}>
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProfile(profile)}
                                className="text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCopyProfileLink(profile.id)
                                }
                                className="text-xs"
                              >
                                {copiedProfileId === profile.id ? (
                                  <Check className="h-3 w-3 mr-1" />
                                ) : (
                                  <Copy className="h-3 w-3 mr-1" />
                                )}
                                {copiedProfileId === profile.id
                                  ? "Copied!"
                                  : "Copy"}
                              </Button>
                              {dataProvider.canEditProfile(profile.id) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProfile(profile.id)
                                  }
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Creation/Edit Form - Lazy loaded */}
      {showProfileForm && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vouch-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading form...</p>
              </div>
            </div>
          }
        >
          <ProfileForm
            onClose={handleCloseForm}
            onSave={handleSaveProfile}
            editingProfile={editingProfile}
          />
        </Suspense>
      )}
    </div>
  );
}
