/** biome-ignore-all lint/style/noNonNullAssertion: not null env */
/** biome-ignore-all lint/complexity/noForEach:  cookie interable */
/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: cookie interable */
import "server-only";

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  getSafeNextPathFromRequest,
  matchesAny,
} from "./route-match";

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
 * Builds a Supabase session-refreshing middleware. Each app injects its own
 * route config so this shared package stays app-agnostic.
 */
export const authMiddleware = (config: AuthMiddlewareConfig = {}) => {
  const {
    protectedRoutes = [],
    guestOnlyRoutes = [],
    signInPath = "/sign-in",
    guestRedirectPath = "/account",
  } = config;

  return async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({
      request,
    });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    // Refreshing the auth token
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (!user && matchesAny(pathname, protectedRoutes)) {
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

    if (user && matchesAny(pathname, guestOnlyRoutes)) {
      const url = request.nextUrl.clone();
      url.pathname = guestRedirectPath;
      url.search = "";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  };
};
