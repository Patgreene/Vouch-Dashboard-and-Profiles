import { Share2, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Adjust position for mobile to ensure tooltip stays in viewport
  useEffect(() => {
    if (!visible) return;

    const adjustPosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 140; // Approximate tooltip width
      const tooltipHeight = 60; // Approximate tooltip height
      const padding = 16; // Padding from viewport edges

      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontal position
      if (adjustedX - tooltipWidth / 2 < padding) {
        adjustedX = tooltipWidth / 2 + padding;
      } else if (adjustedX + tooltipWidth / 2 > viewportWidth - padding) {
        adjustedX = viewportWidth - tooltipWidth / 2 - padding;
      }

      // Adjust vertical position
      if (adjustedY - tooltipHeight < padding) {
        adjustedY = adjustedY + tooltipHeight + 20; // Show below selection
      }

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    };

    adjustPosition();

    // Recheck on window resize
    window.addEventListener("resize", adjustPosition);
    return () => window.removeEventListener("resize", adjustPosition);
  }, [visible, x, y]);

  if (!visible) return null;

  // Use locked position if available, otherwise use adjusted position
  const displayX = isLocked ? lockedPosition.x : adjustedPosition.x;
  const displayY = isLocked ? lockedPosition.y : adjustedPosition.y;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Lock the tooltip position to prevent jumping
    setIsLocked(true);
    setLockedPosition({ x: adjustedPosition.x, y: adjustedPosition.y });

    console.log("🔒 Tooltip position locked at", adjustedPosition);
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
      <div className="bg-slate-900 text-white px-2 sm:px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium max-w-xs">
        <button
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="cursor-pointer px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1 sm:gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          style={{
            border: "none",
            outline: "none",
            userSelect: "none",
            pointerEvents: "auto",
            color: "white",
            fontWeight: "500",
            minHeight: "32px",
          }}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Share Link</span>
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
