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
  console.log("🎯 ShareTooltip render called with:", {
    visible,
    x,
    y,
    copied,
    onShareExists: !!onShare,
  });

  if (!visible) {
    console.log("❌ ShareTooltip not visible, returning null");
    return null;
  }

  console.log("✅ ShareTooltip should be visible, rendering...");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔗 Share Link button clicked!");

    if (onShare) {
      console.log("🚀 Calling onShare function");
      onShare();
    } else {
      console.log("❌ No onShare function provided");
    }
  };

  const tooltipStyle = {
    left: x,
    top: y,
    transform: "translateX(-50%) translateY(-100%)",
    zIndex: 9999,
  };

  console.log("📍 Tooltip positioning:", tooltipStyle);

  return (
    <div
      className="fixed z-50 animate-fade-in"
      style={tooltipStyle}
      onClick={(e) => {
        console.log("🎯 Tooltip container clicked");
        e.stopPropagation();
      }}
    >
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <button
          onClick={handleClick}
          onMouseDown={(e) => {
            console.log("🖱️ Button mousedown");
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            console.log("🖱️ Button mouseup");
            e.stopPropagation();
          }}
          className="cursor-pointer px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Emergency backup button for testing */}
        <div
          onClick={handleClick}
          onMouseDown={() => console.log("🖱️ Backup button mousedown")}
          className="ml-2 cursor-pointer px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
          style={{
            userSelect: "none",
            pointerEvents: "auto",
          }}
        >
          BACKUP
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
