export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ✅ App is Working!
        </h1>
        <p className="text-gray-600 mb-4">
          This is a simple test page to verify routing works.
        </p>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 underline">
            Go to Homepage
          </a>
          <a href="/admin-stats-d1g3Yt9" className="text-blue-600 underline">
            Go to Admin
          </a>
          <a href="/profile/william-jones" className="text-blue-600 underline">
            Go to Profile
          </a>
        </div>
      </div>
    </div>
  );
}
