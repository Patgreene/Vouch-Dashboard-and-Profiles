import { VouchLogo } from "@/components/VouchLogo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center text-gray-500 text-sm gap-2">
          <span>Powered by</span>
          <a
            href="https://www.vouchprofile.com/"
            className="ml-1 w-16 h-6 bg-cover bg-center bg-no-repeat rounded cursor-pointer"
            style={{
              backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2F5458c0c30e7f4da8ac941780333ddd13)"
            }}
          />
        </div>
          <p className="text-xs text-gray-400 text-center">
            Professional References Made Shareable
          </p>
        </div>
      </div>
    </footer>
  );
}