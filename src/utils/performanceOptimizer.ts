/**
 * Performance Optimization Utility
 *
 * This utility helps identify unused components and provides optimization recommendations.
 * Run this during development to identify potential optimizations.
 */

// List of UI components that are actually used in the app
export const USED_UI_COMPONENTS = [
  "avatar",
  "badge",
  "button",
  "card",
  "input",
  "label",
  "textarea",
  "toast",
  "toaster",
] as const;

// Full list of available UI components
export const ALL_UI_COMPONENTS = [
  "accordion",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input-otp",
  "input",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toaster",
  "toggle-group",
  "toggle",
  "tooltip",
  "use-toast",
] as const;

// Components that could potentially be removed
export const POTENTIALLY_UNUSED_COMPONENTS = ALL_UI_COMPONENTS.filter(
  (component) => !USED_UI_COMPONENTS.includes(component as any),
);

/**
 * Performance recommendations for the application
 */
export const PERFORMANCE_RECOMMENDATIONS = {
  // Bundle size optimizations
  bundleOptimizations: [
    "Remove unused UI components",
    "Implement tree shaking for Radix UI imports",
    "Use dynamic imports for admin-only components",
    "Minimize CSS bundle size",
  ],

  // Loading optimizations
  loadingOptimizations: [
    "Implement lazy loading for images",
    "Use Suspense for code splitting",
    "Preload critical fonts and assets",
    "Enable service worker caching",
  ],

  // Runtime optimizations
  runtimeOptimizations: [
    "Use React.memo for heavy components",
    "Implement virtual scrolling for large lists",
    "Debounce search and input handlers",
    "Cache API responses",
  ],
};

/**
 * Check if the app is running in production mode
 */
export const isProduction = () => import.meta.env.PROD;

/**
 * Log performance metrics in development
 */
export const logPerformanceMetrics = () => {
  if (!isProduction() && typeof window !== "undefined") {
    console.group("🚀 Performance Optimization Report");
    console.log("✅ Lazy loading implemented for:", [
      "Profile pages",
      "Admin form",
      "Footer",
    ]);
    console.log("📦 Bundle splitting enabled for:", [
      "Vendor libs",
      "UI components",
      "Utils",
    ]);
    console.log("🖼️ Image optimization:", "Lazy loading + proper sizing");
    console.log(
      "⚡ Unused components to remove:",
      POTENTIALLY_UNUSED_COMPONENTS.length,
    );
    console.groupEnd();
  }
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  if (typeof window === "undefined") return;

  // Preload critical fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  fontLink.as = "style";
  document.head.appendChild(fontLink);

  // Preload critical images (if any)
  // Example: preloadImage('/logo.png');
};

/**
 * Utility to preload an image
 */
export const preloadImage = (src: string) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = src;
  link.as = "image";
  document.head.appendChild(link);
};
