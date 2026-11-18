const defaultAppOrigin =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const getSafeNextPath = (
  nextPath: string | null | undefined,
  fallback = "/account",
) => {
  if (!nextPath) {
    return fallback;
  }

  // Root-relative only. Reject absolute URLs and protocol-relative "//...".
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  // Browsers normalize "\" -> "/", so "/\evil.com" becomes "//evil.com"
  // (protocol-relative open redirect). Reject any backslash.
  if (nextPath.includes("\\")) {
    return fallback;
  }

  // Reject control chars (0x00-0x1F, 0x7F) — browsers can strip/normalize
  // them into the escapes handled above.
  for (let i = 0; i < nextPath.length; i++) {
    const code = nextPath.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) {
      return fallback;
    }
  }

  return nextPath;
};

const getAppOrigin = () =>
  typeof window === "undefined" ? defaultAppOrigin : window.location.origin;

// Absolute URL better-auth sends the user to after an email link or Google
// sign-in completes. better-auth only follows URLs on trusted origins.
export const getAuthCallbackUrl = (nextPath: string) =>
  new URL(getSafeNextPath(nextPath), getAppOrigin()).toString();

export const AUTH_ERROR_PATH =
  "/sign-in?error=unable_to_complete_authentication";
