import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    onShare: !!onShare,
  });

  if (!visible) return null;

  const handleClick = (e: React.MouseEvent) => {
    console.log("🔥 ShareTooltip button clicked!");
    e.preventDefault();
    e.stopPropagation();

    if (onShare) {
      console.log("🚀 Calling onShare handler");
      onShare();
    } else {
      console.log("❌ No onShare handler provided!");
    }
  };

  return (
    <div
      className="fixed z-50 animate-fade-in"
      style={{
        left: x,
        top: y,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleClick}
          className="text-white hover:bg-slate-700 h-auto px-2 py-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-1" />
              Share Link
            </>
          )}
        </Button>

        {/* Backup simple div for testing */}
        <div
          onClick={handleClick}
          className="ml-2 cursor-pointer bg-blue-600 px-2 py-1 rounded text-xs"
          style={{ pointerEvents: "auto" }}
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
