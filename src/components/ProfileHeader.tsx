import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VouchLogo } from "@/components/VouchLogo";
import { Profile } from "@/lib/data";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Back button - positioned absolutely for centering layout */}
          <div className="relative w-full">
            <a
              href="https://www.vouchprofile.com/"
              className="absolute top-0 left-0 text-gray-500 hover:text-gray-700 text-xs font-normal transition-colors duration-200"
            >
              What is Vouch?
            </a>
          </div>

          {/* Centered Avatar */}
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 ring-2 ring-white shadow-lg profile-avatar-large">
            <AvatarImage
              src={profile.photo}
              alt={profile.name}
              className="object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <AvatarFallback className="text-lg sm:text-xl font-semibold bg-gradient-to-br from-vouch-500 to-vouch-600 text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* Centered Profile Info */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {profile.name}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-1 leading-relaxed">
                {profile.title}
              </p>
            </div>

            {/* Centered Action Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {profile.linkedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hover:bg-blue-50 hover:border-blue-200 text-xs sm:text-sm"
                >
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
              )}

              {profile.cv && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hover:bg-green-50 hover:border-green-200 text-xs sm:text-sm"
                >
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CV
                  </a>
                </Button>
              )}

              {profile.portfolio && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hover:bg-purple-50 hover:border-purple-200 text-xs sm:text-sm"
                >
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
