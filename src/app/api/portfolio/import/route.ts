import { requireUser } from "@/lib/auth/require-user";
import { readJsonBody } from "@/lib/api/parse-json";
import {
  handleRouteError,
  jsonData,
  validationErrorResponse,
} from "@/lib/api/route-handler";
import {
  isValidationError,
  parseProjectsImport,
} from "@/lib/api/validators";
import { bulkImportPortfolioProjects } from "@/lib/repositories/portfolio";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await readJsonBody(request);
    const parsed = parseProjectsImport(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const projects = await bulkImportPortfolioProjects(user.id, parsed);
    return jsonData(projects, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to import portfolio projects.");
  }
}
