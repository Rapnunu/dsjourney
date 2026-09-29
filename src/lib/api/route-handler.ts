import "server-only";

import { NextResponse } from "next/server";
import { InvalidJsonBodyError } from "@/lib/api/parse-json";
import { UnauthorizedError } from "@/lib/auth/require-user";
import { getActionErrorMessage } from "@/lib/server/action-error";

export function jsonData<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function jsonOk(status = 200): NextResponse {
  return NextResponse.json({ ok: true }, { status });
}

export function jsonError(
  message: string,
  status: number,
  headers?: HeadersInit,
): NextResponse {
  return NextResponse.json({ error: message }, { status, headers });
}

export function validationErrorResponse(result: {
  error: string;
  status?: number;
}): NextResponse {
  return jsonError(result.error, result.status ?? 400);
}

export function handleRouteError(
  error: unknown,
  fallback: string,
): NextResponse {
  if (error instanceof InvalidJsonBodyError) {
    return jsonError(error.message, 400);
  }

  if (error instanceof UnauthorizedError) {
    return jsonError(error.message, 401);
  }

  const message = getActionErrorMessage(error, fallback);

  if (message.toLowerCase().includes("not found")) {
    return jsonError(message, 404);
  }

  return jsonError(message, 500);
}
