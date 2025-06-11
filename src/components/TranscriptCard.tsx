import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  Calendar,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Transcript } from "@/lib/data";

interface TranscriptCardProps {
  transcript: Transcript;
  profileId: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  onTextSelection: (transcriptId: string) => void;
  processHighlightFromUrl: (transcriptId: string) => void;
}

export function TranscriptCard({
  transcript,
  profileId,
  isExpanded = false,
  onToggle,
  onTextSelection,
  processHighlightFromUrl,
}: TranscriptCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(isExpanded);

  // Use internal state if no external control
  const expanded = onToggle ? isExpanded : internalExpanded;
  const toggle = onToggle || (() => setInternalExpanded(!internalExpanded));

  // Format transcript content into paragraphs
  const paragraphs = transcript.content.split("\n\n").filter((p) => p.trim());

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Simple preview text - first paragraph truncated
  const previewText = paragraphs[0]?.substring(0, 200) + "..." || "";

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

  return (
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
                className="object-cover"
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
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 shrink-0" />
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {transcript.speakerRole}
                </Badge>
              </div>

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
            {/* Interview Metadata */}
            {(transcript.interviewDate || transcript.interviewedBy) && (
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1 sm:gap-1 text-xs text-gray-400">
                {transcript.interviewDate && (
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
                )}
                {transcript.interviewedBy && (
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span className="whitespace-nowrap">
                      by {transcript.interviewedBy.split(" ")[0]}
                    </span>
                  </div>
                )}
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
    </Card>
  );
}
