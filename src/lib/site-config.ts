export const SITE_NAME = "DSJourney";
export const SITE_TAGLINE = "Your Data Science Journey Starts Here";

export const SITE_DESCRIPTION =
  "Track your Data Science roadmap, study sessions, analytics, internship readiness, and portfolio in one place.";

export const SITE_DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const THEME_COLOR = "#080C12";

/** Internal version identifier for legal document revisions. */
export const LEGAL_VERSION = "2026-09-19";

/** Human-readable effective date shown on Terms and Privacy pages. */
export const LEGAL_EFFECTIVE_DATE = "September 19, 2026";

const SUPPORT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns the configured public site origin, if set.
 * Configure via NEXT_PUBLIC_SITE_URL before production launch.
 */
export function getSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    return null;
  }

  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

/**
 * Returns metadataBase only when a real public site URL is configured.
 * Avoids misleading canonical URLs on localhost or unset environments.
 */
export function getMetadataBase(): URL | undefined {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return undefined;
  }

  return new URL(siteUrl);
}

/**
 * Production deployments with a configured public site URL may be indexed.
 * Preview and local environments should discourage indexing.
 */
export function isIndexableDeployment(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === "preview" || vercelEnv === "development") {
    return false;
  }

  if (vercelEnv === "production") {
    return Boolean(getSiteUrl());
  }

  return false;
}

/**
 * Returns the configured public support email, if set.
 * Configure via NEXT_PUBLIC_SUPPORT_EMAIL before production launch.
 */
export function getSupportEmail(): string | null {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

  if (!email || !SUPPORT_EMAIL_PATTERN.test(email)) {
    return null;
  }

  return email;
}
