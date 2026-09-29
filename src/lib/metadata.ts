import type { Metadata } from "next";
import {
  getMetadataBase,
  getSiteUrl,
  isIndexableDeployment,
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-config";

export const NO_INDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

const PUBLIC_INDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
};

function resolvePublicRobots(): NonNullable<Metadata["robots"]> {
  return isIndexableDeployment() ? PUBLIC_INDEX_ROBOTS : NO_INDEX_ROBOTS;
}

function buildSocialMetadata(options: {
  title: string;
  description: string;
  path?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl && options.path ? `${siteUrl}${options.path}` : undefined;

  return {
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: options.title,
      description: options.description,
      ...(pageUrl ? { url: pageUrl } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
    },
  };
}

export function createPublicMetadata(options: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const description = options.description ?? SITE_DESCRIPTION;
  const pageTitle = `${options.title} | ${SITE_NAME}`;
  const siteUrl = getSiteUrl();

  return {
    title: options.title,
    description,
    ...(siteUrl && options.path
      ? { alternates: { canonical: `${siteUrl}${options.path}` } }
      : {}),
    ...buildSocialMetadata({
      title: pageTitle,
      description,
      path: options.path,
    }),
    robots: resolvePublicRobots(),
  };
}

export function createHomeMetadata(): Metadata {
  const robots = resolvePublicRobots();
  const siteUrl = getSiteUrl();

  return {
    title: {
      absolute: SITE_DEFAULT_TITLE,
    },
    description: SITE_DESCRIPTION,
    ...(siteUrl ? { alternates: { canonical: siteUrl } } : {}),
    ...buildSocialMetadata({
      title: SITE_DEFAULT_TITLE,
      description: SITE_DESCRIPTION,
      path: "/",
    }),
    robots,
  };
}

export function createPrivateMetadata(options: {
  title: string;
  description?: string;
}): Metadata {
  return {
    title: options.title,
    description: options.description ?? SITE_DESCRIPTION,
    robots: NO_INDEX_ROBOTS,
  };
}

export function createAuthMetadata(title = "Sign In"): Metadata {
  return createPrivateMetadata({ title });
}

export function createRootMetadata(): Metadata {
  const metadataBase = getMetadataBase();
  const robots = resolvePublicRobots();

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: {
      default: SITE_DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_DEFAULT_TITLE,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_DEFAULT_TITLE,
      description: SITE_DESCRIPTION,
    },
    robots,
    manifest: "/manifest.webmanifest",
  };
}
