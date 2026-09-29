import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

const stages = [
  {
    step: 1,
    title: "Learn",
    description: "Master fundamentals across Python, SQL, ML, and more.",
  },
  {
    step: 2,
    title: "Practice",
    description: "Log focused study sessions and reinforce difficult topics.",
  },
  {
    step: 3,
    title: "Build",
    description: "Grow a portfolio that demonstrates real Data Science work.",
  },
  {
    step: 4,
    title: "Become Job-Ready",
    description: "Track readiness and close gaps before internship season.",
  },
];

export function JourneySection() {
  return (
    <section
      id="journey"
      className="relative border-t border-border-subtle bg-bg-surface py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <AnimatedContent distance={16} duration={0.7} threshold={0.12}>
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Your Journey</h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            DSJourney maps your progression from first concepts to internship-ready
            confidence.
          </p>
        </AnimatedContent>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <ScrollReveal key={stage.title} delayMs={index * 80}>
              <div className="landing-card-hover rounded-2xl border border-border-subtle bg-bg-elevated/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2 text-brand-teal">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Step {stage.step}
                  </span>
                  {stage.step < 4 && (
                    <span className="hidden text-text-muted lg:inline" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {stage.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
