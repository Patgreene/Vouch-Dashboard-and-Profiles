import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Profile } from "@/lib/data";

interface EmailAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  profiles: Profile[];
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}

export function EmailAutocomplete({
  value,
  onChange,
  profiles,
  placeholder = "Type email address...",
  id,
  required = false,
  disabled = false,
}: EmailAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState<Profile[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique emails from profiles (filter out profiles without valid emails)
  const uniqueEmails = useMemo(() => {
    return profiles
      .filter(
        (profile) =>
          profile &&
          profile.email &&
          typeof profile.email === "string" &&
          profile.email.trim() !== "",
      )
      .filter(
        (profile, index, arr) =>
          arr.findIndex(
            (p) =>
              p.email &&
              profile.email &&
              p.email.toLowerCase() === profile.email.toLowerCase(),
          ) === index,
      );
  }, [profiles]);

  // Filter emails based on input value
  useEffect(() => {
    if (value && value.length > 0) {
      const searchTerm = value.toLowerCase();
      const filtered = uniqueEmails.filter((profile) => {
        const email = profile.email?.toLowerCase() || "";
        const name = profile.name?.toLowerCase() || "";
        const title = profile.title?.toLowerCase() || "";
        const company = profile.company?.toLowerCase() || "";

        return (
          email.includes(searchTerm) ||
          name.includes(searchTerm) ||
          title.includes(searchTerm) ||
          company.includes(searchTerm)
        );
      });
      setFilteredEmails(filtered);
      setIsOpen(filtered.length > 0 && value !== "");
    } else {
      setFilteredEmails([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value, uniqueEmails]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  // Handle option selection
  const handleOptionSelect = (email: string) => {
    if (email && typeof email === "string") {
      onChange(email);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && filteredEmails.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prev) =>
          prev < filteredEmails.length - 1 ? prev + 1 : 0,
        );
        e.preventDefault();
        break;
      case "ArrowUp":
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredEmails.length - 1,
        );
        e.preventDefault();
        break;
      case "Enter":
        if (highlightedIndex >= 0 && filteredEmails[highlightedIndex]) {
          handleOptionSelect(filteredEmails[highlightedIndex].email);
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (value.length > 0 && filteredEmails.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="email"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="pr-8"
          autoComplete="off"
        />
        <ChevronDown
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredEmails.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredEmails.map((profile, index) => {
            const profileEmail = profile.email || "";
            const profileName = profile.name || "Unknown";
            const profileTitle = profile.title || "";
            const profileCompany = profile.company || "";

            return (
              <div
                key={profile.id || index}
                className={`px-3 py-2 cursor-pointer transition-colors flex items-center justify-between ${
                  index === highlightedIndex
                    ? "bg-vouch-50 text-vouch-900"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => handleOptionSelect(profileEmail)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {profileEmail}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {profileName}
                    {profileTitle && ` • ${profileTitle}`}
                    {profileCompany && ` • ${profileCompany}`}
                  </div>
                </div>
                {value &&
                  profileEmail &&
                  value.toLowerCase() === profileEmail.toLowerCase() && (
                    <Check className="h-4 w-4 text-vouch-600 ml-2 flex-shrink-0" />
                  )}
              </div>
            );
          })}
        </div>
      )}

      {/* Show "No matches" when typing but no results */}
      {isOpen && filteredEmails.length === 0 && value.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="px-3 py-2 text-sm text-gray-500">
            No profiles found with this email
          </div>
        </div>
      )}
    </div>
  );
}
