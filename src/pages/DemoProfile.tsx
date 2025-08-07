import { useState, useEffect, lazy, Suspense } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { EnhancedTranscriptCard } from "@/components/EnhancedTranscriptCard";
import { ShareTooltip } from "@/components/ShareTooltip";
import { DemoHints } from "@/components/DemoHints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoHighlight } from "@/hooks/useDemoHighlight";

// Lazy load Footer component
const Footer = lazy(() =>
  import("@/components/Footer").then((module) => ({
    default: module.Footer,
  })),
);

// Hardcoded demo data for Lara Rosu
const demoProfile = {
  id: "lara-rosu-demo",
  name: "Lara Rosu",
  title: "UX/UI Designer",
  email: "lara@example.com",
  company: "Freelance",
  photo:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
  linkedIn: "https://www.linkedin.com",
  cv: "https://346e5b85-9540-4d6d-9b91-a5687962078d.filesusr.com/ugd/9e6f36_e43a83ee41994d668a468ea4a187bbe9.pdf",
  portfolio:
    "https://www.vouchprofile.com/_files/ugd/9e6f36_d33d3698b6bd4749a0316343ad9d0cd0.pdf",
  keyTakeaways: {
    strengths: [
      "A keen eye for what matters: fast, clear, and flawless design.",
    ],
    weaknesses: [
      "Lara's learning that messy, fast, and collaborative often beats polished and late.",
    ],
    communicationStyle: [
      "Collaborating with Lara is a creative partnership - she listens, clarifies, and aligns teams for lasting impact.",
    ],
    waysToBringOutBest: [
      "Lara's work boosts metrics, doubles activation, and makes products easier to use, globally.",
    ],
    customTitle1: "Collaborator",
    customTitle2: "Activator",
  },
  transcripts: [
    {
      id: "demo-transcript-1",
      speakerName: "Clara Jensen",
      speakerRole: "Head of Product Design",
      speakerEmail: "clara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      interviewDate: "2024-06-15",
      content:
        "Lara joined our team on what was meant to be a short-term contract, just six months to support a product refresh, but from day one, it was clear she brought something different. She has this rare ability to not only see problems others miss, but to approach them with fresh, user-centred solutions that actually move the needle. She has one of the most creative minds I've ever worked with.\n\nWhat really blew me away, though, was her ability to connect with people. Whether it was a developer, a stakeholder, or a user in a research session, she just knows how to listen, empathise, and bring people with her. It made working with her feel effortless – like everyone naturally did better work when she was in the room. She made us more thoughtful as a team.\n\nHer designs helped increase engagement by 40% and dramatically reduced support tickets, but more than the numbers, she raised the standard for what good looks like. If I had to be honest about one thing, it's that she can be incredibly hard on herself. She sets the bar so high, and sometimes pushes past the point of \"good enough.\" But that drive? That's also what makes her exceptional. If I could build a team from scratch, she's one of the first people I'd call.",
      verificationStatus: "verified" as const,
    },
    {
      id: "demo-transcript-2",
      speakerName: "Tomás Ortega",
      speakerRole: "Co-founder at Looply",
      speakerEmail: "tomas@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2025-07-20",
      content:
        "We brought Lara in during a make-or-break moment our MVP was functional, but users weren't sticking. Engagement was flat, and we couldn't figure out why. Lara didn't just come in with a Figma file; she spent the first two weeks actually using our product, talking to our existing users, and identifying friction points we were completely blind to.\n\nWhat I loved about working with Lara is that she thinks like a founder. She understood that every design decision had to move the needle on our key metrics. She proposed solutions that weren't just beautiful, but were specifically designed to increase user retention and reduce churn. Her redesign of our onboarding flow alone improved our day-7 retention from 23% to 67%.\n\nLara also has this rare ability to work fast without sacrificing quality. In a startup environment where everything is urgent, she managed to deliver polished, user-tested designs on tight timelines. She became an extension of our core team, and honestly, I can't imagine launching without her input.",
      verificationStatus: "not_started" as const,
    },
    {
      id: "demo-transcript-3",
      speakerName: "David Nari",
      speakerRole: "Senior Frontend Developer",
      speakerEmail: "david@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      interviewDate: "2025-05-10",
      content:
        "I worked with Lara on a couple of startup projects where she handled the full UX/UI flow and let me just say, handing off designs from her is a developer's dream. Her files are clean, her logic is sound, and she actually thinks about implementation complexity when designing. She uses consistent spacing, proper component structures, and always includes hover states and edge cases.\n\nBut beyond the technical execution, Lara just gets how users think. She has this intuitive understanding of user behavior that shows up in every interaction she designs. Buttons are exactly where you expect them, navigation flows feel natural, and complex features somehow feel simple to use.\n\nWhat really sets Lara apart is her willingness to iterate based on real user feedback. I've worked with designers who get precious about their work, but Lara actively seeks out ways to improve. She'll test prototypes, gather feedback, and refine designs until they're genuinely user-friendly, not just visually appealing.",
      verificationStatus: "verified" as const,
    },
    {
      id: "demo-transcript-4",
      speakerName: "Amira Shah",
      speakerRole: "Founder at Kindling",
      speakerEmail: "amira@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2024-08-05",
      content:
        "Lara was instrumental in helping us design our mobile app from the ground up. As a non-technical founder, I was worried about the complexity of translating our vision into a user-friendly mobile experience. Lara not only understood our vision but helped refine and improve it through her design process.\n\nShe has this wonderful ability to balance user needs with business objectives. Every design recommendation came with clear reasoning about how it would impact user experience and, ultimately, our bottom line. She helped us prioritize features based on user value and implementation complexity, which was incredibly valuable for a resource-constrained startup.\n\nThe app Lara designed for us launched to fantastic user reviews, with particular praise for its intuitive interface and smooth user experience. Six months post-launch, we're seeing strong user retention and minimal support requests related to usability issues. Lara's work laid the foundation for our product's success.",
      verificationStatus: "pending" as const,
    },
  ],
};

const demoGivenTranscripts = [
  {
    transcript: {
      id: "demo-given-1",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2024-09-12",
      content:
        "I had the pleasure of working with Marcus on a fintech project where precision and user trust were absolutely critical. What immediately stood out was his deep understanding of both the technical requirements and user psychology in financial applications. Marcus has this rare ability to build complex backend systems while keeping the end-user experience at the forefront of every decision.\n\nHis code is exceptionally clean and well-documented, which made collaboration seamless. But what really impressed me was his proactive approach to identifying potential UX issues before they became problems. He would regularly suggest technical solutions that enhanced the user experience, showing a level of product thinking that goes far beyond traditional development.\n\nMarcus is also incredibly reliable under pressure. During our product launch, when we encountered unexpected technical challenges, he worked tirelessly to resolve issues while keeping the team informed and maintaining quality standards. His technical expertise combined with his collaborative spirit makes him an invaluable team member.",
      verificationStatus: "verified" as const,
    },
    recipientProfile: {
      id: "marcus-demo",
      name: "Marcus Chen",
      title: "Senior Backend Engineer",
      email: "marcus@example.com",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "FinTech Startup",
      keyTakeaways: {
        strengths: [],
        weaknesses: [],
        communicationStyle: [],
        waysToBringOutBest: [],
      },
      transcripts: [],
    },
  },
  {
    transcript: {
      id: "demo-given-2",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2024-10-03",
      content:
        "Working with Sarah on our e-commerce platform redesign was an absolute joy. As a project manager, Sarah has this incredible ability to keep complex projects on track while maintaining team morale and ensuring quality doesn't suffer. She creates an environment where everyone feels heard and valued, which brings out the best in the entire team.\n\nWhat sets Sarah apart is her strategic thinking combined with meticulous attention to detail. She doesn't just manage timelines; she anticipates potential roadblocks and creates contingency plans. Her communication style is clear and consistent, ensuring everyone stays aligned on priorities and deliverables.\n\nSarah also has a genuine understanding of user experience principles, which made our collaboration particularly effective. She knew when to push back on scope creep and when to advocate for design changes that would improve the user experience. The project delivered on time, within budget, and exceeded our user satisfaction targets.",
      verificationStatus: "pending" as const,
    },
    recipientProfile: {
      id: "sarah-demo",
      name: "Sarah Williams",
      title: "Senior Project Manager",
      email: "sarah@example.com",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "E-commerce Agency",
      keyTakeaways: {
        strengths: [],
        weaknesses: [],
        communicationStyle: [],
        waysToBringOutBest: [],
      },
      transcripts: [],
    },
  },
];

export default function DemoProfile() {
  const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(
    new Set(),
  );

  // Check URL parameters on load to expand highlighted transcript
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transcriptId = urlParams.get("t");

    if (transcriptId) {
      // Expand the transcript that contains the highlight
      setExpandedTranscripts(new Set([transcriptId]));
    }
  }, []);

  // Initialize demo-specific highlight functionality
  const {
    shareTooltip,
    copiedFeedback,
    handleShareLink,
    handleTextSelection,
    processHighlightFromUrl,
  } = useDemoHighlight();

  const toggleTranscript = (transcriptId: string) => {
    const newExpanded = new Set(expandedTranscripts);
    if (newExpanded.has(transcriptId)) {
      newExpanded.delete(transcriptId);
    } else {
      newExpanded.add(transcriptId);
    }
    setExpandedTranscripts(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader profile={demoProfile} />

      {/* Key Takeaways */}
      <KeyTakeaways takeaways={demoProfile.keyTakeaways} />

      {/* Transcripts Section */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ margin: "-3px auto 0", padding: "11px 32px 24px" }}
      >
        <Tabs defaultValue="received" className="w-full">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Interview Transcripts
            </h2>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received" className="text-sm">
                Received ({demoProfile.transcripts?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="given" className="text-sm">
                Given ({demoGivenTranscripts.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="received" className="space-y-4 sm:space-y-6">
            {demoProfile.transcripts && demoProfile.transcripts.length > 0 ? (
              demoProfile.transcripts.map((transcript) => (
                <EnhancedTranscriptCard
                  key={`received-${transcript.id}`}
                  transcript={transcript}
                  profileId="lara-rosu-demo"
                  isExpanded={expandedTranscripts.has(transcript.id)}
                  onToggle={() => toggleTranscript(transcript.id)}
                  onTextSelection={handleTextSelection}
                  processHighlightFromUrl={processHighlightFromUrl}
                  mode="received"
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No received transcripts available
              </div>
            )}
          </TabsContent>

          <TabsContent value="given" className="space-y-4 sm:space-y-6">
            {demoGivenTranscripts.length > 0 ? (
              demoGivenTranscripts.map(({ transcript, recipientProfile }) => (
                <EnhancedTranscriptCard
                  key={`given-${transcript.id}`}
                  transcript={transcript}
                  profileId="lara-rosu-demo"
                  isExpanded={expandedTranscripts.has(transcript.id)}
                  onToggle={() => toggleTranscript(transcript.id)}
                  onTextSelection={handleTextSelection}
                  processHighlightFromUrl={processHighlightFromUrl}
                  mode="given"
                  recipientProfile={recipientProfile}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No given transcripts available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Demo Help Hints */}
      <DemoHints />

      {/* Share Tooltip for highlights */}
      <ShareTooltip
        visible={shareTooltip.visible}
        x={shareTooltip.x}
        y={shareTooltip.y}
        onShare={handleShareLink}
        copied={copiedFeedback}
      />

      {/* Footer */}
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
