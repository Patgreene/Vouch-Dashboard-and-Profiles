import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Share2,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllProfiles } from "@/lib/data";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-vouch-100 rounded-lg">{icon}</div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Index() {
  const profiles = getAllProfiles();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">Vouch</h1>
            </div>
            <Badge
              variant="outline"
              className="text-vouch-600 border-vouch-200"
            >
              Beta
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Professional References,
              <span className="gradient-text block">Reimagined</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Vouch transforms traditional reference checks into rich, detailed
              profiles featuring in-depth peer reviews and key insights that
              help you understand the real person behind the resume.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-bg text-lg px-8 py-3">
                Explore Profiles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Vouch Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We conduct detailed interviews with colleagues and managers to
              create comprehensive professional profiles with actionable
              insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-6 w-6 text-vouch-600" />}
              title="Detailed Profiles"
              description="Rich profiles featuring peer reviews, key takeaways, and professional insights from colleagues who've worked closely with each candidate."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6 text-vouch-600" />}
              title="Shareable Insights"
              description="Highlight and share specific quotes or insights with a simple link. Perfect for discussing candidates with your team."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-vouch-600" />}
              title="Key Takeaways"
              description="Structured insights including strengths, communication style, and recommendations for bringing out their best work."
            />
          </div>
        </div>
      </div>

      {/* Sample Profiles */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sample Profiles
            </h2>
            <p className="text-lg text-gray-600">
              Explore these example profiles to see how Vouch captures the full
              picture of professional capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {profile.name}
                      </h3>
                      <p className="text-gray-600">{profile.title}</p>
                      {profile.company && (
                        <Badge variant="outline" className="mt-1">
                          {profile.company}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {profile.transcripts.length} peer review
                      {profile.transcripts.length !== 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Key takeaways and insights
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Shareable highlights
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link to={`/profile/${profile.id}`}>
                      View Full Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h2 className="text-2xl font-bold">Vouch</h2>
            </div>
            <p className="text-gray-400">
              Professional references, reimagined for the modern workplace.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
