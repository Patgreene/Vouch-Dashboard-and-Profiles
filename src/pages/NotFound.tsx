import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl">V</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The profile you're looking for doesn't exist or may have been moved.
            Let's get you back to exploring available profiles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gradient-bg">
            <a href="https://www.vouchprofile.com/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </a>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
