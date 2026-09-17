import Link from "next/link";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";

export function LandingNavbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="focus-ring rounded-lg text-white"
          aria-label="DSJourney home"
        >
          <DsjourneyLogo
            variant="horizontal"
            tone="public"
            className="h-9 w-auto text-white sm:h-10"
          />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4" aria-label="Main">
          <Link
            href="/auth"
            className="focus-ring rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/15"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
