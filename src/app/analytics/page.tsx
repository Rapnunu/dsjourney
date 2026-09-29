import { AnalyticsView } from "@/features/analytics";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Analytics" });

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
