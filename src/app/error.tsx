"use client";

import { useEffect } from "react";
import Link from "next/link";
import contactStyles from "@/components/public/contact-page.module.css";
import { PublicPageShell } from "@/components/public/public-page-shell";
import shellStyles from "@/components/public/public-page-shell.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
