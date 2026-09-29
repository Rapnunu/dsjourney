import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { FAQ_ITEMS, FaqAccordion } from "@/components/landing/faq-accordion";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative border-t border-white/10 bg-black py-20 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-[62rem] px-5 sm:px-8 lg:px-10">
        <AnimatedContent distance={16} duration={0.7} threshold={0.12}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-bold text-white sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-2xl text-white/65">
            Everything you need to know before starting your DSJourney.
          </p>
        </AnimatedContent>

        <ScrollReveal className="mt-10">
          <FaqAccordion items={FAQ_ITEMS} />
        </ScrollReveal>
      </div>
    </section>
  );
}
