import "server-only";

import { auth } from "@/lib/auth/server";

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
  name?: string;
}

export async function requireUser(): Promise<AuthenticatedUser> {
  const { data: session, error } = await auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
