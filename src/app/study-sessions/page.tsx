import { PageHeader } from "@/components/ui/page-header";
import { BookOpen } from "lucide-react";
import { SessionsView } from "@/features/sessions";

export default function StudySessionsPage() {
  return (
    <>
      <PageHeader
        title="Study Sessions"
        subtitle="Log focused study sessions and review your history."
        icon={<BookOpen size={22} />}
      />
      <SessionsView />
    </>
  );
}
