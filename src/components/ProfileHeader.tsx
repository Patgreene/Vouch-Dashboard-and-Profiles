import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
          {/* Avatar */}
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={profile.photo} alt={profile.name} />
            <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-vouch-500 to-vouch-600 text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xl text-gray-600 mt-1">{profile.title}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {profile.linkedIn && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hover:bg-blue-50 hover:border-blue-200"
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
                  className="hover:bg-green-50 hover:border-green-200"
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
                  className="hover:bg-purple-50 hover:border-purple-200"
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

              <Button
                variant="link"
                size="sm"
                asChild
                className="text-vouch-600 hover:text-vouch-700 p-0"
              >
                <a href="/" className="flex items-center gap-1">
                  <div>What is Vouch?</div>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
