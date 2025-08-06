import { useState, useCallback, useEffect } from "react";
import { analytics, copyToClipboard } from "@/lib/analytics";

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

// Demo-specific function to generate share URLs that point to /demo
function generateDemoShareUrl(
  transcriptId: string,
  highlightStart: number,
  highlightEnd: number,
): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    t: transcriptId,
    s: highlightStart.toString(),
    e: highlightEnd.toString(),
  });

  return `${baseUrl}/demo?${params.toString()}`;
}

export function useDemoHighlight() {
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

    if (!selection) {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    if (selection.rangeCount === 0) {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText === "") {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Find which transcript element contains the selection
    const transcriptElement = document.getElementById(
      `transcript-${transcriptId}`,
    );

    if (!transcriptElement) {
      return;
    }

    if (!transcriptElement.contains(range.commonAncestorContainer)) {
      return;
    }

    // Calculate absolute position within the transcript text
    const transcriptText = transcriptElement.textContent || "";
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

    const tooltipState = {
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      highlightData,
    };

    setShareTooltip(tooltipState);
  }, []);

  // Handle share link generation for demo
  const handleShareLink = useCallback(async () => {
    if (!shareTooltip.highlightData) {
      return;
    }

    const { transcriptId, startOffset, endOffset } = shareTooltip.highlightData;

    // Use demo-specific URL generation
    const shareUrl = generateDemoShareUrl(transcriptId, startOffset, endOffset);

    // Perform clipboard operation
    const success = await copyToClipboard(shareUrl);

    // Always show feedback to user
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);

    if (!success) {
      // Show manual copy option
      alert(
        `Could not automatically copy to clipboard. Please copy this URL manually:\n\n${shareUrl}`,
      );
    }

    // Hide tooltip after a small delay
    setTimeout(() => {
      setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
    }, 100);
  }, [shareTooltip.highlightData]);

  // Hide tooltip when clicking outside
  const handleClickOutside = useCallback(() => {
    setShareTooltip({ visible: false, x: 0, y: 0, highlightData: null });
  }, []);

  // Handle global mouseup to detect text selection
  const handleGlobalMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const selectedText = selection.toString().trim();

    if (selectedText === "") {
      return;
    }

    if (selection.rangeCount === 0) {
      return;
    }

    // Find which transcript contains the selection
    const range = selection.getRangeAt(0);
    const transcriptElements = document.querySelectorAll('[id^="transcript-"]');

    for (const element of transcriptElements) {
      if (element.contains(range.commonAncestorContainer)) {
        const transcriptId = element.id.replace("transcript-", "");
        handleTextSelection(transcriptId);
        return;
      }
    }
  }, [handleTextSelection]);

  // Set up event listeners for text selection
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleTextSelection]);

  // Handle URL parameters for direct highlighting (demo version)
  const processHighlightFromUrl = useCallback(async (transcriptId: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTranscriptId = urlParams.get("t");
    const startOffset = urlParams.get("s");
    const endOffset = urlParams.get("e");

    if (urlTranscriptId === transcriptId && startOffset && endOffset) {
      // Find and highlight the text - increased delay to allow transcript expansion
      setTimeout(async () => {
        const transcriptElement = document.getElementById(
          `transcript-${transcriptId}`,
        );

        if (!transcriptElement) {
          return;
        }

        const start = parseInt(startOffset);
        const end = parseInt(endOffset);

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
          const nodeStart = currentOffset;
          const nodeEnd = currentOffset + nodeLength;

          if (start >= nodeStart && start < nodeEnd && !foundStartNode) {
            foundStartNode = textNode;
            startNodeOffset = start - nodeStart;
          }

          if (end > nodeStart && end <= nodeEnd && !foundEndNode) {
            foundEndNode = textNode;
            endNodeOffset = end - nodeStart;
          }

          currentOffset += nodeLength;

          if (foundStartNode && foundEndNode) break;
        }

        // Create and apply highlight if we found the nodes
        if (foundStartNode && foundEndNode) {
          try {
            const range = document.createRange();
            range.setStart(foundStartNode, startNodeOffset);
            range.setEnd(foundEndNode, endNodeOffset);

            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
            }

            // Create a highlight span
            const highlightSpan = document.createElement("span");
            highlightSpan.style.backgroundColor = "#fef3c7";
            highlightSpan.style.padding = "2px 4px";
            highlightSpan.style.borderRadius = "4px";
            highlightSpan.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

            try {
              range.surroundContents(highlightSpan);
            } catch (e) {
              // Fallback if surroundContents fails
              const contents = range.extractContents();
              highlightSpan.appendChild(contents);
              range.insertNode(highlightSpan);
            }

            // Scroll to the highlighted section with better positioning
            setTimeout(() => {
              highlightSpan.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }, 100);

            console.log("Demo highlight applied successfully");
          } catch (error) {
            console.error("Error applying demo highlight:", error);
            // Fallback: just scroll to the transcript
            transcriptElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 1000);
    }
  }, []);

  return {
    shareTooltip,
    copiedFeedback,
    handleShareLink,
    handleTextSelection,
    processHighlightFromUrl,
  };
}
