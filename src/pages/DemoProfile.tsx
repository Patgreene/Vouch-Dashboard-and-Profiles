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
      interviewDate: "2024-07-08",
      content:
        "Lara joined our team on what was meant to be a short-term contract, just six months to support a product refresh, but from day one, it was clear she brought something different. She has this rare ability to not only see problems others miss, but to approach them with fresh, user-centred solutions that actually move the needle. She is one of the most creative people I've ever worked with.\n\nWhat really blew me away was her ability to connect with people. Whether it was a developer, a stakeholder, or a user in a research session, she just knows how to listen, empathise, and bring people with her. It made working with her feel effortless – like everyone naturally did better work when she was in the room. She made us more thoughtful as a team.\n\nHer designs helped increase engagement by 40% and dramatically reduced support tickets, but more than the numbers, she raised the standard for what good looks like. If I had to be honest about one thing, it's that she can be incredibly hard on herself. She sets the bar so high, and sometimes pushes past the point of \"good enough.\" But that drive? That's also what makes her exceptional. If I could build a team from scratch, she's one of the first people I'd call.",
      verificationStatus: "verified" as const,
    },
    {
      id: "demo-transcript-2",
      speakerName: "Tomás Ortega",
      speakerRole: "Co-founder at Looply",
      speakerEmail: "tomas@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2023-10-26",
      content:
        "We brought Lara in during a make-or-break moment. Our MVP was live, but no one was sticking. Engagement was flat, users were dropping off, and the team was too close to the product to see what was wrong. Lara didn't just show up with a Figma file, she threw herself into the product like it was her own. She spent two weeks fully immersed: using it daily, interviewing users, mapping friction points we didn't even know existed. It felt like she uncovered more insight in 10 days than we had in 6 months.\n\nWhat sets Lara apart is that she thinks like a founder. She doesn't just \"do design\", she solves business problems. Every recommendation she made was tied to a specific user pain or a growth lever. Her redesigned onboarding flow alone took our day-7 retention from 23% to 67%. Results came from relentless iteration, late-night testing, and a level of ownership that's incredibly rare in a contractor.\n\nHer work ethic is unreal. She moves fast, but nothing feels rushed. Every screen she delivered was thoughtful, user-tested, and ready to ship. We were a stretched-thin startup trying to launch, and Lara became the heartbeat of the product team. Honestly, I can't imagine getting to launch without her. She didn't just raise the bar, she became the bar.",
      verificationStatus: "not_started" as const,
    },
    {
      id: "demo-transcript-3",
      speakerName: "David Nari",
      speakerRole: "Senior Frontend Developer",
      speakerEmail: "david@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      interviewDate: "2023-04-12",
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
      interviewDate: "2022-08-29",
      content:
        "Lara was instrumental in helping us design our mobile app from the ground up. As a non-technical founder, I was worried about the complexity of translating our vision into a user-friendly mobile experience. Lara not only understood our vision but helped refine and improve it through her design process.\n\nShe has this wonderful ability to balance user needs with business objectives. Every design recommendation came with clear reasoning about how it would impact user experience and, ultimately, our bottom line. She helped us prioritize features based on user value and implementation complexity, which was incredibly valuable for a resource-constrained startup.\n\nThe app Lara designed for us launched to fantastic user reviews, with particular praise for its intuitive interface and smooth user experience. Six months post-launch, we're seeing strong user retention and minimal support requests related to usability issues. Lara's work laid the foundation for our product's success.",
      verificationStatus: "pending" as const,
    },
    {
      id: "demo-transcript-5",
      speakerName: "Maya Patel",
      speakerRole: "Product Manager",
      speakerEmail: "maya@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2021-01-17",
      content:
        "Lara came into our chaotic startup environment and somehow made everything make sense. We were drowning in user feedback, feature requests, and technical debt, but she had this incredible ability to cut through the noise and identify what actually mattered. Her approach to user research was methodical yet agile – she'd validate assumptions quickly without getting bogged down in analysis paralysis.\n\nWhat I loved most was how she translated complex user insights into actionable design decisions. She didn't just tell us what users wanted; she showed us exactly how to deliver it in a way that aligned with our business goals and technical constraints. Her wireframes were so clear that our developers could start building immediately without endless clarification meetings.\n\nThe redesign she led increased our conversion rate by 65% and reduced our customer support tickets by half. But beyond the metrics, she fundamentally changed how our team thinks about users. She embedded user-centered thinking into our DNA, and that impact will last long after the project ended.",
      verificationStatus: "verified" as const,
    },
    {
      id: "demo-transcript-6",
      speakerName: "James Rodriguez",
      speakerRole: "Engineering Manager",
      speakerEmail: "james@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2020-09-03",
      content:
        "As an engineering manager, I've worked with many designers, but Lara stands out for how she bridges the gap between design vision and technical reality. She doesn't just hand over beautiful mockups – she sits with the engineering team, understands our constraints, and iterates on solutions that are both elegant and buildable.\n\nHer component-based thinking was invaluable. She designed our design system in a way that made perfect sense to developers, with consistent patterns, clear documentation, and realistic edge cases. This wasn't just good design; it was strategic thinking that saved us months of development time and technical debt.\n\nLara also has exceptional problem-solving skills. When we hit performance issues with her initial designs, instead of being defensive, she immediately jumped into finding solutions. She researched optimization techniques, worked with our team to understand the bottlenecks, and redesigned components to be both beautiful and performant. That level of ownership and technical curiosity is rare.",
      verificationStatus: "verified" as const,
    },
    {
      id: "demo-transcript-7",
      speakerName: "Sophie Chen",
      speakerRole: "CEO at GreenTech Solutions",
      speakerEmail: "sophie@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2019-06-15",
      content:
        "Bringing Lara onto our sustainability platform project was one of the best decisions we made as a company. She immediately grasped the complexity of making environmental data engaging and actionable for everyday users. Her research into user motivations around sustainability was thorough and insightful – she understood that people want to help the planet but need simple, clear ways to take action.\n\nWhat impressed me most was her ability to simplify without dumbing down. The dashboard she designed made complex carbon footprint data feel approachable and actionable. User engagement with our sustainability features increased by 150% after her redesign, and we started getting organic social shares from users proud of their environmental impact.\n\nLara also understood the business implications of her design decisions. She helped us identify new revenue opportunities through her user research and designed features that not only served users better but also drove business growth. As a CEO, having a designer who thinks strategically about the intersection of user needs and business objectives is invaluable.",
      verificationStatus: "not_started" as const,
    },
    {
      id: "demo-transcript-8",
      speakerName: "Alex Thompson",
      speakerRole: "Creative Director",
      speakerEmail: "alex@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2018-11-08",
      content:
        "Working with Lara on our creative agency's website redesign was an eye-opening experience. Even though we're a team of designers, Lara brought a level of UX thinking and systematic approach that elevated everyone's work. She helped us see our own blind spots and challenged us to think beyond just visual appeal to actual user outcomes.\n\nHer process was incredibly collaborative. She facilitated workshops that got our entire creative team aligned on user goals, not just aesthetic preferences. The way she structured our design critique sessions made our feedback more constructive and actionable. She taught us to defend design decisions with user data rather than personal taste.\n\nThe final website not only looked stunning but performed exceptionally. Our lead generation increased by 80%, and client feedback consistently mentioned how easy and enjoyable the site was to navigate. Lara proved that great UX design enhances rather than constrains creativity.",
      verificationStatus: "pending" as const,
    },
    {
      id: "demo-transcript-9",
      speakerName: "Rachel Kim",
      speakerRole: "VP of User Experience",
      speakerEmail: "rachel@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      interviewDate: "2024-07-08",
      content:
        "Lara joined our team during a critical transformation period as we were scaling from a small product to an enterprise platform. Her ability to design for scalability – both in terms of user experience and design systems – was exceptional. She didn't just solve immediate design problems; she built foundations that could grow with our business.\n\nWhat set her apart was her strategic thinking about information architecture. Our product had evolved organically and become quite complex, but Lara methodically mapped user journeys, identified pain points, and restructured the entire experience to be intuitive and logical. The navigation system she designed reduced user confusion by 70% and support tickets related to 'how do I find...' practically disappeared.\n\nLara also mentored our junior designers beautifully. She shared her systematic approach to design thinking, taught them to validate assumptions with data, and helped them develop confident design voices. The team's overall skill level improved significantly during her time with us, and those improvements continued long after her contract ended.",
      verificationStatus: "verified" as const,
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
      interviewDate: "2018-05-14",
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
  {
    transcript: {
      id: "demo-given-3",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2019-12-07",
      content:
        "Elena is one of those rare marketers who truly understands the connection between user experience and conversion. Working with her on our product launch campaign was incredibly smooth because she approached marketing from a user-first perspective, not just a metrics-driven one. She took time to understand our users' pain points and crafted messaging that genuinely resonated.\n\nWhat impressed me most was her data-driven approach to creative decisions. She'd run A/B tests on everything – copy, visuals, user flows – and then use those insights to refine not just the marketing but also inform product improvements. Her feedback often helped us identify UX issues we hadn't considered.\n\nElena also has exceptional project management skills. She coordinated between design, development, and sales teams seamlessly, ensuring everyone stayed aligned on messaging and user positioning. The campaign she led generated our highest conversion rates to date, but more importantly, it attracted users who were genuinely the right fit for our product.",
      verificationStatus: "verified" as const,
    },
    recipientProfile: {
      id: "elena-garcia",
      name: "Elena Garcia",
      title: "Growth Marketing Manager",
      email: "elena@example.com",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "SaaS Platform",
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
      id: "demo-given-4",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2020-02-23",
      content:
        "Jordan brought a level of technical sophistication to our mobile app development that I hadn't experienced before. As the designer, I was initially worried about how my complex interactive designs would translate to mobile, but Jordan made it look effortless. He has this incredible ability to take design concepts and not just implement them, but enhance them with thoughtful micro-interactions and performance optimizations.\n\nWhat really stood out was his proactive communication about technical constraints and opportunities. Instead of just saying 'this can't be done,' he'd come back with alternative solutions that often ended up being better than my original ideas. He helped me understand mobile design patterns more deeply, which made me a better designer.\n\nJordan also has excellent attention to detail. Every animation timing, every loading state, every edge case was handled with care. The app we built together consistently received praise from users for its smooth, polished feel. He's the kind of developer every designer dreams of working with.",
      verificationStatus: "pending" as const,
    },
    recipientProfile: {
      id: "jordan-williams",
      name: "Jordan Williams",
      title: "Senior iOS Developer",
      email: "jordan@example.com",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "Mobile App Studio",
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
      id: "demo-given-5",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2021-09-16",
      content:
        "Priya's user research skills are absolutely world-class. She has this unique ability to uncover insights that completely shift how you think about your users. Working with her on our e-commerce platform redesign, she identified user behavior patterns that our entire team had missed, despite months of internal analysis.\n\nWhat I admire most about Priya is how she balances quantitative rigor with qualitative empathy. Her user interviews revealed emotional drivers behind purchasing decisions that our analytics couldn't capture, while her data analysis provided the statistical backing we needed to convince stakeholders. She bridges the gap between human insight and business metrics beautifully.\n\nPriya is also an excellent collaborator. She included me in key research sessions, which helped me understand users more deeply and design with greater confidence. Her research reports weren't just informative – they were actionable blueprints that guided every design decision. The insights she provided led to a 45% increase in our checkout completion rate.",
      verificationStatus: "verified" as const,
    },
    recipientProfile: {
      id: "priya-sharma",
      name: "Priya Sharma",
      title: "Senior UX Researcher",
      email: "priya@example.com",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "E-commerce Platform",
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
      id: "demo-given-6",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2022-06-11",
      content:
        "Working with Kevin on our design system implementation was one of the most educational experiences of my career. His approach to frontend architecture is both pragmatic and forward-thinking. He didn't just implement the components I designed – he thoughtfully structured them in a way that made the entire system more maintainable and scalable.\n\nKevin has an exceptional understanding of how design decisions impact code quality and performance. He'd regularly suggest modifications to my designs that would improve loading times or maintainability without compromising the user experience. His technical insights often led to better design solutions.\n\nWhat impressed me most was his collaborative approach to problem-solving. When we encountered complex interaction design challenges, Kevin would prototype multiple solutions, showing me exactly how each would perform in production. This partnership between design and development resulted in components that were not only visually polished but also technically excellent. The design system we built together is still being used and expanded upon today.",
      verificationStatus: "not_started" as const,
    },
    recipientProfile: {
      id: "kevin-lee",
      name: "Kevin Lee",
      title: "Lead Frontend Engineer",
      email: "kevin@example.com",
      photo:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "Design System Team",
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
      id: "demo-given-7",
      speakerName: "Lara Rosu",
      speakerRole: "UX/UI Designer",
      speakerEmail: "lara@example.com",
      speakerPhoto:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=761&q=80",
      interviewDate: "2023-01-28",
      content:
        "Natasha is the kind of product manager every designer hopes to work with. She has a rare combination of strategic vision and tactical execution that makes collaboration incredibly productive. During our work on the healthcare app, she skillfully balanced user needs, business requirements, and technical constraints while keeping the team focused on what truly mattered.\n\nWhat sets Natasha apart is her deep empathy for both users and team members. She spent time understanding not just what users needed, but why they needed it and how it fit into their daily lives. This user-centric approach influenced every product decision and helped us avoid feature creep while still delivering meaningful value.\n\nNatasha also excels at stakeholder communication. She translated complex design decisions into business terms that resonated with executives, while also ensuring that user needs weren't compromised in the process. Her roadmap planning was realistic yet ambitious, and she created an environment where the design team felt supported and empowered to do our best work. The product we launched exceeded all engagement targets and received outstanding user satisfaction scores.",
      verificationStatus: "verified" as const,
    },
    recipientProfile: {
      id: "natasha-volkov",
      name: "Natasha Volkov",
      title: "Senior Product Manager",
      email: "natasha@example.com",
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      company: "Healthcare Technology",
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
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(true);

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

      {/* Privacy Popup */}
      {showPrivacyPopup && (
        <div className="absolute top-96 left-1/2 transform -translate-x-1/2 z-50 max-w-lg sm:max-w-lg max-w-sm w-full mx-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800">
                    Profiles are private by default. Share your unique profile
                    link with anyone you choose. Your reputation, your control.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrivacyPopup(false)}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
