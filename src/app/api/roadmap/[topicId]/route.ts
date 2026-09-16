import { requireUser } from "@/lib/auth/require-user";
import {
  handleRouteError,
  jsonData,
  jsonError,
  jsonOk,
} from "@/lib/api/route-handler";
import { parseRoadmapUpsertBody } from "@/lib/api/validators";
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
    const { topicId } = await context.params;
    const body = await request.json();
    const parsed = parseRoadmapUpsertBody(body);

    if ("error" in parsed) {
      return jsonError(parsed.error, 400);
    }

    const record = await upsertRoadmapProgress(
      user.id,
      topicId,
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
    const { topicId } = await context.params;
    await deleteRoadmapProgressOverride(user.id, topicId);
    return jsonOk();
  } catch (error) {
    return handleRouteError(error, "Unable to delete roadmap progress override.");
  }
}
