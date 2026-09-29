"use client";

import Link from "next/link";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { ThemeToggleCompact } from "@/components/theme/theme-toggle";
import { useTheme } from "@/components/theme/theme-provider";

export function LandingNavbar() {
  const { theme } = useTheme();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="focus-ring rounded-lg text-text-primary"
          aria-label="DSJourney home"
        >
          <DsjourneyLogo
            variant="horizontal"
            tone={theme === "dark" ? "public" : "default"}
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="flex shrink-0 items-center gap-3 sm:gap-4" aria-label="Main">
          <ThemeToggleCompact className="w-[5.5rem] shrink-0" />
          <Link
            href="/auth"
            className="focus-ring inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-border-strong bg-bg-elevated/80 px-5 py-2.5 text-sm font-medium text-text-primary backdrop-blur-sm transition-colors hover:bg-bg-surface-hover"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
