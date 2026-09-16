import { requireUser } from "@/lib/auth/require-user";
import { handleRouteError, jsonData } from "@/lib/api/route-handler";
import { listRoadmapProgress } from "@/lib/repositories/roadmap";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const records = await listRoadmapProgress(user.id);
    return jsonData(records);
  } catch (error) {
    return handleRouteError(error, "Unable to load roadmap progress.");
  }
}
