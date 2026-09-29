"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import contactStyles from "@/components/public/contact-page.module.css";
import { PublicPageShell } from "@/components/public/public-page-shell";
import shellStyles from "@/components/public/public-page-shell.module.css";
import { isAuthenticatedAppRoute } from "@/lib/public-routes";

function AuthenticatedNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/dashboard"
        className="focus-ring mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

function PublicNotFound() {
  return (
    <PublicPageShell>
      <main>
        <div className={`${shellStyles.container} ${contactStyles.contactHero}`}>
          <p className={contactStyles.eyebrow}>404</p>
          <h1 className={contactStyles.title}>Lost on your journey?</h1>
          <p className={contactStyles.description}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </PublicPageShell>
  );
}

export function RouteNotFound() {
  const pathname = usePathname();
  const inAppShell = isAuthenticatedAppRoute(pathname);

  if (inAppShell) {
    return <AuthenticatedNotFound />;
  }

  return <PublicNotFound />;
}
