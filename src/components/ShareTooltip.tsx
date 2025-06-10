import { Share2, Check } from "lucide-react";

interface ShareTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  onShare: () => void;
  copied?: boolean;
}

export function ShareTooltip({
  visible,
  x,
  y,
  onShare,
  copied = false,
}: ShareTooltipProps) {
  console.log("🎯 ShareTooltip render:", {
    visible,
    x,
    y,
    copied,
    onShareExists: !!onShare,
  });

  if (!visible) return null;

  // Direct click handler
  const handleDirectClick = () => {
    console.log("🔥 DIRECT CLICK HANDLER FIRED!");

    if (onShare) {
      console.log("🚀 Calling onShare function");
      onShare();
    } else {
      console.log("❌ onShare is not defined");
    }
  };

  // Alternative click handler for testing
  const handleTestClick = () => {
    console.log("🧪 TEST CLICK HANDLER FIRED!");
    alert("Test button clicked! onShare exists: " + !!onShare);

    if (onShare) {
      console.log("🚀 Calling onShare from test handler");
      onShare();
    }
  };

  return (
    <div
      className="fixed z-50 animate-fade-in"
      style={{
        left: x,
        top: y,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 9999, // Ensure it's on top
      }}
    >
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        {/* Method 1: Simple div button */}
        <div
          onClick={handleDirectClick}
          className="cursor-pointer px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share Link
            </>
          )}
        </div>

        {/* Method 2: HTML button element */}
        <button
          onClick={handleDirectClick}
          onMouseDown={(e) => {
            console.log("🖱️ Button mousedown");
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            console.log("🖱️ Button mouseup");
            e.stopPropagation();
          }}
          className="ml-2 cursor-pointer px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
          style={{
            border: "none",
            outline: "none",
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          BTN
        </button>

        {/* Method 3: Test button */}
        <div
          onClick={handleTestClick}
          onMouseDown={() => console.log("🖱️ Test div mousedown")}
          onMouseUp={() => console.log("🖱️ Test div mouseup")}
          className="ml-2 cursor-pointer px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          TEST
        </div>
      </div>

      {/* Arrow */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid rgb(15 23 42)",
          top: "100%",
        }}
      />
    </div>
  );
}
