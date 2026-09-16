import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

function getNeonAuthBaseUrl(): string {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing required environment variable: NEON_AUTH_BASE_URL");
  }

  return baseUrl;
}

function getNeonAuthCookieSecret(): string {
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!secret) {
    throw new Error(
      "Missing required environment variable: NEON_AUTH_COOKIE_SECRET",
    );
  }

  return secret;
}

export const auth = createNeonAuth({
  baseUrl: getNeonAuthBaseUrl(),
  cookies: {
    secret: getNeonAuthCookieSecret(),
  },
});
