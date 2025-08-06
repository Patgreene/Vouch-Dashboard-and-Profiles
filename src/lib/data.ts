export interface Profile {
  id: string;
  name: string;
  title: string;
  email: string;
  company?: string;
  photo?: string;
  linkedIn?: string;
  cv?: string;
  portfolio?: string;
  keyTakeaways: KeyTakeaways;
  transcripts: Transcript[];
}

export interface KeyTakeaways {
  strengths: string[];
  weaknesses: string[];
  communicationStyle: string[];
  waysToBringOutBest: string[];
  customTitle1?: string;
  customTitle2?: string;
}

export interface Transcript {
  id: string;
  speakerName: string;
  speakerRole: string;
  speakerEmail: string;
  speakerPhoto?: string;
  content: string;
  interviewDate?: string;
  interviewedBy?: string;
}

export interface Analytics {
  profileId: string;
  profileName: string;
  pageViews: number;
  quoteViews: number;
  uniqueVisitors?: number;
}

export interface ProfileStats {
  profileId: string;
  pageViews: number;
  quoteViews: number;
  uniqueVisitors?: number;
}

// Sample data
export const sampleProfiles: Profile[] = [
  {
    id: "danielle-davis",
    name: "Danielle Davis",
    title: "Product Designer",
    company: "Meta",
    photo:
      "https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2F12b15b8f8bff40339e9a75ad3f1509c3",
    linkedIn: "https://linkedin.com/in/lararuso",
    cv: "/cv/danielle-davis.pdf",
    portfolio: "https://lararuso.design",
    keyTakeaways: {
      strengths: [
        "Exceptional visual design skills with strong attention to detail",
        "Collaborative team player who brings positive energy to projects",
        "Strong strategic thinking and ability to see the bigger picture",
        "Excellent communication skills across technical and non-technical stakeholders",
      ],
      weaknesses: [
        "Sometimes perfectionist tendencies can slow down iteration speed",
        "Could benefit from more exposure to front-end development constraints",
      ],
      communicationStyle: [
        "Direct and honest feedback style",
        "Prefers visual communication and prototypes over lengthy documents",
        "Works best with regular check-ins and collaborative sessions",
      ],
      waysToBringOutBest: [
        "Give her creative freedom and ownership over design decisions",
        "Provide clear project constraints and business objectives upfront",
        "Schedule regular design reviews with stakeholders",
        "Encourage experimentation and rapid prototyping",
      ],
      customTitle1: "Communication Style",
      customTitle2: "Ways to Bring Out Their Best",
    },
    transcripts: [
      {
        id: "john-smith-1",
        speakerName: "John Smith",
        speakerRole: "Former Manager at Meta",
        speakerPhoto:
          "https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2Fc23b394bcb414e518b67da03015e7462",
        interviewDate: "2024-02-15",
        interviewedBy: "Sarah Johnson, HR Partner",
        content:
          "Danielle was an exceptional addition to our product design team. Her ability to translate complex user requirements into intuitive, beautiful designs consistently impressed both the engineering team and our stakeholders. What set her apart was her collaborative approach - she never worked in isolation, always seeking input and feedback from developers, product managers, and users.\n\nHer design process was methodical yet creative. She would start with extensive user research, create detailed personas, and then iterate rapidly through wireframes and prototypes. I was particularly impressed by her ability to balance user needs with business objectives, always keeping both in mind during the design process.\n\nOne project that stands out was the redesign of our mobile onboarding flow. Danielle led the entire design process, from initial user interviews to final implementation. The result was a 40% increase in completion rates and significantly improved user satisfaction scores. Her attention to detail in the final designs made the engineering handoff seamless.\n\nIf I had to identify areas for growth, I'd say Danielle sometimes spent too much time perfecting designs when a quick iteration would have been more valuable. However, this perfectionist tendency also meant that her final deliverables were always of exceptional quality. She's someone any team would be lucky to have.",
      },
      {
        id: "sarah-chen-1",
        speakerName: "Sarah Chen",
        speakerRole: "Senior Frontend Engineer at Meta",
        speakerPhoto:
          "https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2Fb6ab5424d2fd409aab6810d78e472129",
        interviewDate: "2024-02-18",
        interviewedBy: "Michael Torres, Engineering Lead",
        content:
          "Working with Danielle on the checkout redesign project was one of the best cross-functional collaborations I've experienced. As a frontend engineer, I've worked with many designers, but Danielle stood out for her technical awareness and willingness to understand development constraints.\n\nShe would regularly attend our engineering standups and ask thoughtful questions about implementation feasibility. When I raised concerns about certain design patterns being difficult to implement responsively, she was quick to iterate and find solutions that worked for both the user experience and our technical requirements.\n\nDanielle's Figma files were incredibly well-organized, with clear component libraries, detailed annotations, and responsive breakpoints already defined. This made my job so much easier and reduced the back-and-forth typically required during implementation. She also created comprehensive interaction prototypes that helped the entire team understand the intended user experience.\n\nPersonally, I found Danielle to be approachable and collaborative. She welcomed feedback and never took technical constraints as criticism of her design work. Instead, she saw them as creative challenges to solve together. Her positive attitude and problem-solving mindset made her a joy to work with, even during high-pressure deadline situations.",
      },
      {
        id: "mike-rodriguez-1",
        speakerName: "Mike Rodriguez",
        speakerRole: "Product Manager at Meta",
        speakerPhoto:
          "https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2F25e8ad8ea1e845d8a5748dfa7ddc260d",
        interviewDate: "2024-02-20",
        interviewedBy: "Emma Watson, Talent Acquisition",
        content:
          "Danielle joined our team during a critical product redesign, and her impact was immediate and significant. As a product manager, I work closely with designers to balance user needs, business objectives, and technical constraints - Danielle excelled in all these areas.\n\nWhat impressed me most was her strategic thinking. She didn't just focus on making things look beautiful; she deeply understood our business metrics and user journey. During the discovery phase, she proactively suggested user research initiatives that provided valuable insights we hadn't considered. Her data-driven approach to design decisions aligned perfectly with our product methodology.\n\nDanielle's presentation skills were exceptional. Whether presenting to our executive team or walking engineers through design specifications, she communicated complex ideas clearly and persuasively. She had this ability to tell compelling stories about user pain points that helped everyone understand why certain design decisions were critical.\n\nOne challenge we faced was tight deadlines for a major product launch. While Danielle's thorough design process was usually an asset, in this case, we needed to move faster. She adapted well, focusing on the most impactful design changes and deferring nice-to-have improvements for future iterations. This showed great prioritization skills and business acumen.",
      },
    ],
  },
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    title: "Full Stack Engineer",
    company: "Spotify",
    linkedIn: "https://linkedin.com/in/alexmorgan",
    portfolio: "https://alexmorgan.dev",
    keyTakeaways: {
      strengths: [
        "Strong full-stack technical skills across multiple frameworks",
        "Excellent problem-solving abilities and debugging skills",
        "Self-motivated and able to work independently",
        "Good mentor and willing to help junior developers",
      ],
      weaknesses: [
        "Sometimes prefers technical perfection over shipping quickly",
        "Can be reserved in large group meetings",
      ],
      communicationStyle: [
        "Prefers written communication and detailed documentation",
        "More comfortable in small group discussions than large meetings",
        "Gives thoughtful, well-reasoned responses",
      ],
      waysToBringOutBest: [
        "Provide clear technical requirements and autonomy",
        "Regular one-on-one check-ins rather than large status meetings",
        "Opportunities to mentor junior developers",
        "Time for code reviews and technical debt reduction",
      ],
      customTitle1: "Communication Style",
      customTitle2: "Ways to Bring Out Their Best",
    },
    transcripts: [
      {
        id: "emma-wilson-1",
        speakerName: "Emma Wilson",
        speakerRole: "Engineering Manager at Spotify",
        speakerPhoto:
          "https://cdn.builder.io/api/v1/image/assets%2F0ae055adc12b40c09e57a54de8259fb8%2F23d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
        interviewDate: "2024-01-25",
        interviewedBy: "David Kim, Senior Recruiter",
        content:
          "Alex was one of the strongest engineers on my team during their time at Spotify. Their technical depth across both frontend and backend technologies was impressive - equally comfortable writing React components and designing database schemas. What made Alex particularly valuable was their systematic approach to problem-solving and their commitment to code quality.\n\nI remember a particularly challenging project where we needed to optimize our music recommendation engine. Alex took ownership of the performance issues, systematically profiled the application, identified bottlenecks, and implemented solutions that improved response times by 60%. Their work was thorough, well-documented, and included comprehensive testing.\n\nAlex was also an excellent mentor to junior developers. They had this patient, methodical way of explaining complex concepts and always made time to review code and provide constructive feedback. Several junior engineers specifically mentioned how much they learned from working with Alex.\n\nIf I had to identify an area for growth, it would be Alex's tendency toward perfectionism. Sometimes they would spend extra time polishing code that was already production-ready, which could slow down delivery timelines. However, this attention to detail also meant fewer bugs and more maintainable codebases, so it was generally a positive trade-off.",
      },
    ],
  },
];

// Analytics mock data
export const mockAnalytics: AnalyticsData = {
  totalProfiles: 2,
  totalTranscripts: 4,
  totalPageViews: 0,
  totalQuoteViews: 0,
  profileStats: [
    {
      profileId: "danielle-davis",
      profileName: "Danielle Davis",
      pageViews: 0,
      quoteViews: 0,
    },
    {
      profileId: "alex-morgan",
      profileName: "Alex Morgan",
      pageViews: 0,
      quoteViews: 0,
    },
  ],
};

// Profile management with localStorage persistence
const PROFILES_STORAGE_KEY = "vouch_profiles";

// Get all profiles (sample + user-created)
export function getAllProfiles(): Profile[] {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    const userProfiles: Profile[] = stored ? JSON.parse(stored) : [];
    return [...sampleProfiles, ...userProfiles];
  } catch (error) {
    console.error("Error loading profiles from localStorage:", error);
    return sampleProfiles;
  }
}

// Get profile by ID
export function getProfileById(id: string): Profile | undefined {
  return getAllProfiles().find((profile) => profile.id === id);
}

// Add a new profile
export function addProfile(profile: Profile): boolean {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    const userProfiles: Profile[] = stored ? JSON.parse(stored) : [];

    // Check if profile with this ID already exists
    const allProfiles = [...sampleProfiles, ...userProfiles];
    if (allProfiles.find((p) => p.id === profile.id)) {
      console.error("Profile with this ID already exists:", profile.id);
      return false;
    }

    userProfiles.push(profile);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(userProfiles));
    return true;
  } catch (error) {
    console.error("Error saving profile to localStorage:", error);
    return false;
  }
}

// Update an existing profile
export function updateProfile(profile: Profile): boolean {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    const userProfiles: Profile[] = stored ? JSON.parse(stored) : [];

    // Check if it's a sample profile (cannot be edited)
    if (sampleProfiles.find((p) => p.id === profile.id)) {
      console.error("Cannot edit sample profiles");
      return false;
    }

    // Find and update the profile
    const profileIndex = userProfiles.findIndex((p) => p.id === profile.id);
    if (profileIndex === -1) {
      console.error("Profile not found for update:", profile.id);
      return false;
    }

    userProfiles[profileIndex] = profile;
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(userProfiles));
    return true;
  } catch (error) {
    console.error("Error updating profile in localStorage:", error);
    return false;
  }
}

// Check if a profile can be edited (user-created profiles only)
export function canEditProfile(id: string): boolean {
  const userProfiles = getUserProfiles();
  return userProfiles.some((p) => p.id === id);
}

// Remove a profile
export function removeProfile(id: string): boolean {
  try {
    // Don't allow removing sample profiles
    if (sampleProfiles.find((p) => p.id === id)) {
      console.error("Cannot remove sample profiles");
      return false;
    }

    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    const userProfiles: Profile[] = stored ? JSON.parse(stored) : [];
    const filtered = userProfiles.filter((p) => p.id !== id);

    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error removing profile from localStorage:", error);
    return false;
  }
}

// Get user-created profiles only
export function getUserProfiles(): Profile[] {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading user profiles from localStorage:", error);
    return [];
  }
}
