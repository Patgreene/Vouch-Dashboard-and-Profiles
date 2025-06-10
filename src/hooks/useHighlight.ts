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

    // Calculate absolute position within the transcript text
    const transcriptText = transcriptElement.textContent || "";
    const selectedText = selection.toString();
    const beforeSelection = range.cloneRange();
    beforeSelection.selectNodeContents(transcriptElement);
    beforeSelection.setEnd(range.startContainer, range.startOffset);
    const startOffset = beforeSelection.toString().length;
    const endOffset = startOffset + selectedText.length;

    const highlightData: HighlightData = {
      transcriptId,
      startOffset,
      endOffset,
      text: selectedText,
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
    console.log(
      "handleShareLink called, tooltip data:",
      shareTooltip.highlightData,
    );

    if (!shareTooltip.highlightData) {
      console.log("No highlight data available");
      return;
    }

    const { transcriptId, startOffset, endOffset, text } =
      shareTooltip.highlightData;
    console.log("Generating share URL for:", {
      transcriptId,
      startOffset,
      endOffset,
      text,
    });

    const shareUrl = generateShareUrl(
      profileId,
      transcriptId,
      startOffset,
      endOffset,
    );

    console.log("Generated share URL:", shareUrl);

    const success = await copyToClipboard(shareUrl);
    console.log("Copy to clipboard result:", success);

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
    } else {
      console.error("Failed to copy to clipboard");
      // Still show feedback to let user know something happened
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  }, [shareTooltip.highlightData, profileId]);

  // Hide tooltip when clicking outside and handle global text selection
  useEffect(() => {
    const handleClickOutside = () => {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
    };

    const handleGlobalMouseUp = () => {
      // Small delay to ensure selection is finalized
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim() !== "") {
          // Find which transcript contains the selection
          const range = selection.getRangeAt(0);
          const transcriptElements = document.querySelectorAll(
            '[id^="transcript-"]',
          );

          for (const element of transcriptElements) {
            if (element.contains(range.commonAncestorContainer)) {
              const transcriptId = element.id.replace("transcript-", "");
              handleTextSelection(transcriptId);
              break;
            }
          }
        }
      }, 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleTextSelection]);

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
