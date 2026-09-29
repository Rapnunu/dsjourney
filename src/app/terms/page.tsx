import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { TERMS_SECTIONS } from "@/components/legal/legal-sections";
import { TermsContent } from "@/components/legal/terms-content";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Terms of Service",
  description: "Terms governing use of DSJourney.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageLayout
      activePage="terms"
      eyebrow="LEGAL"
      title="Terms of Service"
      description="Rules and conditions for using DSJourney."
      sections={TERMS_SECTIONS}
    >
      <TermsContent />
    </LegalPageLayout>
  );
}
