// Auth helper utilities for cookie-based session management
// Used by middleware.ts for route protection

export function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  // Set cookie with 30-day expiry
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `agropulse-auth-token=${token}; expires=${expires}; path=/; SameSite=Lax`;
}

export function removeAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "agropulse-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/agropulse-auth-token=([^;]+)/);
  return match ? match[1] : null;
}
