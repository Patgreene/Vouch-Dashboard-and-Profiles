import { useState, useEffect } from "react";
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
import { ProfileForm } from "@/components/ProfileForm";
import { dataProvider } from "@/lib/dataProvider";
import { downloadProfileBackup, importProfiles } from "@/lib/profileSync";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {value.toLocaleString()}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
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

  // Load profiles and analytics on component mount
  useEffect(() => {
    async function loadData() {
      console.log("🔄 Starting AdminDashboard data load...");

      try {
        // Load profiles first
        console.log("📥 Loading profiles...");
        const profilesData = await dataProvider.getAllProfiles();
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
        setProfiles([]);
        setLiveAnalytics({
          totalPageViews: 0,
          totalQuoteViews: 0,
          profileStats: [],
        });
      } finally {
        console.log("✅ AdminDashboard loading complete");
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.company &&
        profile.company.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Combine mock data with live analytics
  const totalStats = {
    totalProfiles: profiles.length,
    totalTranscripts: profiles.reduce(
      (sum, p) => sum + p.transcripts.length,
      0,
    ),
    totalPageViews: mockAnalytics.totalPageViews + liveAnalytics.totalPageViews,
    totalQuoteViews:
      mockAnalytics.totalQuoteViews + liveAnalytics.totalQuoteViews,
  };

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
        const updatedProfiles = await dataProvider.getAllProfiles();
        setProfiles(updatedProfiles);
        setShowProfileForm(false);
        setEditingProfile(null);

        if (!editingProfile) {
          await dataProvider.trackEvent(profile.id, "profile_created");
        }

        alert(
          `Profile for ${profile.name} ${editingProfile ? "updated" : "created"} successfully! You can now view it at /profile/${profile.id}`,
        );
      } else {
        alert(
          `Failed to ${editingProfile ? "update" : "create"} profile. ${editingProfile ? "Please try again." : "A profile with this ID may already exist."}`,
        );
      }
    } catch (error) {
      alert(
        `Error ${editingProfile ? "updating" : "creating"} profile. Please try again.`,
      );
      console.error("Error saving profile:", error);
    }
  };

  const handleCopyProfileUrl = async (profileId: string) => {
    const url = `${window.location.origin}/profile/${profileId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedProfileId(profileId);
      setTimeout(() => setCopiedProfileId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDeleteProfile = async (profile: Profile) => {
    if (!dataProvider.canEditProfile(profile.id)) return;

    if (
      window.confirm(
        `Are you sure you want to delete the profile for ${profile.name}? This action cannot be undone.`,
      )
    ) {
      try {
        const [profilesData, analyticsData] = await Promise.all([
          dataProvider.getAllProfiles(),
          dataProvider.getAnalytics(),
        ]);

        setProfiles(profilesData || []);
        setLiveAnalytics(
          analyticsData || {
            totalPageViews: 0,
            totalQuoteViews: 0,
            profileStats: [],
          },
        );
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
        alert("Error deleting profile. Please try again.");
      }
    }
  };

  const handleExportProfiles = () => {
    try {
      downloadProfileBackup(profiles);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export profiles. Please try again.");
    }
  };

  const handleImportProfiles = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const success = await importProfiles(file);
          if (success) {
            const updatedProfiles = await dataProvider.getAllProfiles();
            setProfiles(updatedProfiles);
            alert("Profiles imported successfully!");
          } else {
            alert("Import failed. Please check the file format and try again.");
          }
        } catch (error) {
          console.error("Import failed:", error);
          alert("Import failed. Please try again.");
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2F5458c0c30e7f4da8ac941780333ddd13"
                alt="Vouch Logo"
                className="w-16 h-8 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Internal Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage profiles and view analytics
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to="/">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Site
                  </Link>
                </Button>
                <Button
                  onClick={handleCreateProfile}
                  className="gradient-bg"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Profile
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleExportProfiles}
                  variant="outline"
                  size="sm"
                  title="Export all profiles to a file for sharing across devices"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={handleImportProfiles}
                  variant="outline"
                  size="sm"
                  title="Import profiles from a backup file"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Profiles"
            value={totalStats.totalProfiles}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Total Transcripts"
            value={totalStats.totalTranscripts}
            icon={<FileText className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Page Views"
            value={totalStats.totalPageViews}
            icon={<Eye className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatCard
            title="Quote Link Views"
            value={totalStats.totalQuoteViews}
            icon={<Share2 className="h-6 w-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Profile Management */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profile Management ({filteredProfiles.length} of{" "}
                {profiles.length} profiles)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search Box */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Profiles List */}
            <div className="space-y-4">
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? `No profiles found matching "${searchTerm}"`
                    : "No profiles created yet"}
                </div>
              ) : (
                filteredProfiles.map((profile) => {
                  const mockStats = mockAnalytics.profileStats.find(
                    (s) => s.profileId === profile.id,
                  );
                  const liveStats = liveAnalytics.profileStats.find(
                    (s) => s.profileId === profile.id,
                  );

                  const pageViews =
                    (mockStats?.pageViews || 0) + (liveStats?.pageViews || 0);
                  const quoteViews =
                    (mockStats?.quoteViews || 0) + (liveStats?.quoteViews || 0);
                  const uniqueVisitors = liveStats?.uniqueVisitors || 0;

                  return (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {profile.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {profile.title}
                          </p>
                          {profile.company && (
                            <Badge variant="outline" className="mt-1">
                              {profile.company}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Stats */}
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {pageViews}
                            </div>
                            <div className="text-gray-600">Page Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {uniqueVisitors}
                            </div>
                            <div className="text-gray-600">Unique Visitors</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {quoteViews}
                            </div>
                            <div className="text-gray-600">Quote Views</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyProfileUrl(profile.id)}
                              className="min-w-[100px]"
                            >
                              {copiedProfileId === profile.id ? (
                                <>
                                  <Check className="h-4 w-4 mr-1 text-green-600" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy URL
                                </>
                              )}
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="min-w-[100px]"
                            >
                              <Link to={`/profile/${profile.id}`}>
                                View Profile
                              </Link>
                            </Button>
                          </div>
                          {dataProvider.canEditProfile(profile.id) && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProfile(profile)}
                                className="min-w-[100px]"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProfile(profile)}
                                className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50 min-w-[100px]"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Creation/Edit Form */}
      {showProfileForm && (
        <ProfileForm
          onClose={handleCloseForm}
          onSave={handleSaveProfile}
          editingProfile={editingProfile}
        />
      )}
    </div>
  );
}
