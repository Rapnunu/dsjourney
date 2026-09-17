import {
  BarChart3,
  BookOpen,
  FolderKanban,
  Gauge,
  Map,
} from "lucide-react";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const features = [
  {
    icon: Map,
    title: "Roadmap",
    description:
      "Structured mastery tracking across core Data Science topics.",
  },
  {
    icon: BookOpen,
    title: "Study Sessions",
    description:
      "Capture what you studied, for how long, and how challenging it felt.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "See patterns in your effort and focus where it matters most.",
  },
  {
    icon: Gauge,
    title: "Readiness",
    description:
      "Measure internship readiness from your real learning progress.",
  },
  {
    icon: FolderKanban,
    title: "Portfolio",
    description: "Organize projects that prove your skills to recruiters.",
  },
];

export function FeatureSection() {
  return (
    <section
      id="features"
      className="relative border-t border-white/10 bg-[#060d16] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <AnimatedContent distance={16} duration={0.7} threshold={0.12}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            What DSJourney Tracks
          </h2>
          <p className="mt-3 max-w-2xl text-white/65">
            Everything you need to stay intentional about your Data Science
            preparation.
          </p>
        </AnimatedContent>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delayMs={index * 70}>
                <article className="landing-card-hover h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-brand-teal/10 p-3 text-brand-cyan">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {feature.description}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
