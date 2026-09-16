import { requireUser } from "@/lib/auth/require-user";
import {
  handleRouteError,
  jsonData,
  jsonError,
} from "@/lib/api/route-handler";
import { parseProjectsImport } from "@/lib/api/validators";
import { bulkImportPortfolioProjects } from "@/lib/repositories/portfolio";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = parseProjectsImport(body);

    if ("error" in parsed) {
      return jsonError(parsed.error, 400);
    }

    const projects = await bulkImportPortfolioProjects(user.id, parsed);
    return jsonData(projects, 201);
  } catch (error) {
    return handleRouteError(error, "Unable to import portfolio projects.");
  }
}
