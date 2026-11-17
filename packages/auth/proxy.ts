import "server-only";

import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { getSafeNextPathFromRequest, matchesAny } from "./route-match";
import { serverAuth } from "./server";

export type AuthMiddlewareConfig = {
  /** Routes that require an authenticated user (redirect to signInPath). */
  protectedRoutes?: string[];
  /** Routes only guests may see (authenticated users go to guestRedirectPath). */
  guestOnlyRoutes?: string[];
  /** Where unauthenticated users are sent from a protected route. */
  signInPath?: string;
  /** Where authenticated users are sent from a guest-only route. */
  guestRedirectPath?: string;
};

/**
 * Builds the route-guard middleware. Each app injects its own route config so
 * this shared package stays app-agnostic.
 *
 * Protected routes only check that a session cookie exists, which keeps most
 * requests free of database calls. That is an optimistic redirect, not the
 * security boundary: pages and actions still validate with currentUser().
 * Guest-only routes validate the session for real, so a stale cookie can't
 * bounce a signed-out user away from /sign-in.
 */
export const authMiddleware = (config: AuthMiddlewareConfig = {}) => {
  const {
    protectedRoutes = [],
    guestOnlyRoutes = [],
    signInPath = "/sign-in",
    guestRedirectPath = "/account",
  } = config;

  return async (request: NextRequest) => {
    const hasSession = Boolean(getSessionCookie(request));
    const { pathname } = request.nextUrl;

    if (!hasSession && matchesAny(pathname, protectedRoutes)) {
      const url = request.nextUrl.clone();
      url.pathname = signInPath;
      url.search = "";
      url.searchParams.set(
        "next",
        getSafeNextPathFromRequest(
          request.nextUrl.pathname,
          request.nextUrl.search,
          guestRedirectPath,
        ),
      );
      return NextResponse.redirect(url);
    }

    if (
      hasSession &&
      matchesAny(pathname, guestOnlyRoutes) &&
      (await serverAuth.api.getSession({ headers: request.headers }))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = guestRedirectPath;
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  };
};
