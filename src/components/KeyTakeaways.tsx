import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  MessageSquare,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyTakeaways as KeyTakeawaysType } from "@/lib/data";

interface KeyTakeawaysProps {
  takeaways: KeyTakeawaysType;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  color: string;
}

function TakeawaySection({ title, icon, items, color }: SectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700 text-sm leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    {
      title: "Strengths",
      icon: <Zap className="h-5 w-5 text-green-600" />,
      items: takeaways.strengths,
      color: "bg-green-100",
    },
    {
      title: "Challenges",
      icon: <AlertTriangle className="h-5 w-5" style={{ color: '#FF7A56' }} />,
      items: takeaways.weaknesses,
      color: "bg-gray-100",
    },
    {
      title: takeaways.customTitle1 || "Custom Section 1",
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
      items: takeaways.communicationStyle,
      color: "bg-blue-100",
    },
    {
      title: takeaways.customTitle2 || "Custom Section 2",
      icon: <Target className="h-5 w-5 text-purple-600" />,
      items: takeaways.waysToBringOutBest,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: "24px 32px 11px" }}>
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-vouch-50 to-blue-50 border-b">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between p-6 h-auto text-left hover:bg-transparent"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Key Takeaways
              </h2>
              <p className="text-sm text-gray-600">
                {isExpanded ? "Click to collapse" : "Click to expand"}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <CardContent className="p-6 animate-fade-in">
            <div className="grid gap-8 md:grid-cols-2">
              {sections.map((section) => (
                <TakeawaySection
                  key={section.title}
                  title={section.title}
                  icon={section.icon}
                  items={section.items}
                  color={section.color}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
