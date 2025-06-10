// Analytics tracking utilities
export interface AnalyticsEvent {
  type: "page_view" | "quote_view" | "profile_created";
  profileId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];

  // Track page view
  trackPageView(profileId: string) {
    const event: AnalyticsEvent = {
      type: "page_view",
      profileId,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // In a real app, you'd send this to your analytics service
    console.log("Analytics: Page view tracked", event);
  }

  // Track quote/highlight view
  trackQuoteView(profileId: string, transcriptId: string, highlightId: string) {
    const event: AnalyticsEvent = {
      type: "quote_view",
      profileId,
      timestamp: Date.now(),
      metadata: {
        transcriptId,
        highlightId,
      },
    };

    this.events.push(event);

    console.log("Analytics: Quote view tracked", event);
  }

  // Track profile creation
  trackProfileCreated(profileId: string) {
    const event: AnalyticsEvent = {
      type: "profile_created",
      profileId,
      timestamp: Date.now(),
    };

    this.events.push(event);

    console.log("Analytics: Profile created", event);
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const pageViews = this.events.filter((e) => e.type === "page_view").length;
    const quoteViews = this.events.filter(
      (e) => e.type === "quote_view",
    ).length;

    const profileStats = new Map<
      string,
      { pageViews: number; quoteViews: number }
    >();

    this.events.forEach((event) => {
      if (event.profileId) {
        const stats = profileStats.get(event.profileId) || {
          pageViews: 0,
          quoteViews: 0,
        };

        if (event.type === "page_view") {
          stats.pageViews++;
        } else if (event.type === "quote_view") {
          stats.quoteViews++;
        }

        profileStats.set(event.profileId, stats);
      }
    });

    return {
      totalPageViews: pageViews,
      totalQuoteViews: quoteViews,
      profileStats: Array.from(profileStats.entries()).map(
        ([profileId, stats]) => ({
          profileId,
          ...stats,
        }),
      ),
    };
  }

  // Get all events (for admin dashboard)
  getAllEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker();

// Copy link to clipboard with visual feedback
export async function copyToClipboard(text: string): Promise<boolean> {
  console.log('Attempting to copy to clipboard:', text);

  try {
    await navigator.clipboard.writeText(text);
    console.log('Successfully copied using navigator.clipboard');
    return true;
  } catch (err) {
    console.log('Navigator clipboard failed, trying fallback:', err);

    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      console.log('Fallback copy result:', successful);
      return successful;
    } catch (err) {
      console.log('Fallback copy failed:', err);
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Generate share URL for highlighted text
export function generateShareUrl(
  profileId: string,
  transcriptId: string,
  highlightStart: number,
  highlightEnd: number,
): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    t: transcriptId,
    s: highlightStart.toString(),
    e: highlightEnd.toString(),
  });

  return `${baseUrl}/profile/${profileId}?${params.toString()}`;
}
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    t: transcriptId,
    s: highlightStart.toString(),
    e: highlightEnd.toString(),
  });

  return `${baseUrl}/profile/${profileId}?${params.toString()}`;
}