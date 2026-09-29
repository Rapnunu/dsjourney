"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import contactStyles from "@/components/public/contact-page.module.css";
import { PublicPageShell } from "@/components/public/public-page-shell";
import shellStyles from "@/components/public/public-page-shell.module.css";
import { isAuthenticatedAppRoute } from "@/lib/public-routes";

interface RouteErrorProps {
  reset: () => void;
}

function AuthenticatedError({ reset }: RouteErrorProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
      <h1 className="text-2xl font-semibold text-text-primary">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        We couldn&apos;t load this page. Try again or return to your dashboard.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-surface-hover"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function PublicError({ reset }: RouteErrorProps) {
  return (
    <PublicPageShell>
      <main>
        <div className={`${shellStyles.container} ${contactStyles.contactHero}`}>
          <h1 className={contactStyles.title}>Something went wrong</h1>
          <p className={contactStyles.description}>
            We couldn&apos;t load this page.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </PublicPageShell>
  );
}

export function RouteError({ reset }: RouteErrorProps) {
  const pathname = usePathname();
  const inAppShell = isAuthenticatedAppRoute(pathname);

  if (inAppShell) {
    return <AuthenticatedError reset={reset} />;
  }

  return <PublicError reset={reset} />;
}
