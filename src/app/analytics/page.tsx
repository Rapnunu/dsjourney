import { PageHeader } from "@/components/ui/page-header";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Insights into your preparation progress"
        icon={<BarChart3 size={22} />}
      />
      <div className="rounded-xl border border-dashed border-border-primary bg-bg-surface/50 p-12 text-center">
        <p className="text-text-muted text-sm">No analytics data available yet</p>
      </div>
    </>
  );
}
