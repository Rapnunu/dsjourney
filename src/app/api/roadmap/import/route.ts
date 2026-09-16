import { requireUser } from "@/lib/auth/require-user";
import {
  handleRouteError,
  jsonData,
  jsonError,
} from "@/lib/api/route-handler";
import { parseRoadmapImportRecords } from "@/lib/api/validators";
import { bulkImportRoadmapProgress } from "@/lib/repositories/roadmap";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = parseRoadmapImportRecords(body);

    if ("error" in parsed) {
      return jsonError(parsed.error, 400);
    }

    const records = await bulkImportRoadmapProgress(user.id, parsed);
    return jsonData(records, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to import roadmap progress.");
  }
}
