import { ReadinessView } from "@/features/readiness";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Internship Readiness" });

export default function ReadinessPage() {
  return <ReadinessView />;
}
