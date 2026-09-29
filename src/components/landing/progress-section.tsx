import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function ProgressSection() {
  return (
    <section className="relative border-t border-border-subtle bg-bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="rounded-3xl border border-border-subtle bg-gradient-to-br from-brand-teal/10 via-transparent to-brand-electric/10 p-8 sm:p-12">
            <AnimatedContent distance={14} duration={0.65} threshold={0.15}>
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
                Progress With Purpose
              </h2>
            </AnimatedContent>
            <AnimatedContent
              distance={14}
              duration={0.65}
              threshold={0.15}
              delay={0.08}
            >
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
                Every study session, roadmap milestone, and portfolio project
                contributes to a clearer picture of your Data Science career
                readiness. DSJourney helps you see the connection between daily
                effort and long-term goals.
              </p>
            </AnimatedContent>
            <AnimatedContent
              distance={12}
              duration={0.65}
              threshold={0.15}
              delay={0.16}
            >
              <Link
                href="/auth?mode=signup"
                className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-opacity hover:opacity-90"
              >
                Start Your Journey
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </AnimatedContent>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
