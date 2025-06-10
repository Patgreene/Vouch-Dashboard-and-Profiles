export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Powered by</span>
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gradient-to-br from-vouch-500 to-vouch-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-semibold">V</span>
              </div>
              <span className="font-semibold text-vouch-600">Vouch</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Professional references made shareable
          </p>
        </div>
      </div>
    </footer>
  );
}
