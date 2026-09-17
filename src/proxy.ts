import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

const neonAuthMiddleware = auth.middleware({
  loginUrl: "/auth",
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || request.headers.has("Next-Action")) {
    return;
  }

  return neonAuthMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Protect application pages only.
     * Exclude:
     * - /api/* (Route Handlers authenticate via requireUser())
     * - /auth (public sign-in page)
     * - static assets
     */
    "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
