interface VouchLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function VouchLogo({ className = "", size = "md" }: VouchLogoProps) {
  const sizeClasses = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-12",
  };

  return (
    <svg
      viewBox="0 0 500 100"
      className={`${sizeClasses[size]} w-auto ${className}`}
      fill="currentColor"
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="90"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-2"
      >
        VOUCH
      </text>
    </svg>
  );
}
