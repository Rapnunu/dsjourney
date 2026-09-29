import { DashboardView } from "@/features/dashboard";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Dashboard" });

export default function DashboardPage() {
  return <DashboardView />;
}
