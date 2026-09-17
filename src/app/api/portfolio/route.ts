import { requireUser } from "@/lib/auth/require-user";
import { readJsonBody } from "@/lib/api/parse-json";
import {
  handleRouteError,
  jsonData,
  validationErrorResponse,
} from "@/lib/api/route-handler";
import { isValidationError, parseProjectInput } from "@/lib/api/validators";
import {
  createPortfolioProject,
  listPortfolioProjects,
} from "@/lib/repositories/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const projects = await listPortfolioProjects(user.id);
    return jsonData(projects);
  } catch (error) {
    return handleRouteError(error, "Unable to load portfolio projects.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await readJsonBody(request);
    const parsed = parseProjectInput(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const project = await createPortfolioProject(user.id, parsed);
    return jsonData(project, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to create the portfolio project.");
  }
}
