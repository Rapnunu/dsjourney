import { FeatureSection } from "@/components/landing/feature-section";
import { FaqSection } from "@/components/landing/faq-section";
import { JourneySection } from "@/components/landing/journey-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { ProgressSection } from "@/components/landing/progress-section";
import { PublicFooter } from "@/components/public/public-footer";

export function LandingPage() {
  return (
    <div className="public-page min-h-screen bg-black text-white">
      <main>
        <LandingHero />
        <JourneySection />
        <FeatureSection />
        <FaqSection />
        <ProgressSection />
      </main>

      <PublicFooter />
    </div>
  );
}
