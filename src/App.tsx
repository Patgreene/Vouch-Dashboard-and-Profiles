import React, { Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import components directly instead of lazy loading to debug the issue
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DemoProfile from "./pages/DemoProfile";
import { AdminRouteGuard } from "./components/AdminRouteGuard";

// Error Boundary to catch component loading errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              There was an error loading the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-vouch-600 text-white px-4 py-2 rounded hover:bg-vouch-700"
            >
              Reload Page
            </button>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-gray-500">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // Debug logging for routing
  React.useEffect(() => {
    console.log("🔄 App mounted, current path:", window.location.pathname);
    console.log("🔄 Current URL:", window.location.href);

    // Auto-redirect to admin if on root and no profiles to show
    if (window.location.pathname === "/") {
      console.log("📍 On root path - ready to navigate to admin or profiles");
    }
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Admin dashboard as default landing page */}
          <Route path="/" element={<AdminRouteGuard />} />

          {/* Profile routes - more specific matching */}
          <Route path="/profile/:id" element={<Profile />} />

          {/* Demo profile - standalone example */}
          <Route path="/demo" element={<DemoProfile />} />

          {/* Explicit not-found route */}
          <Route path="/not-found" element={<NotFound />} />

          {/* Catch-all route for 404s - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
