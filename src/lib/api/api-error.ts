export class ApiError extends Error {
  readonly status: number;
  readonly retryAfterSeconds?: number;

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/** Duck-typed check so bundled ApiError instances still map correctly. */
export function isApiError(error: unknown): error is ApiError {
  if (error instanceof ApiError) {
    return true;
  }

  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as Record<string, unknown>;

  return (
    candidate.name === "ApiError" &&
    typeof candidate.status === "number" &&
    Number.isFinite(candidate.status)
  );
}

export function getApiErrorRetryAfterSeconds(error: unknown): number | undefined {
  if (!isApiError(error)) {
    return undefined;
  }

  return typeof error.retryAfterSeconds === "number"
    ? error.retryAfterSeconds
    : undefined;
}
