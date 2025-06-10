import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, User, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          <div className="p-3 bg-vouch-100 rounded-full">
            <User className="h-5 w-5 text-vouch-600" />
          </div>

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
            {!expanded && (
              <p className="text-gray-600 text-sm line-clamp-2">
                <p>{paragraphs[0]?.substring(0, 120)}...</p>
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
