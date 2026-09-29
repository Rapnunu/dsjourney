import { TodayView } from "@/features/today";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Today" });

export default function TodayPage() {
  return <TodayView />;
}
