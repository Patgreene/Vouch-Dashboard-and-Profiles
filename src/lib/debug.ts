// Debug utilities for highlight functionality
export function debugHighlightFeature() {
  console.log("🔍 Starting highlight feature debug...");

  // Check if we're on a profile page
  const currentPath = window.location.pathname;
  console.log("Current path:", currentPath);

  if (!currentPath.includes("/profile/")) {
    console.log("❌ Not on a profile page");
    return;
  }

  // Check for transcript elements
  const transcriptElements = document.querySelectorAll('[id^="transcript-"]');
  console.log("📄 Found transcript elements:", transcriptElements.length);

  transcriptElements.forEach((element, index) => {
    console.log(`Transcript ${index + 1}:`, {
      id: element.id,
      textContent: element.textContent?.substring(0, 100) + "...",
      hasMouseUpListener: element.onmouseup !== null,
    });
  });

  // Test text selection
  console.log("📝 To test selection:");
  console.log("1. Highlight some text in a transcript");
  console.log("2. Run: debugTextSelection()");

  // Make functions available globally for testing
  (window as any).debugTextSelection = debugTextSelection;
  (window as any).testClipboard = testClipboard;
  (window as any).debugHighlightFeature = debugHighlightFeature;
}

export function debugTextSelection() {
  console.log("🎯 Checking current text selection...");

  const selection = window.getSelection();

  if (!selection) {
    console.log("❌ No selection object available");
    return;
  }

  console.log("Selection details:", {
    rangeCount: selection.rangeCount,
    selectedText: selection.toString(),
    selectedTextLength: selection.toString().length,
    isCollapsed: selection.isCollapsed,
  });

  if (selection.rangeCount === 0) {
    console.log("❌ No ranges in selection");
    return;
  }

  const range = selection.getRangeAt(0);
  console.log("Range details:", {
    startContainer: range.startContainer,
    endContainer: range.endContainer,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    commonAncestorContainer: range.commonAncestorContainer,
  });

  // Check if selection is within a transcript
  const transcriptElements = document.querySelectorAll('[id^="transcript-"]');
  let foundTranscript = null;

  for (const element of transcriptElements) {
    if (element.contains(range.commonAncestorContainer)) {
      foundTranscript = element;
      break;
    }
  }

  if (foundTranscript) {
    console.log("✅ Selection is within transcript:", foundTranscript.id);

    // Calculate absolute position
    const transcriptText = foundTranscript.textContent || "";
    const beforeSelection = range.cloneRange();
    beforeSelection.selectNodeContents(foundTranscript);
    beforeSelection.setEnd(range.startContainer, range.startOffset);
    const startOffset = beforeSelection.toString().length;
    const endOffset = startOffset + selection.toString().length;

    console.log("Calculated positions:", {
      startOffset,
      endOffset,
      selectedText: selection.toString(),
      transcriptLength: transcriptText.length,
    });

    // Test URL generation
    const profileId = window.location.pathname.split("/profile/")[1];
    const transcriptId = foundTranscript.id.replace("transcript-", "");

    const testUrl = `${window.location.origin}/profile/${profileId}?t=${transcriptId}&s=${startOffset}&e=${endOffset}`;
    console.log("🔗 Generated URL:", testUrl);

    // Test clipboard
    testClipboard(testUrl);
  } else {
    console.log("❌ Selection is not within any transcript");
  }
}

export async function testClipboard(
  text: string = "Test clipboard functionality",
) {
  console.log("📋 Testing clipboard with text:", text);

  try {
    // Check if clipboard API is available
    if (navigator.clipboard) {
      console.log("✅ Clipboard API available");
      await navigator.clipboard.writeText(text);
      console.log("✅ Successfully copied with navigator.clipboard");

      // Try to read it back
      try {
        const readText = await navigator.clipboard.readText();
        console.log(
          "✅ Successfully read back:",
          readText === text ? "MATCH" : "MISMATCH",
        );
      } catch (err) {
        console.log(
          "⚠️ Could not read from clipboard (permission issue):",
          err,
        );
      }

      return true;
    } else {
      console.log("❌ Clipboard API not available, trying fallback");

      // Test fallback method
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      console.log("Fallback copy result:", successful);
      return successful;
    }
  } catch (err) {
    console.log("❌ Clipboard test failed:", err);
    return false;
  }
}

// Auto-run debug when this file is loaded
if (typeof window !== "undefined") {
  // Make debug functions available globally
  (window as any).debugHighlightFeature = debugHighlightFeature;
  (window as any).debugTextSelection = debugTextSelection;
  (window as any).testClipboard = testClipboard;

  console.log("🛠️ Debug functions available:");
  console.log("- debugHighlightFeature(): Check overall setup");
  console.log("- debugTextSelection(): Check current text selection");
  console.log('- testClipboard("text"): Test clipboard functionality');
}
