import "server-only";

import { createClient } from "@/lib/supabase/server";

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export async function requireUser(): Promise<AuthenticatedUser> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new UnauthorizedError();
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
}
