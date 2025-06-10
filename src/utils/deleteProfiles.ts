// Utility to delete specific user profiles
export function deleteSpecificProfiles() {
  try {
    const stored = localStorage.getItem("vouch_profiles");
    if (!stored) {
      console.log("No user profiles found in localStorage");
      return;
    }

    const userProfiles = JSON.parse(stored);
    console.log(
      "Current user profiles:",
      userProfiles.map((p: any) => ({ id: p.id, name: p.name })),
    );

    // Filter out Lara Rusu and Matthew Collings profiles
    const filteredProfiles = userProfiles.filter(
      (profile: any) =>
        profile.id !== "lara-rusu" &&
        profile.id !== "lara-rusu" && // in case of variations
        profile.id !== "matthew-collings" &&
        !profile.name.toLowerCase().includes("lara") &&
        !profile.name.toLowerCase().includes("matthew"),
    );

    console.log(
      "Profiles after deletion:",
      filteredProfiles.map((p: any) => ({ id: p.id, name: p.name })),
    );

    // Save the filtered profiles back to localStorage
    localStorage.setItem("vouch_profiles", JSON.stringify(filteredProfiles));

    console.log("✅ Profiles deleted successfully");

    // Also clean up any analytics data for these profiles
    const analyticsStored = localStorage.getItem("vouch_analytics");
    if (analyticsStored) {
      const analyticsData = JSON.parse(analyticsStored);
      const filteredAnalytics = analyticsData.filter(
        (event: any) =>
          event.profileId !== "lara-rusu" &&
          event.profileId !== "matthew-collings",
      );
      localStorage.setItem(
        "vouch_analytics",
        JSON.stringify(filteredAnalytics),
      );
      console.log("✅ Analytics data cleaned up");
    }

    // Refresh the page to reflect changes
    window.location.reload();
  } catch (error) {
    console.error("Error deleting profiles:", error);
  }
}

// Auto-run the deletion when this file is imported
deleteSpecificProfiles();
