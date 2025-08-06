import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Transcript, Profile } from "@/lib/data";
import { PaymentModal } from "@/components/PaymentModal";

interface EnhancedTranscriptCardProps {
  transcript: Transcript;
  profileId: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  onTextSelection: (transcriptId: string) => void;
  processHighlightFromUrl: (transcriptId: string) => void;
  mode: "received" | "given";
  recipientProfile?: Profile; // Only used for "given" mode
}

export function EnhancedTranscriptCard({
  transcript,
  profileId,
  isExpanded = false,
  onToggle,
  onTextSelection,
  processHighlightFromUrl,
  mode,
  recipientProfile,
}: EnhancedTranscriptCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(isExpanded);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Use internal state if no external control
  const expanded = onToggle ? isExpanded : internalExpanded;
  const toggle = onToggle || (() => setInternalExpanded(!internalExpanded));

  // Format transcript content into paragraphs with safe handling
  const paragraphs = transcript?.content
    ? transcript.content.split("\n\n").filter((p) => p.trim())
    : [];

  // Get initials for avatar fallback with safe handling
  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .filter((part) => part.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters
  };

  // Simple preview text - first paragraph truncated with safe array access
  const previewText =
    paragraphs.length > 0 && paragraphs[0]
      ? paragraphs[0].substring(0, 200) + "..."
      : "No content available";

  // Handle text selection within this transcript
  const handleMouseUp = () => {
    if (expanded) {
      onTextSelection(transcript.id);
    }
  };

  // Check for URL highlighting when expanded
  useEffect(() => {
    if (expanded) {
      processHighlightFromUrl(transcript.id);
    }
  }, [expanded, transcript.id, processHighlightFromUrl]);

  // No payment processing - just show price modal

  // Verification status component
  const VerificationStatus = () => {
    switch (transcript.verificationStatus) {
      case "verified":
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            <span>Verified</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </div>
        );
      case "not_started":
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
            onMouseUp={(e) => {
              console.log("=== VERIFY BUTTON MOUSE UP - OPENING MODAL ===");
              e.preventDefault();
              e.stopPropagation();
              console.log("Transcript ID:", transcript.id);
              console.log(
                "Before state change - showPaymentModal:",
                showPaymentModal,
              );
              setShowPaymentModal(true);
              console.log("Modal should now be open!");
            }}
          >
            <Shield className="h-3 w-3 mr-1" />
            Verify now
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {/* Verification Status - positioned above the transcript card */}
      <div className="flex justify-start pl-1">
        <VerificationStatus />
      </div>

      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md max-w-full">
        <Button
          variant="ghost"
          onClick={toggle}
          className="w-full justify-between p-4 sm:p-6 h-auto text-left hover:bg-gray-50 transition-colors max-w-full"
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full gap-3 sm:gap-4">
            {/* Main Content Area */}
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 overflow-hidden">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mt-1 shrink-0">
                <AvatarImage
                  src={transcript.speakerPhoto}
                  alt={transcript.speakerName}
                  className="object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <AvatarFallback className="text-xs sm:text-sm font-semibold bg-vouch-100 text-vouch-600">
                  {getInitials(transcript.speakerName)}
                </AvatarFallback>
              </Avatar>

              <div
                className="flex-1 min-w-0 max-w-full overflow-hidden"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 leading-tight">
                  {transcript.speakerName}
                </h3>

                {/* Context for "given" mode */}
                {mode === "given" && recipientProfile && (
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <span>Vouching for</span>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={recipientProfile.photo}
                          alt={recipientProfile.name}
                          className="object-cover object-center"
                        />
                        <AvatarFallback className="text-xs font-semibold bg-gray-100 text-gray-600">
                          {getInitials(recipientProfile.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {recipientProfile.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Only show speaker role in received mode */}
                {mode === "received" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {transcript.speakerRole}
                    </Badge>
                  </div>
                )}

                {!expanded && (
                  <p
                    className="text-gray-600 text-sm leading-relaxed"
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  >
                    {previewText}
                  </p>
                )}
              </div>
            </div>

            {/* Right side - Metadata and expand icon */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 shrink-0">
              {/* Verification Status moved outside button */}

              {/* Interview Metadata */}
              {transcript.interviewDate && (
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1 sm:gap-1 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="whitespace-nowrap">
                      {new Date(transcript.interviewDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                        },
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Expand/Collapse Icon */}
              <div className="p-1">
                {expanded ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </Button>

        {expanded && (
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            <div
              id={`transcript-${transcript.id}`}
              className="prose prose-gray max-w-none text-sm sm:text-base leading-relaxed"
              onMouseUp={handleMouseUp}
              style={{
                userSelect: "text",
                cursor: "text",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                maxWidth: "100%",
                width: "100%",
              }}
            >
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-gray-700 leading-relaxed last:mb-0"
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    maxWidth: "100%",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        )}

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          transcriptId={transcript.id}
          speakerName={transcript.speakerName}
        />
      </Card>
    </div>
  );
}
