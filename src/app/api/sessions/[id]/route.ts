import { requireUser } from "@/lib/auth/require-user";
import { readJsonBody } from "@/lib/api/parse-json";
import {
  handleRouteError,
  jsonData,
  jsonOk,
  validationErrorResponse,
} from "@/lib/api/route-handler";
import { isValidationError, parseSessionInput } from "@/lib/api/validators";
import {
  deleteSession,
  updateSession,
} from "@/lib/repositories/sessions";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const parsed = parseSessionInput(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const session = await updateSession(user.id, id, parsed);
    return jsonData(session);
  } catch (error) {
    return handleRouteError(error, "Unable to update the study session.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    await deleteSession(user.id, id);
    return jsonOk();
  } catch (error) {
    return handleRouteError(error, "Unable to delete the study session.");
  }
}
