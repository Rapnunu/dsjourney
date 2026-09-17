import { FeatureSection } from "@/components/landing/feature-section";
import { JourneySection } from "@/components/landing/journey-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { ProgressSection } from "@/components/landing/progress-section";

export function LandingPage() {
  return (
    <div className="public-page min-h-screen bg-black text-white">
      <main>
        <LandingHero />
        <JourneySection />
        <FeatureSection />
        <ProgressSection />
      </main>

      <footer className="border-t border-white/10 bg-black px-5 py-8 text-center text-sm text-white/40">
        <p>DSJourney — Your Data Science Journey Starts Here</p>
      </footer>
    </div>
  );
}
