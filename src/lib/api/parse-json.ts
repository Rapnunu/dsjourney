import "server-only";

export class InvalidJsonBodyError extends Error {
  constructor() {
    super("Invalid JSON body.");
    this.name = "InvalidJsonBodyError";
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new InvalidJsonBodyError();
  }
}
