// The app rewrites every /api/* request to the movie API (see
// apps/app/next.config.ts, beforeFiles), so better-auth can't live at its
// default /api/auth. Every auth endpoint is served from here instead.
export const AUTH_BASE_PATH = "/auth";

export const MIN_PASSWORD_LENGTH = 8;
