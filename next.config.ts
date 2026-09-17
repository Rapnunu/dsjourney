import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy directives for DS Prep Tracker.
 *
 * default-src 'self' — fallback for unspecified resource types
 * base-uri 'self' — restrict <base> tag targets
 * object-src 'none' — block plugins (Flash, etc.)
 * form-action 'self' — forms may only submit to this origin
 * frame-ancestors 'none' — clickjacking protection (modern)
 * script-src — Next.js App Router requires 'unsafe-inline' for hydration scripts
 * style-src — Tailwind / Next inject inline styles at runtime
 * img-src — local assets; data: for inline SVGs; blob: for dev tooling
 * font-src — self-hosted fonts via next/font (Inter)
 * connect-src — same-origin API routes and Neon Auth proxy (/api/auth)
 *
 * Development adds 'unsafe-eval' for React Fast Refresh / Next dev tooling only.
 */
function buildContentSecurityPolicy(): string {
  const scriptSrc = isDevelopment
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
  ].join("; ");
}

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy(),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
