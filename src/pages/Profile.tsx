import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ProfileHeader } from "@/components/ProfileHeader";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { TranscriptCard } from "@/components/TranscriptCard";
import { ShareTooltip } from "@/components/ShareTooltip";
import { Footer } from "@/components/Footer";
import { dataProvider } from "@/lib/dataProvider";
import { Profile } from "@/lib/data";
import { useHighlight } from "@/hooks/useHighlight";
import { debugHighlightFeature } from "@/lib/debug";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(
    new Set(),
  );

  // All hooks must be called before any conditional logic
  const {
    shareTooltip,
    copiedFeedback,
    handleShareLink,
    handleTextSelection,
    processHighlightFromUrl,
  } = useHighlight(id || "");

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      if (!id) return;

      try {
        setLoading(true);
        console.log("Loading profile with ID:", id);
        const profileData = await dataProvider.getProfileById(id);
        console.log("Loaded profile data:", profileData);
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  // Track page view and run debug
  useEffect(() => {
    if (profile && id) {
      dataProvider.trackEvent(id, "page_view");

      // Run debug after page loads
      setTimeout(() => {
        debugHighlightFeature();
      }, 1000);
    }
  }, [id, profile]);

  // Handle URL parameters for expanding specific transcripts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transcriptId = urlParams.get("t");

    if (transcriptId) {
      // Expand the specific transcript
      setExpandedTranscripts(new Set([transcriptId]));

      // Scroll to transcript after a short delay
      setTimeout(() => {
        const element = document.getElementById(`transcript-${transcriptId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, []);

  console.log("Profile page loaded with ID:", id);

  // Now handle conditional logic after all hooks
  if (!id) {
    return <Navigate to="/not-found" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vouch-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show not found if profile doesn't exist
  if (!profile) {
    return <Navigate to="/not-found" replace />;
  }

  // Handle URL parameters for expanding specific transcripts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transcriptId = urlParams.get("t");

    if (transcriptId) {
      // Expand the specific transcript
      setExpandedTranscripts(new Set([transcriptId]));

      // Scroll to transcript after a short delay
      setTimeout(() => {
        const element = document.getElementById(`transcript-${transcriptId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, []);

  const toggleTranscript = (transcriptId: string) => {
    const newExpanded = new Set(expandedTranscripts);
    if (newExpanded.has(transcriptId)) {
      newExpanded.delete(transcriptId);
    } else {
      newExpanded.add(transcriptId);
    }
    setExpandedTranscripts(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Key Takeaways */}
      <KeyTakeaways takeaways={profile.keyTakeaways} />

      {/* Transcripts Section */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ margin: "-3px auto 0", padding: "7px 32px 32px" }}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transcripts</h2>
          <p className="text-gray-600"></p>
        </div>

        <div className="space-y-6">
          {profile.transcripts.map((transcript) => (
            <TranscriptCard
              key={transcript.id}
              transcript={transcript}
              profileId={id}
              isExpanded={expandedTranscripts.has(transcript.id)}
              onToggle={() => toggleTranscript(transcript.id)}
              onTextSelection={handleTextSelection}
              processHighlightFromUrl={processHighlightFromUrl}
            />
          ))}
        </div>
      </div>

      {/* Share Tooltip */}
      <ShareTooltip
        visible={shareTooltip.visible}
        x={shareTooltip.x}
        y={shareTooltip.y}
        onShare={handleShareLink}
        copied={copiedFeedback}
      />

      {/* Copied Feedback */}
      {copiedFeedback && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50">
          Link copied to clipboard!
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
