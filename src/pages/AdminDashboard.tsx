import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  FileText,
  Eye,
  Share2,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllProfiles, mockAnalytics, Profile } from "@/lib/data";
import { analytics } from "@/lib/analytics";
import { ProfileForm } from "@/components/ProfileForm";
import { VouchLogo } from "@/components/VouchLogo";

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
  const [profiles, setProfiles] = useState(getAllProfiles());
  const [showProfileForm, setShowProfileForm] = useState(false);
  const liveAnalytics = analytics.getAnalyticsSummary();

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
    setShowProfileForm(true);
  };

  const handleSaveProfile = (profile: Profile) => {
    // In a real app, this would save to database
    console.log("New profile created:", profile);
    setProfiles((prev) => [...prev, profile]);
    setShowProfileForm(false);
    analytics.trackProfileCreated(profile.id);

    // Show success message
    alert(
      `Profile for ${profile.name} created successfully! You can now view it at /profile/${profile.id}`,
    );
  };

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
              <Button onClick={handleCreateProfile} className="gradient-bg">
                <Plus className="h-4 w-4 mr-2" />
                Create New Profile
              </Button>
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

                    <div className="flex items-center gap-6 text-sm">
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
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/profile/${profile.id}`}>View Profile</Link>
                      </Button>
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

      {/* Profile Creation Form */}
      {showProfileForm && (
        <ProfileForm
          onClose={() => setShowProfileForm(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
