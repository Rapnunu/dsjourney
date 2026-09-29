import { SessionsView } from "@/features/sessions";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Study Sessions" });

export default function StudySessionsPage() {
  return <SessionsView />;
}
