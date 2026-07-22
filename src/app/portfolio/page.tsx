import { PageHeader } from "@/components/ui/page-header";
import { FolderKanban } from "lucide-react";

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle="Showcase your projects and achievements"
        icon={<FolderKanban size={22} />}
      />
      <div className="rounded-xl border border-dashed border-border-primary bg-bg-surface/50 p-12 text-center">
        <p className="text-text-muted text-sm">No portfolio projects added yet</p>
      </div>
    </>
  );
}
