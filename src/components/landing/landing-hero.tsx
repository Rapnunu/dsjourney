"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { LandingBackground } from "@/components/landing/landing-background";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import FadeContent from "@/components/react-bits/FadeContent";
import Magnet from "@/components/react-bits/Magnet";
import SplitText from "@/components/react-bits/SplitText";

export function LandingHero() {
  return (
    <section className="relative min-h-screen">
      <LandingBackground />
      <LandingNavbar />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 pb-24 pt-28 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <FadeContent triggerOnMount delay={0} duration={0.65} y={12}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-cyan sm:text-sm">
              Your Data Science Career Journey
            </p>
          </FadeContent>

          <div className="mb-6 flex items-end gap-4">
            <SplitText
              text="DSJourney"
              tag="h1"
              splitType="words"
              delay={80}
              duration={0.65}
              ease="power3.out"
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
              triggerOnMount
              className="text-5xl font-bold tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
            />
            <FadeContent
              triggerOnMount
              delay={0.2}
              duration={0.65}
              y={10}
              className="hidden sm:block"
            >
              <DsjourneyLogo
                variant="mark"
                tone="public"
                className="h-16 w-16 opacity-90"
                aria-hidden="true"
              />
            </FadeContent>
          </div>

          <FadeContent triggerOnMount delay={0.28} duration={0.65} y={14}>
            <p className="text-xl font-medium text-text-primary sm:text-2xl">
              Learn, track, and grow into a Data Scientist.
            </p>
          </FadeContent>

          <FadeContent triggerOnMount delay={0.36} duration={0.65} y={14}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
              One place to manage your learning roadmap, study sessions, portfolio
              progress, analytics, and internship readiness.
            </p>
          </FadeContent>

          <FadeContent triggerOnMount delay={0.44} duration={0.65} y={12}>
            <p className="mt-3 text-sm text-text-muted">
              Track progress. Build skills. Become job-ready.
            </p>
          </FadeContent>

          <FadeContent triggerOnMount delay={0.52} duration={0.65} y={12}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnet magnetStrength={22} padding={72}>
                <Link
                  href="/auth?mode=signup"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-cyan px-7 py-3.5 text-sm font-semibold text-brand-navy transition-opacity hover:opacity-95"
                >
                  Start Your Journey
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Magnet>
              <Link
                href="/auth"
                className="focus-ring inline-flex items-center justify-center rounded-full border border-border-strong bg-bg-elevated/80 px-7 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-colors hover:bg-bg-surface-hover"
              >
                Sign In
              </Link>
            </div>
          </FadeContent>
        </div>
      </div>

      <div
        className="scroll-hint-pulse absolute bottom-8 left-1/2 z-10 text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted"
        aria-hidden="true"
      >
        Scroll to explore
      </div>
    </section>
  );
}
