export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span>Powered by</span>
            <span className="ml-2 text-vouch-600">Vouch</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Professional References Made Shareable
          </p>
        </div>
      </div>
    </footer>
  );
}
