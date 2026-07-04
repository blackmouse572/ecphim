// Pure route-matching helpers, kept free of "server-only" so they can be
// unit tested and reused outside the middleware.

export const isMatchingRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export const matchesAny = (pathname: string, routes: string[]) =>
  routes.some((route) => isMatchingRoute(pathname, route));

export const getSafeNextPathFromRequest = (
  pathname: string,
  search: string,
  fallback: string,
) => {
  const nextPath = `${pathname}${search}`;

  // Root-relative only; reject protocol-relative "//" and backslash tricks
  // ("/\evil" normalizes to "//evil" in browsers → open redirect).
  if (
    !nextPath.startsWith("/") ||
    nextPath.startsWith("//") ||
    nextPath.includes("\\")
  ) {
    return fallback;
  }

  return nextPath;
};
