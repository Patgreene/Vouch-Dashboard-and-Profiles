import { useEffect, useState, lazy, Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ProfileHeader } from "@/components/ProfileHeader";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { TranscriptCard } from "@/components/TranscriptCard";
import { EnhancedTranscriptCard } from "@/components/EnhancedTranscriptCard";
import { ShareTooltip } from "@/components/ShareTooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataProvider } from "@/lib/dataProvider";
import { Profile as ProfileInterface, Transcript } from "@/lib/data";
import { useHighlight } from "@/hooks/useHighlight";

// Lazy load Footer component
const Footer = lazy(() =>
  import("@/components/Footer").then((module) => ({
    default: module.Footer,
  })),
);

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(
    new Set(),
  );
  const [givenTranscripts, setGivenTranscripts] = useState<
    Array<{ transcript: Transcript; recipientProfile: ProfileInterface }>
  >([]);

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
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await dataProvider.getProfileById(id);

        if (profileData) {
          setProfile(profileData);

          // Load transcripts given by this person (where they are the speaker)
          const givenData = await dataProvider.getGivenTranscripts(
            profileData.email,
          );
          setGivenTranscripts(givenData);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    // Add small delay to ensure dataProvider is ready
    setTimeout(loadProfile, 100);
  }, [id]);

  // Track page view
  useEffect(() => {
    if (profile && id) {
      dataProvider.trackEvent(id, "page_view");
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

  const toggleTranscript = (transcriptId: string) => {
    const newExpanded = new Set(expandedTranscripts);
    if (newExpanded.has(transcriptId)) {
      newExpanded.delete(transcriptId);
    } else {
      newExpanded.add(transcriptId);
    }
    setExpandedTranscripts(newExpanded);
  };

  // Now handle conditional logic after all hooks
  if (!id) {
    return <Navigate to="/not-found" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#fb7414] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show not found if profile doesn't exist
  if (!profile) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div key={profile.id} className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Key Takeaways */}
      <KeyTakeaways takeaways={profile.keyTakeaways} />

      {/* Transcripts Section */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ margin: "-3px auto 0", padding: "11px 32px 24px" }}
      >
        <Tabs defaultValue="received" className="w-full">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Transcripts
            </h2>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="received" className="text-sm">
                Received ({profile.transcripts?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="given" className="text-sm">
                Given ({givenTranscripts.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="received" className="space-y-4 sm:space-y-6">
            {profile.transcripts && profile.transcripts.length > 0 ? (
              profile.transcripts.map((transcript) => (
                <EnhancedTranscriptCard
                  key={`received-${profile.id}-${transcript.id}`}
                  transcript={transcript}
                  profileId={id}
                  isExpanded={expandedTranscripts.has(transcript.id)}
                  onToggle={() => toggleTranscript(transcript.id)}
                  onTextSelection={handleTextSelection}
                  processHighlightFromUrl={processHighlightFromUrl}
                  mode="received"
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No received transcripts available
              </div>
            )}
          </TabsContent>

          <TabsContent value="given" className="space-y-4 sm:space-y-6">
            {givenTranscripts.length > 0 ? (
              givenTranscripts.map(({ transcript, recipientProfile }) => (
                <EnhancedTranscriptCard
                  key={`given-${transcript.id}`}
                  transcript={transcript}
                  profileId={id}
                  isExpanded={expandedTranscripts.has(transcript.id)}
                  onToggle={() => toggleTranscript(transcript.id)}
                  onTextSelection={handleTextSelection}
                  processHighlightFromUrl={processHighlightFromUrl}
                  mode="given"
                  recipientProfile={recipientProfile}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No given transcripts available
              </div>
            )}
          </TabsContent>
        </Tabs>
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
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50 text-center sm:text-left">
          Link copied to clipboard!
        </div>
      )}

      {/* Footer - Lazy loaded */}
      <Suspense fallback={<div className="h-16" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
