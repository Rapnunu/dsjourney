import { requireUser } from "@/lib/auth/require-user";
import {
  handleRouteError,
  jsonData,
  jsonError,
} from "@/lib/api/route-handler";
import { parseStudySessionsImport } from "@/lib/api/validators";
import { bulkImportSessions } from "@/lib/repositories/sessions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = parseStudySessionsImport(body);

    if ("error" in parsed) {
      return jsonError(parsed.error, 400);
    }

    const sessions = await bulkImportSessions(user.id, parsed);
    return jsonData(sessions, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to import study sessions.");
  }
}
