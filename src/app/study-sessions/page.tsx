import { PageHeader } from "@/components/ui/page-header";
import { BookOpen } from "lucide-react";
import { SessionsView } from "@/features/sessions";

export default function StudySessionsPage() {
  return (
    <>
      <PageHeader
        title="Study Sessions"
        subtitle="Track and review your study sessions"
        icon={<BookOpen size={22} />}
      />
      <SessionsView />
    </>
  );
}
