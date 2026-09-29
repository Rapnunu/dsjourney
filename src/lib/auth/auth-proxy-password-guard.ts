import "server-only";

import { NextResponse } from "next/server";
import { getPasswordPolicyErrorMessage } from "@/lib/auth/password-policy";

interface PasswordProxyRule {
  fields: Array<"password" | "newPassword">;
}

const PASSWORD_PROXY_RULES: Record<string, PasswordProxyRule> = {
  "sign-up/email": { fields: ["password"] },
  "change-password": { fields: ["newPassword"] },
  "reset-password": { fields: ["newPassword", "password"] },
  "email-otp/passcode": { fields: ["password"] },
  "admin/create-user": { fields: ["password"] },
  "admin/set-user-password": { fields: ["newPassword", "password"] },
};

function readPasswordField(
  body: unknown,
  fields: PasswordProxyRule["fields"],
): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;

  for (const field of fields) {
    const value = record[field];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

export async function rejectWeakAuthProxyPassword(
  request: Request,
  path: string,
): Promise<Response | null> {
  const rule = PASSWORD_PROXY_RULES[path];

  if (!rule || request.method !== "POST") {
    return null;
  }

  let body: unknown;

  try {
    body = await request.clone().json();
  } catch {
    return null;
  }

  const password = readPasswordField(body, rule.fields);

  if (!password) {
    return null;
  }

  const policyError = getPasswordPolicyErrorMessage(password);

  if (!policyError) {
    return null;
  }

  return NextResponse.json(
    {
      code: "weak_password",
      message: policyError,
    },
    { status: 400 },
  );
}
