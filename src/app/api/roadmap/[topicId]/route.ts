import { requireUser } from "@/lib/auth/require-user";
import { readJsonBody } from "@/lib/api/parse-json";
import { enforceRateLimit } from "@/lib/api/rate-limit";
import {
  handleRouteError,
  jsonData,
  jsonOk,
  validationErrorResponse,
} from "@/lib/api/route-handler";
import {
  isValidationError,
  parseRoadmapUpsertBody,
  parseTopicIdParam,
} from "@/lib/api/validators";
import {
  deleteRoadmapProgressOverride,
  upsertRoadmapProgress,
} from "@/lib/repositories/roadmap";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ topicId: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const rateLimitResponse = await enforceRateLimit(user.id, "mutation");

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { topicId: rawTopicId } = await context.params;
    const topicIdResult = parseTopicIdParam(rawTopicId);

    if (isValidationError(topicIdResult)) {
      return validationErrorResponse(topicIdResult);
    }

    const body = await readJsonBody(request);
    const parsed = parseRoadmapUpsertBody(body);

    if (isValidationError(parsed)) {
      return validationErrorResponse(parsed);
    }

    const record = await upsertRoadmapProgress(
      user.id,
      topicIdResult,
      parsed.mastery,
      parsed.lastStudied,
    );
    return jsonData(record);
  } catch (error) {
    return handleRouteError(error, "Unable to update roadmap progress.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const rateLimitResponse = await enforceRateLimit(user.id, "mutation");

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { topicId: rawTopicId } = await context.params;
    const topicIdResult = parseTopicIdParam(rawTopicId);

    if (isValidationError(topicIdResult)) {
      return validationErrorResponse(topicIdResult);
    }

    await deleteRoadmapProgressOverride(user.id, topicIdResult);
    return jsonOk();
  } catch (error) {
    return handleRouteError(error, "Unable to delete roadmap progress override.");
  }
}
