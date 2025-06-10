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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllProfiles,
  addProfile,
  updateProfile,
  canEditProfile,
  mockAnalytics,
  Profile,
} from "@/lib/data";
import { analytics } from "@/lib/analytics";
import { ProfileForm } from "@/components/ProfileForm";
import { VouchLogo } from "@/components/VouchLogo";
import { SupabaseMigration } from "@/components/SupabaseMigration";
import { SupabaseTest } from "@/components/SupabaseTest";
import { downloadProfileBackup, importProfiles } from "@/lib/profileSync";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
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
  const [liveAnalytics, setLiveAnalytics] = useState({
    totalPageViews: 0,
    totalQuoteViews: 0,
    profileStats: [],
  });
  const [loading, setLoading] = useState(true);

  // Load profiles and analytics on component mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Loading admin dashboard data...");
        setLoading(true);

        const [profilesData, analyticsData] = await Promise.all([
          dataProvider.getAllProfiles(),
          dataProvider.getAnalytics(),
        ]);

        console.log("Loaded profiles:", profilesData);
        console.log("Loaded analytics:", analyticsData);

        setProfiles(profilesData);
        setLiveAnalytics(analyticsData);
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
        // Fallback to empty data to prevent crash
        setProfiles([]);
        setLiveAnalytics({
          totalPageViews: 0,
          totalQuoteViews: 0,
          profileStats: [],
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  const handleSaveProfile = async (profile: Profile) => {
    try {
      console.log(
        editingProfile ? "Profile updated:" : "New profile created:",
        profile,
      );
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

  const handleDeleteProfile = async (profile: Profile) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the profile for "${profile.name}"?\n\nThis action cannot be undone.`,
    );

    if (isConfirmed) {
      try {
        const success = await dataProvider.deleteProfile(profile.id);

        if (success) {
          const updatedProfiles = await dataProvider.getAllProfiles();
          setProfiles(updatedProfiles);
          alert(`Profile for ${profile.name} has been deleted successfully.`);
        } else {
          alert(`Failed to delete profile. Please try again.`);
        }
      } catch (error) {
        alert(`Error deleting profile. Please try again.`);
        console.error("Error deleting profile:", error);
      }
    }
  };

  const handleDeleteProfile = (profile: Profile) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the profile for "${profile.name}"?\n\nThis action cannot be undone.`,
    );

    if (isConfirmed) {
      const success = removeProfile(profile.id);

      if (success) {
        setProfiles(getAllProfiles());
        alert(`Profile for ${profile.name} has been deleted successfully.`);
      } else {
        alert(
          `Failed to delete profile. Only user-created profiles can be deleted.`,
        );
      }
    }
  };

  const handleCopyProfileUrl = async (profileId: string) => {
    try {
      const profileUrl = `${window.location.origin}/profile/${profileId}`;
      await navigator.clipboard.writeText(profileUrl);
      setCopiedProfileId(profileId);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedProfileId(null);
      }, 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = `${window.location.origin}/profile/${profileId}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedProfileId(profileId);
        setTimeout(() => {
          setCopiedProfileId(null);
        }, 2000);
      } catch (fallbackError) {
        console.error("Failed to copy URL:", fallbackError);
        alert(`Profile URL: ${window.location.origin}/profile/${profileId}`);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleExportProfiles = () => {
    downloadProfileBackup();
  };

  const handleImportProfiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const result = importProfiles(content);

          if (result.success) {
            setProfiles(getAllProfiles());
            alert(result.message);
          } else {
            alert(`Import failed: ${result.message}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <VouchLogo size="lg" className="text-vouch-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
              </div>
              <p className="text-gray-600">Internal admin panel</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button
                onClick={handleExportProfiles}
                variant="outline"
                title="Export all profiles to a file for sharing across devices"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleImportProfiles}
                variant="outline"
                title="Import profiles from a backup file"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button onClick={handleCreateProfile} className="gradient-bg">
                <Plus className="h-4 w-4 mr-2" />
                Create New Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Supabase Connection Test */}
        <div className="mb-6">
          <SupabaseTest />
        </div>

        {/* Supabase Migration */}
        <div className="mb-8">
          <SupabaseMigration
            onComplete={async () => {
              const [profilesData, analyticsData] = await Promise.all([
                dataProvider.getAllProfiles(),
                dataProvider.getAnalytics(),
              ]);
              setProfiles(profilesData);
              setLiveAnalytics(analyticsData);
            }}
          />
        </div>

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

        {/* Profile Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Per-Profile Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.map((profile) => {
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
                        <p className="text-sm text-gray-600">{profile.title}</p>
                        {profile.company && (
                          <Badge variant="outline" className="mt-1">
                            {profile.company}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          {pageViews}
                        </div>
                        <div className="text-gray-600">Page Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">
                          {quoteViews}
                        </div>
                        <div className="text-gray-600">Quote Views</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyProfileUrl(profile.id)}
                          className="relative"
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
                        {dataProvider.canEditProfile(profile.id) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProfile(profile)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProfile(profile)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/profile/${profile.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Admin Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Admin Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Creating Profiles:</strong> Click "Create New Profile"
                to add new candidate profiles with their transcripts and
                takeaways.
              </p>
              <p>
                <strong>Accessing Dashboard:</strong> This dashboard is
                accessible at the protected route and should not be publicly
                linked.
              </p>
              <p>
                <strong>Analytics:</strong> All page views and quote link shares
                are automatically tracked and displayed here.
              </p>
              <p>
                <strong>Sharing:</strong> Users can highlight text in
                transcripts to generate shareable links that scroll to specific
                content.
              </p>
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
