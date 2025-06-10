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
  if (!visible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔗 Share Link button clicked");

    if (onShare) {
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
        zIndex: 9999,
      }}
    >
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <button
          onClick={handleClick}
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
