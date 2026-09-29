/** Routes and paths that should bypass auth middleware and the authenticated shell. */

export const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/today",
  "/roadmap",
  "/study-sessions",
  "/analytics",
  "/readiness",
  "/portfolio",
  "/settings",
] as const;

const PUBLIC_PAGE_ROUTES = new Set(["/", "/terms", "/privacy", "/contact"]);

const PUBLIC_ROUTE_PREFIXES = ["/auth"];

const PUBLIC_SYSTEM_PATHS = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
]);

export function isAuthenticatedAppRoute(pathname: string): boolean {
  return AUTHENTICATED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isPublicBypassRoute(pathname: string): boolean {
  if (PUBLIC_PAGE_ROUTES.has(pathname)) {
    return true;
  }

  if (PUBLIC_SYSTEM_PATHS.has(pathname)) {
    return true;
  }

  if (pathname.startsWith("/opengraph-image")) {
    return true;
  }

  if (pathname === "/icon" || pathname.startsWith("/icon.")) {
    return true;
  }

  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
