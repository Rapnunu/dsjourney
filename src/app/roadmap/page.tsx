import { RoadmapView } from "@/features/roadmap";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Roadmap" });

export default function RoadmapPage() {
  return <RoadmapView />;
}
