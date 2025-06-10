import { VouchLogo } from "@/components/VouchLogo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <VouchLogo size="sm" className="text-vouch-600" />
          </div>
          <p className="text-xs text-gray-400 text-center">
            Professional References Made Shareable
          </p>
        </div>
      </div>
    </footer>
  );
}
