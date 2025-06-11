import { useState, useCallback, useEffect } from "react";
import { analytics, copyToClipboard, generateShareUrl } from "@/lib/analytics";
import { dataProvider } from "@/lib/dataProvider";

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
    console.log("🔗 Starting share link generation...");

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

    try {
      const shareUrl = generateShareUrl(
        profileId,
        transcriptId,
        startOffset,
        endOffset,
      );

      console.log("🌐 Generated share URL:", shareUrl);

      // Perform clipboard operation in a separate microtask to avoid blocking UI
      const success = await copyToClipboard(shareUrl);
      console.log("📋 Copy to clipboard result:", success);

      // Always show feedback to user
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);

      if (success) {
        // Track the quote view
        await dataProvider.trackEvent(profileId, "quote_view", {
          transcriptId,
          highlightId: `${startOffset}-${endOffset}`,
          startOffset,
          endOffset,
        });
        console.log("✅ Share link operation completed successfully");
      } else {
        console.error("❌ Failed to copy to clipboard");
        // Show manual copy option
        console.log("📝 Manual copy - URL:", shareUrl);
        alert(
          `Could not automatically copy to clipboard. Please copy this URL manually:\n\n${shareUrl}`,
        );
      }

      // Hide tooltip after a small delay to ensure UI updates complete
      setTimeout(() => {
        setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      }, 50);
    } catch (error) {
      console.error("❌ Error in handleShareLink:", error);
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
    }
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
        currentTranscriptId: transcriptId,
      });

      if (urlTranscriptId === transcriptId && startOffset && endOffset) {
        // Find and highlight the text
        setTimeout(() => {
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

          const textContent = transcriptElement.textContent || "";
          const start = parseInt(startOffset);
          const end = parseInt(endOffset);

          console.log("🎨 Highlighting text from URL:", {
            start,
            end,
            text: textContent.substring(start, end),
            fullLength: textContent.length,
          });

          // Create text walker to find and highlight the specific text
          const walker = document.createTreeWalker(
            transcriptElement,
            NodeFilter.SHOW_TEXT,
            null,
            false,
          );

          let currentOffset = 0;
          let textNode;
          let foundStartNode = null;
          let foundEndNode = null;
          let startNodeOffset = 0;
          let endNodeOffset = 0;

          // Find the text nodes that contain our start and end positions
          while ((textNode = walker.nextNode())) {
            const nodeLength = textNode.textContent?.length || 0;

            if (currentOffset <= start && currentOffset + nodeLength > start) {
              foundStartNode = textNode;
              startNodeOffset = start - currentOffset;
            }

            if (currentOffset <= end && currentOffset + nodeLength >= end) {
              foundEndNode = textNode;
              endNodeOffset = end - currentOffset;
              break;
            }

            currentOffset += nodeLength;
          }

          if (foundStartNode && foundEndNode) {
            try {
              // Create a range for the highlighted text
              const range = document.createRange();
              range.setStart(foundStartNode, startNodeOffset);
              range.setEnd(foundEndNode, endNodeOffset);

              // Create highlight element
              const highlightSpan = document.createElement("span");
              highlightSpan.className = "highlight-intense highlight-fade-in";
              highlightSpan.style.backgroundColor = "#fde047";
              highlightSpan.style.padding = "2px 4px";
              highlightSpan.style.borderRadius = "4px";

              // Surround the selected content with the highlight span
              range.surroundContents(highlightSpan);

              console.log("✅ Successfully highlighted text from URL");

              // Scroll to the highlighted section
              highlightSpan.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });

              // Track the quote view
              await dataProvider.trackEvent(profileId, "quote_view", {
                transcriptId,
                highlightId: `${startOffset}-${endOffset}`,
                startOffset,
                endOffset,
              });
            } catch (error) {
              console.warn("❌ Could not highlight text:", error);

              // Fallback: just scroll to the transcript
              transcriptElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          } else {
            console.warn("❌ Could not find text nodes for highlighting");

            // Fallback: just scroll to the transcript
            transcriptElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 1000); // Increased delay to ensure accordion is fully open
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
