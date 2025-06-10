// Emergency fallback to localStorage mode
// Use this if Supabase is causing issues

export function forceLocalStorageMode() {
  // Temporarily disable Supabase by clearing env vars
  (window as any).__FORCE_LOCALSTORAGE = true;
  console.log("🚨 Emergency fallback: Forcing localStorage mode");
  window.location.reload();
}

// Check if we should use localStorage mode
export function shouldUseLocalStorage(): boolean {
  return !!(window as any).__FORCE_LOCALSTORAGE;
}
