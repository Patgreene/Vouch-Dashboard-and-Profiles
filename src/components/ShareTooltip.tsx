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
  const [isPressed, setIsPressed] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [stablePosition, setStablePosition] = useState({ x: 0, y: 0 });

  // Lock position when tooltip becomes visible to prevent jumping
  useEffect(() => {
    if (visible) {
      const adjustPosition = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = 160; // Approximate tooltip width
        const tooltipHeight = 80; // Approximate tooltip height
        const padding = 16; // Padding from viewport edges

        let adjustedX = x;
        let adjustedY = y;

        // Adjust horizontal position
        if (adjustedX - tooltipWidth / 2 < padding) {
          adjustedX = tooltipWidth / 2 + padding;
        } else if (adjustedX + tooltipWidth / 2 > viewportWidth - padding) {
          adjustedX = viewportWidth - tooltipWidth / 2 - padding;
        }

        // Adjust vertical position - always show above selection
        adjustedY = Math.max(adjustedY - 20, tooltipHeight + padding);

        setAdjustedPosition({ x: adjustedX, y: adjustedY });
        setStablePosition({ x: adjustedX, y: adjustedY });
      };

      adjustPosition();
    }
  }, [visible, x, y]);

  if (!visible) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPressed(true);
    console.log("🔒 Button pressed - position locked");
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPressed) {
      console.log("🚀 Executing share action on mouseup");

      if (onShare) {
        try {
          onShare();
          console.log("✅ Share action completed");
        } catch (error) {
          console.error("❌ Error in onShare:", error);
        }
      }
    }

    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Click is handled by mouseup for better UX
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50"
      style={{
        left: stablePosition.x,
        top: stablePosition.y,
        transform: "translateX(-50%) translateY(-100%)",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    >
      {/* Main tooltip container with modern styling */}
      <div className="bg-white border border-gray-200 px-1 py-1 rounded-xl shadow-lg backdrop-blur-sm">
        <button
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`
            group relative overflow-hidden
            flex items-center gap-2 
            px-4 py-2.5
            bg-gradient-to-r from-vouch-500 to-vouch-600
            hover:from-vouch-600 hover:to-vouch-700
            text-white font-medium text-sm
            rounded-lg
            transition-all duration-200 ease-out
            transform-gpu
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-vouch-500 focus:ring-offset-2 focus:ring-offset-white
            ${isPressed ? "scale-[0.98] shadow-sm" : "scale-100"}
            ${copied ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" : ""}
          `}
          style={{
            minHeight: "40px",
            userSelect: "none",
            WebkitUserSelect: "none",
            position: "relative",
          }}
        >
          {/* Button content */}
          <div className="flex items-center gap-2 relative z-10">
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-2" />
                <span className="whitespace-nowrap font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 stroke-2" />
                <span className="whitespace-nowrap font-medium">
                  Share Link
                </span>
              </>
            )}
          </div>

          {/* Subtle shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </div>
        </button>
      </div>

      {/* Arrow with matching styling */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid white",
          top: "100%",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      />
    </div>
  );
}
