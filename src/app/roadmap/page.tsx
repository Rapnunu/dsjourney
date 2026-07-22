import { PageHeader } from "@/components/ui/page-header";
import { Map } from "lucide-react";
import { RoadmapView } from "@/features/roadmap";

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        title="Roadmap"
        subtitle="Your learning path and topic progression"
        icon={<Map size={22} />}
      />
      <RoadmapView />
    </>
  );
}
