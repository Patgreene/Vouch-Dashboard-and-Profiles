import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ProfileHeader } from "@/components/ProfileHeader";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { TranscriptCard } from "@/components/TranscriptCard";
import { ShareTooltip } from "@/components/ShareTooltip";
import { getProfileById } from "@/lib/data";
import { analytics } from "@/lib/analytics";
import { useHighlight } from "@/hooks/useHighlight";
import { debugHighlightFeature } from "@/lib/debug";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(
    new Set(),
  );

  if (!id) {
    return <Navigate to="/not-found" replace />;
  }

  const profile = getProfileById(id);

  if (!profile) {
    return <Navigate to="/not-found" replace />;
  }

  const {
    shareTooltip,
    copiedFeedback,
    handleShareLink,
    handleTextSelection,
    processHighlightFromUrl,
  } = useHighlight(id);

  // Track page view and run debug
  useEffect(() => {
    analytics.trackPageView(id);

    // Run debug after page loads
    setTimeout(() => {
      debugHighlightFeature();
    }, 1000);
  }, [id]);

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
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
    </div>
  );
}
