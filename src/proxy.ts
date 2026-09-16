import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

const neonAuthMiddleware = auth.middleware({
  loginUrl: "/auth",
});

export async function proxy(request: NextRequest) {
  return neonAuthMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
