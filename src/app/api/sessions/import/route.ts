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
  parseStudySessionsImport,
} from "@/lib/api/validators";
import { bulkImportSessions } from "@/lib/repositories/sessions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const rateLimitResponse = await enforceRateLimit(user.id, "import");

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await readJsonBody(request);
    const parsed = parseStudySessionsImport(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const sessions = await bulkImportSessions(user.id, parsed);
    return jsonData(sessions, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to import study sessions.");
  }
}
