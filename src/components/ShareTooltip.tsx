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
    onShareType: typeof onShare,
  });

  if (!visible) return null;

  // Test onShare immediately
  console.log("🧪 Testing onShare function:", onShare);

  // Multiple click handlers for testing
  const handleClick1 = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("✅ Share Link button clicked (method 1)!");
    console.log("🔍 Event details:", e);

    if (onShare) {
      console.log("🚀 Calling onShare function");
      try {
        onShare();
        console.log("✅ onShare called successfully");
      } catch (error) {
        console.log("❌ Error calling onShare:", error);
      }
    } else {
      console.log("❌ onShare is not defined");
    }
  };

  const handleClick2 = () => {
    console.log("✅ Share Link button clicked (method 2)!");
    onShare?.();
  };

  const handleClick3 = () => {
    console.log("✅ Share Link button clicked (method 3)!");
    if (typeof onShare === "function") {
      onShare();
    } else {
      console.log("❌ onShare is not a function:", typeof onShare);
    }
  };

  // Mouse event handlers for debugging
  const handleMouseDown = (e: any) => {
    console.log("🖱️ Button mousedown");
    e.stopPropagation();
  };

  const handleMouseUp = (e: any) => {
    console.log("🖱️ Button mouseup");
    e.stopPropagation();
  };

  return (
    <div
      className="fixed z-50 animate-fade-in"
      style={{
        left: x,
        top: y,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 9999,
      }}
      onClick={() => console.log("🎯 Tooltip container clicked")}
    >
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg flex flex-col gap-2 text-sm font-medium">
        {/* Method 1: HTML Button with extensive debugging */}
        <button
          onClick={handleClick1}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="cursor-pointer px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 transition-colors"
          style={{
            border: "none",
            outline: "none",
            userSelect: "none",
            pointerEvents: "auto",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
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
        </button>

        {/* Method 2: Simple div */}
        <div
          onClick={handleClick2}
          className="cursor-pointer px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-center text-xs"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          DIV METHOD
        </div>

        {/* Method 3: Raw HTML */}
        <div
          onClick={handleClick3}
          onMouseDown={() => console.log("🖱️ Raw method mousedown")}
          className="cursor-pointer px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-center text-xs"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          RAW METHOD
        </div>

        {/* Method 4: Direct inline onClick */}
        <div
          onClick={() => {
            console.log("✅ INLINE CLICK WORKS!");
            onShare && onShare();
          }}
          className="cursor-pointer px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-center text-xs"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          INLINE
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
