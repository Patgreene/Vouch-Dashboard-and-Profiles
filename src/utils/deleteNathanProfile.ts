import { dataProvider } from "@/lib/dataProvider";

export async function checkAndDeleteNathanProfile() {
  console.log("🔍 Checking for nathan-ganly profile...");

  try {
    // Get all profiles
    const profiles = await dataProvider.getAllProfiles();
    console.log("📋 Total profiles found:", profiles.length);

    // Check if nathan-ganly exists
    const nathanProfile = profiles.find(
      (profile) => profile.id === "nathan-ganly",
    );

    if (nathanProfile) {
      console.log("✅ Found nathan-ganly profile:", nathanProfile.name);
      console.log("🗑️ Attempting to delete...");

      // Delete the profile
      const deleteResult = await dataProvider.deleteProfile("nathan-ganly");

      if (deleteResult) {
        console.log("✅ Successfully deleted nathan-ganly profile");
        return { success: true, message: "Profile deleted successfully" };
      } else {
        console.log("❌ Failed to delete nathan-ganly profile");
        return { success: false, message: "Failed to delete profile" };
      }
    } else {
      console.log("❌ No profile found with ID 'nathan-ganly'");
      return { success: false, message: "Profile not found" };
    }
  } catch (error) {
    console.error("❌ Error checking/deleting profile:", error);
    return { success: false, message: `Error: ${error}` };
  }
}

// Auto-run when imported
if (typeof window !== "undefined") {
  // Make function available globally for console access
  (window as any).checkAndDeleteNathanProfile = checkAndDeleteNathanProfile;

  // Auto-run the check
  checkAndDeleteNathanProfile().then((result) => {
    console.log("🏁 Operation result:", result);
  });
}
