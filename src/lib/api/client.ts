import { handleAuthExpiredFromApi } from "./auth-expiry";
import { ApiError } from "./api-error";

export { ApiError } from "./api-error";

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (isJsonRecord(body) && typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }

  return fallback;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function invalidResponseError(path: string, status: number): ApiError {
  return new ApiError(`Invalid API response from ${path}.`, status);
}

function unexpectedResponseError(
  path: string,
  response: Response,
): ApiError {
  const contentType = response.headers.get("content-type") ?? "unknown";

  if (response.redirected) {
    return new ApiError(
      `Unexpected redirect from ${path} to ${response.url}.`,
      response.status,
    );
  }

  if (contentType.includes("text/html")) {
    return new ApiError(
      `Unexpected HTML response from ${path}.`,
      response.status,
    );
  }

  return invalidResponseError(path, response.status);
}

function extractData<T>(
  body: unknown,
  path: string,
  response: Response,
): T {
  if (!isJsonRecord(body) || !("data" in body) || body.data === null) {
    throw unexpectedResponseError(path, response);
  }

  return body.data as T;
}

function assertDeleteSuccess(
  body: unknown,
  path: string,
  response: Response,
): void {
  if (!isJsonRecord(body) || body.ok !== true) {
    throw unexpectedResponseError(path, response);
  }
}

async function request(
  path: string,
  init?: RequestInit,
): Promise<{ response: Response; body: unknown }> {
  const hasBody = init?.body !== undefined && init?.body !== null;
  const headers = new Headers(init?.headers);

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    cache: "no-store",
    ...init,
    credentials: "same-origin",
    headers,
  });

  const body = await readResponseBody(response);
  return { response, body };
}

function throwApiError(path: string, response: Response, body: unknown): never {
  const error = new ApiError(
    getErrorMessage(body, "Request failed."),
    response.status,
  );

  if (response.status === 401) {
    handleAuthExpiredFromApi();
  }

  throw error;
}

async function requestData<T>(path: string, init?: RequestInit): Promise<T> {
  const { response, body } = await request(path, init);

  if (!response.ok) {
    throwApiError(path, response, body);
  }

  return extractData<T>(body, path, response);
}

export async function apiGet<T>(path: string): Promise<T> {
  return requestData<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  return requestData<T>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiPut<T>(path: string, payload: unknown): Promise<T> {
  return requestData<T>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiPatch<T>(path: string, payload: unknown): Promise<T> {
  return requestData<T>(path, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiDelete(path: string): Promise<void> {
  const { response, body } = await request(path, { method: "DELETE" });

  if (!response.ok) {
    throwApiError(path, response, body);
  }

  assertDeleteSuccess(body, path, response);
}
