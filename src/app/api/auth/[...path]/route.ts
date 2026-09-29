import { rejectWeakAuthProxyPassword } from "@/lib/auth/auth-proxy-password-guard";
import { auth } from "@/lib/auth/server";

const neonHandlers = auth.handler();

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handleAuthRequest(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  request: Request,
  context: RouteContext,
): Promise<Response> {
  if (method === "POST") {
    const path = (await context.params).path.join("/");
    const rejection = await rejectWeakAuthProxyPassword(request, path);

    if (rejection) {
      return rejection;
    }
  }

  return neonHandlers[method](request, context);
}

export async function GET(request: Request, context: RouteContext) {
  return handleAuthRequest("GET", request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleAuthRequest("POST", request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handleAuthRequest("PUT", request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleAuthRequest("DELETE", request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handleAuthRequest("PATCH", request, context);
}
