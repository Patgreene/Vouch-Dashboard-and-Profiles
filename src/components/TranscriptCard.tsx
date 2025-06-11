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

  // Create preview text that forces 2-line display on mobile
  const getPreviewText = () => {
    const baseText = paragraphs[0] || "";

    // For mobile: create text that's likely to wrap to 2 lines
    // Approximate 35-40 characters per line on mobile
    const words = baseText.split(" ");
    let line1 = "";
    let line2 = "";

    // Build first line (aim for ~35-40 chars)
    for (const word of words) {
      if (line1.length + word.length + 1 < 40) {
        line1 += (line1 ? " " : "") + word;
      } else {
        break;
      }
    }

    // Build second line with remaining words
    const remainingWords = words.slice(line1.split(" ").length);
    for (const word of remainingWords) {
      if (line2.length + word.length + 1 < 40) {
        line2 += (line2 ? " " : "") + word;
      } else {
        line2 += "...";
        break;
      }
    }

    // If we don't have enough for 2 lines, add padding
    if (!line2) {
      // Find a good break point in the text
      if (line1.length < 80 && baseText.length > line1.length) {
        const remaining = baseText.substring(line1.length).trim();
        line2 =
          remaining.length > 40
            ? remaining.substring(0, 37) + "..."
            : remaining;
      }
    }

    return line2 ? `${line1} ${line2}` : line1;
  };

  const previewText = getPreviewText();

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
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Button
        variant="ghost"
        onClick={toggle}
        className="w-full justify-between p-4 sm:p-6 h-auto text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full gap-3 sm:gap-4">
          {/* Main Content Area */}
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
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

            <div className="flex-1 min-w-0">
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
                <div className="text-gray-600 text-sm leading-normal">
                  {/* Force 2-line display with manual line breaks */}
                  <div
                    className="block sm:hidden"
                    style={{
                      lineHeight: "1.3",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "2.6em", // Force 2 lines minimum
                      height: "2.6em", // Lock height to exactly 2 lines
                    }}
                  >
                    {previewText}
                  </div>
                  {/* Desktop version */}
                  <div
                    className="hidden sm:block"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                    }}
                  >
                    {paragraphs[0]?.substring(0, 200)}...
                  </div>
                </div>
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
              wordBreak: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto",
            }}
          >
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 text-gray-700 leading-relaxed last:mb-0"
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
