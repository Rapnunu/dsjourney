import { requireUser } from "@/lib/auth/require-user";
import {
  handleRouteError,
  jsonData,
  jsonError,
} from "@/lib/api/route-handler";
import { parseProjectInput } from "@/lib/api/validators";
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
    const body = await request.json();
    const parsed = parseProjectInput(body);

    if ("error" in parsed) {
      return jsonError(parsed.error, 400);
    }

    const project = await createPortfolioProject(user.id, parsed);
    return jsonData(project, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to create the portfolio project.");
  }
}
