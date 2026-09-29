import { requireUser } from "@/lib/auth/require-user";
import { readJsonBody } from "@/lib/api/parse-json";
import { enforceRateLimit } from "@/lib/api/rate-limit";
import {
  handleRouteError,
  jsonData,
  validationErrorResponse,
} from "@/lib/api/route-handler";
import {
  isValidationError,
  parseRoadmapImportRecords,
} from "@/lib/api/validators";
import { bulkImportRoadmapProgress } from "@/lib/repositories/roadmap";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const rateLimitResponse = await enforceRateLimit(user.id, "import");

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await readJsonBody(request);
    const parsed = parseRoadmapImportRecords(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const records = await bulkImportRoadmapProgress(user.id, parsed);
    return jsonData(records, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to import roadmap progress.");
  }
}
