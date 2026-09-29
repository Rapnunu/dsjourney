import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { PRIVACY_SECTIONS } from "@/components/legal/legal-sections";
import { PrivacyContent } from "@/components/legal/privacy-content";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Privacy Policy",
  description: "How DSJourney handles account and learning data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      activePage="privacy"
      eyebrow="PRIVACY"
      title="Privacy Policy"
      description="How DSJourney handles your account, learning, and application data."
      sections={PRIVACY_SECTIONS}
    >
      <PrivacyContent />
    </LegalPageLayout>
  );
}
