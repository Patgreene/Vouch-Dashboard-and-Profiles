import { useState, useCallback, useEffect } from "react";
import { analytics, copyToClipboard, generateShareUrl } from "@/lib/analytics";

export interface HighlightData {
  transcriptId: string;
  startOffset: number;
  endOffset: number;
  text: string;
}

export interface ShareTooltipState {
  visible: boolean;
  x: number;
  y: number;
  highlightData: HighlightData | null;
}

export function useHighlight(profileId: string) {
  const [shareTooltip, setShareTooltip] = useState<ShareTooltipState>({
    visible: false,
    x: 0,
    y: 0,
    highlightData: null,
  });

  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Handle text selection
  const handleTextSelection = useCallback((transcriptId: string) => {
    const selection = window.getSelection();

    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.toString().trim() === ""
    ) {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Only show tooltip if text is selected within the transcript
    const transcriptElement = document.getElementById(
      `transcript-${transcriptId}`,
    );
    if (
      !transcriptElement ||
      !transcriptElement.contains(range.commonAncestorContainer)
    ) {
      return;
    }

    const highlightData: HighlightData = {
      transcriptId,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      text: selection.toString(),
    };

    setShareTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      highlightData,
    });
  }, []);

  // Handle share link generation
  const handleShareLink = useCallback(async () => {
    if (!shareTooltip.highlightData) return;

    const { transcriptId, startOffset, endOffset } = shareTooltip.highlightData;
    const shareUrl = generateShareUrl(
      profileId,
      transcriptId,
      startOffset,
      endOffset,
    );

    const success = await copyToClipboard(shareUrl);

    if (success) {
      // Track the quote view
      analytics.trackQuoteView(
        profileId,
        transcriptId,
        `${startOffset}-${endOffset}`,
      );

      // Show copied feedback
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);

      // Hide tooltip
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
    }
  }, [shareTooltip.highlightData, profileId]);

  // Hide tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle URL parameters for direct highlighting
  const processHighlightFromUrl = useCallback(
    (transcriptId: string) => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTranscriptId = urlParams.get("t");
      const startOffset = urlParams.get("s");
      const endOffset = urlParams.get("e");

      if (urlTranscriptId === transcriptId && startOffset && endOffset) {
        // Find and highlight the text
        setTimeout(() => {
          const transcriptElement = document.getElementById(
            `transcript-${transcriptId}`,
          );
          if (transcriptElement) {
            const textNode = transcriptElement.firstChild;
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
              const range = document.createRange();
              range.setStart(textNode, parseInt(startOffset));
              range.setEnd(textNode, parseInt(endOffset));

              // Create highlight element
              const highlightSpan = document.createElement("span");
              highlightSpan.className = "highlight-intense highlight-fade-in";

              try {
                range.surroundContents(highlightSpan);

                // Scroll to the highlighted section
                highlightSpan.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });

                // Track the quote view
                analytics.trackQuoteView(
                  profileId,
                  transcriptId,
                  `${startOffset}-${endOffset}`,
                );
              } catch (error) {
                console.warn("Could not highlight text:", error);
              }
            }
          }
        }, 500); // Wait for accordion to open
      }
    },
    [profileId],
  );

  return {
    shareTooltip,
    copiedFeedback,
    handleTextSelection,
    handleShareLink,
    processHighlightFromUrl,
  };
}
