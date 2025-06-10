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
    console.log("🎯 handleTextSelection called for transcript:", transcriptId);

    const selection = window.getSelection();

    if (!selection) {
      console.log("❌ No selection object");
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    if (selection.rangeCount === 0) {
      console.log("❌ No ranges in selection");
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText === "") {
      console.log("⚠️ Empty selection");
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    console.log("📝 Selected text:", selectedText);

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    console.log("📐 Selection rect:", {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    // Only show tooltip if text is selected within the transcript
    const transcriptElement = document.getElementById(
      `transcript-${transcriptId}`,
    );

    if (!transcriptElement) {
      console.log(
        "❌ Transcript element not found:",
        `transcript-${transcriptId}`,
      );
      return;
    }

    if (!transcriptElement.contains(range.commonAncestorContainer)) {
      console.log("❌ Selection not within transcript element");
      return;
    }

    console.log("✅ Selection is within transcript element");

    // Calculate absolute position within the transcript text
    const transcriptText = transcriptElement.textContent || "";
    const beforeSelection = range.cloneRange();
    beforeSelection.selectNodeContents(transcriptElement);
    beforeSelection.setEnd(range.startContainer, range.startOffset);
    const startOffset = beforeSelection.toString().length;
    const endOffset = startOffset + selectedText.length;

    console.log("📍 Calculated positions:", {
      startOffset,
      endOffset,
      selectedText,
      transcriptLength: transcriptText.length,
    });

    const highlightData: HighlightData = {
      transcriptId,
      startOffset,
      endOffset,
      text: selectedText,
    };

    const tooltipState = {
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      highlightData,
    };

    console.log("💡 Setting tooltip state:", tooltipState);
    setShareTooltip(tooltipState);
  }, []);

  // Handle share link generation
  const handleShareLink = useCallback(async () => {
    console.log(
      "🔗 handleShareLink called, tooltip data:",
      shareTooltip.highlightData,
    );

    if (!shareTooltip.highlightData) {
      console.log("❌ No highlight data available");
      return;
    }

    const { transcriptId, startOffset, endOffset, text } =
      shareTooltip.highlightData;
    console.log("🔧 Generating share URL for:", {
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

    console.log("🌐 Generated share URL:", shareUrl);

    const success = await copyToClipboard(shareUrl);
    console.log("📋 Copy to clipboard result:", success);

    // Always show feedback to user
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);

    if (success) {
      // Track the quote view
      analytics.trackQuoteView(
        profileId,
        transcriptId,
        `${startOffset}-${endOffset}`,
      );
    } else {
      console.error("❌ Failed to copy to clipboard");
      // Show manual copy option
      console.log("📝 Manual copy - URL:", shareUrl);
      alert(
        `Could not automatically copy to clipboard. Please copy this URL manually:\n\n${shareUrl}`,
      );
    }

    // Hide tooltip
    setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
  }, [shareTooltip.highlightData, profileId]);

  // Hide tooltip when clicking outside and handle global text selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("🖱️ Click outside detected");
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
    };

    const handleGlobalMouseUp = () => {
      // Small delay to ensure selection is finalized
      setTimeout(() => {
        console.log("🖱️ Global mouseup detected");
        const selection = window.getSelection();

        if (!selection) {
          console.log("❌ No selection object");
          return;
        }

        const selectedText = selection.toString().trim();
        console.log("📝 Selected text:", selectedText);

        if (selectedText === "") {
          console.log("⚠️ No text selected");
          return;
        }

        if (selection.rangeCount === 0) {
          console.log("❌ No ranges in selection");
          return;
        }

        // Find which transcript contains the selection
        const range = selection.getRangeAt(0);
        const transcriptElements = document.querySelectorAll(
          '[id^="transcript-"]',
        );
        console.log(
          "🔍 Checking",
          transcriptElements.length,
          "transcript elements",
        );

        for (const element of transcriptElements) {
          if (element.contains(range.commonAncestorContainer)) {
            const transcriptId = element.id.replace("transcript-", "");
            console.log("✅ Found selection in transcript:", transcriptId);
            handleTextSelection(transcriptId);
            return;
          }
        }

        console.log("❌ Selection not found in any transcript");
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

      console.log("🔗 Processing highlight from URL:", {
        urlTranscriptId,
        startOffset,
        endOffset,
      });

      if (urlTranscriptId === transcriptId && startOffset && endOffset) {
        // Find and highlight the text
        setTimeout(() => {
          const transcriptElement = document.getElementById(
            `transcript-${transcriptId}`,
          );
          if (transcriptElement) {
            const textContent = transcriptElement.textContent || "";
            const start = parseInt(startOffset);
            const end = parseInt(endOffset);

            console.log("🎨 Highlighting text from URL:", {
              start,
              end,
              text: textContent.substring(start, end),
              fullLength: textContent.length,
            });

            // Create a simple highlight by adding a span around the text
            const highlightSpan = document.createElement("span");
            highlightSpan.className = "highlight-intense highlight-fade-in";
            highlightSpan.textContent = textContent.substring(start, end);

            // For now, just scroll to the transcript
            transcriptElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Track the quote view
            analytics.trackQuoteView(
              profileId,
              transcriptId,
              `${startOffset}-${endOffset}`,
            );
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
