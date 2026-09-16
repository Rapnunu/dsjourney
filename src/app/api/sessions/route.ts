import { requireUser } from "@/lib/auth/require-user";
import {
  handleRouteError,
  jsonData,
  jsonError,
} from "@/lib/api/route-handler";
import { parseSessionInput } from "@/lib/api/validators";
import {
  createSession,
  listSessions,
} from "@/lib/repositories/sessions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const sessions = await listSessions(user.id);
    return jsonData(sessions);
  } catch (error) {
    return handleRouteError(error, "Unable to load study sessions.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = parseSessionInput(body);

    if ("error" in parsed) {
      return jsonError(parsed.error, 400);
    }

    const session = await createSession(user.id, parsed);
    return jsonData(session, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to create the study session.");
  }
}
