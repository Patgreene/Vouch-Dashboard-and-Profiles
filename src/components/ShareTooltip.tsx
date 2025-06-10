import { Share2, Check } from "lucide-react";
import { useState, useRef } from "react";

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
  const [isLocked, setIsLocked] = useState(false);
  const [lockedPosition, setLockedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (!visible) return null;

  // Use locked position if available, otherwise use current position
  const displayX = isLocked ? lockedPosition.x : x;
  const displayY = isLocked ? lockedPosition.y : y;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Lock the tooltip position to prevent jumping
    setIsLocked(true);
    setLockedPosition({ x, y });

    console.log("🔒 Tooltip position locked at", { x, y });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🖱️ Mouse up on button");
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(
      "🔗 Share Link button clicked - preventing default and stopping propagation",
    );

    if (onShare) {
      // Delay the clipboard operation to ensure the click event completes
      setTimeout(() => {
        console.log("🚀 Executing onShare after timeout");
        try {
          onShare();

          // Unlock position after successful execution
          setTimeout(() => {
            setIsLocked(false);
            console.log("🔓 Tooltip position unlocked");
          }, 100);
        } catch (error) {
          console.log("❌ Error in onShare:", error);
          setIsLocked(false);
        }
      }, 0);
    } else {
      console.log("❌ No onShare function provided");
      setIsLocked(false);
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 animate-fade-in"
      style={{
        left: displayX,
        top: displayY,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    >
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <button
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
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
