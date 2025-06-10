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

  // Create preview text that shows approximately two lines
  const previewText = paragraphs[0]?.substring(0, 240) + "...";

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
        className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50 transition-colors"
      >
        <div
          className="flex items-start gap-4 flex-1"
          style={{ paddingRight: "1px" }}
        >
          <Avatar className="h-12 w-12 mt-1">
            <AvatarImage
              src={transcript.speakerPhoto}
              alt={transcript.speakerName}
              className="object-cover"
            />
            <AvatarFallback className="text-sm font-semibold bg-vouch-100 text-vouch-600">
              {getInitials(transcript.speakerName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {transcript.speakerName}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <Badge variant="outline" className="text-sm">
                {transcript.speakerRole}
              </Badge>
            </div>

            {/* Interview Metadata */}
            {(transcript.interviewDate || transcript.interviewedBy) && (
              <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-500">
                {transcript.interviewDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(transcript.interviewDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
                {transcript.interviewedBy && (
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span>Interviewed by {transcript.interviewedBy.split(' ')[0]}</span>
                  </div>
                )}
              </div>
            )}
            )}
            {!expanded && (
              <p
                className="text-gray-600 text-sm leading-relaxed break-words whitespace-normal overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {previewText}
              </p>
            )}
          </div>
        </div>

        <div className="ml-4 flex-shrink-0 flex flex-col">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 ml-auto" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 ml-auto" />
          )}
        </div>
      </Button>

      {expanded && (
        <CardContent className="px-6 pb-6 pt-0 animate-fade-in">
          <div className="border-t border-gray-100 pt-6">
            <div
              id={`transcript-${transcript.id}`}
              className="prose prose-gray max-w-none"
              onMouseUp={handleMouseUp}
              style={{ userSelect: "text" }}
            >
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}