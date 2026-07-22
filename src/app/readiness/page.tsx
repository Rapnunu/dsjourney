import { PageHeader } from "@/components/ui/page-header";
import { Gauge } from "lucide-react";

export default function ReadinessPage() {
  return (
    <>
      <PageHeader
        title="Readiness"
        subtitle="Assess your interview readiness level"
        icon={<Gauge size={22} />}
      />
      <div className="rounded-xl border border-dashed border-border-primary bg-bg-surface/50 p-12 text-center">
        <p className="text-text-muted text-sm">Complete study sessions to see your readiness score</p>
      </div>
    </>
  );
}
