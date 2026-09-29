import { requireUser } from "@/lib/auth/require-user";
import { readJsonBody } from "@/lib/api/parse-json";
import { enforceRateLimit } from "@/lib/api/rate-limit";
import {
  handleRouteError,
  jsonData,
  jsonOk,
  validationErrorResponse,
} from "@/lib/api/route-handler";
import { isValidationError, parseProjectInput } from "@/lib/api/validators";
import {
  deletePortfolioProject,
  updatePortfolioProject,
} from "@/lib/repositories/portfolio";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const rateLimitResponse = await enforceRateLimit(user.id, "mutation");

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = await context.params;
    const body = await readJsonBody(request);
    const parsed = parseProjectInput(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const project = await updatePortfolioProject(user.id, id, parsed);
    return jsonData(project);
  } catch (error) {
    return handleRouteError(error, "Unable to update the portfolio project.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const rateLimitResponse = await enforceRateLimit(user.id, "mutation");

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = await context.params;
    await deletePortfolioProject(user.id, id);
    return jsonOk();
  } catch (error) {
    return handleRouteError(error, "Unable to delete the portfolio project.");
  }
}
