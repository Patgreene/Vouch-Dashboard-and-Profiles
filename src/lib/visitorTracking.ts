// Visitor tracking system for unique visitor counting and cooldown logic

const VISITOR_ID_KEY = "vouch_visitor_id";
const VISIT_HISTORY_KEY = "vouch_visit_history";
const COOLDOWN_DURATION = 15 * 1000; // 15 seconds in milliseconds

export interface VisitRecord {
  profileId: string;
  timestamp: number;
}

export interface VisitorData {
  visitorId: string;
  visitHistory: VisitRecord[];
}

// Generate a unique visitor ID
function generateVisitorId(): string {
  return (
    "visitor_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  );
}

// Get or create visitor ID
export function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
}

// Get visit history from localStorage
function getVisitHistory(): VisitRecord[] {
  try {
    const history = localStorage.getItem(VISIT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading visit history:", error);
    return [];
  }
}

// Save visit history to localStorage
function saveVisitHistory(history: VisitRecord[]): void {
  try {
    localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving visit history:", error);
  }
}

// Check if enough time has passed since last visit to this profile
export function shouldCountVisit(profileId: string): boolean {
  const history = getVisitHistory();
  const now = Date.now();

  // Find the most recent visit to this profile
  const lastVisit = history
    .filter((record) => record.profileId === profileId)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  // If no previous visit or enough time has passed, count the visit
  if (!lastVisit || now - lastVisit.timestamp >= COOLDOWN_DURATION) {
    return true;
  }

  return false;
}

// Record a visit (if it should be counted)
export function recordVisit(profileId: string): boolean {
  if (!shouldCountVisit(profileId)) {
    return false; // Visit not counted due to cooldown
  }

  const history = getVisitHistory();
  const now = Date.now();

  // Add new visit record
  history.push({
    profileId,
    timestamp: now,
  });

  // Keep only recent history (last 100 visits to prevent localStorage bloat)
  const recentHistory = history
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 100);

  saveVisitHistory(recentHistory);
  return true; // Visit was counted
}

// Get visitor data for analytics
export function getVisitorData(): VisitorData {
  return {
    visitorId: getVisitorId(),
    visitHistory: getVisitHistory(),
  };
}

// Clean up old visit records (older than 24 hours)
export function cleanupOldVisits(): void {
  const history = getVisitHistory();
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  const recentHistory = history.filter(
    (record) => now - record.timestamp < dayInMs,
  );

  if (recentHistory.length !== history.length) {
    saveVisitHistory(recentHistory);
  }
}

// Initialize visitor tracking (call on app startup)
export function initializeVisitorTracking(): void {
  // Ensure visitor ID exists
  getVisitorId();

  // Clean up old visits
  cleanupOldVisits();
}
