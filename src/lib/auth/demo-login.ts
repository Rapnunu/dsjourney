import "server-only";

export function isDemoLoginEnvironment(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development"
  );
}

export function isDemoLoginConfigured(): boolean {
  const email = process.env.TEST_ACCOUNT_EMAIL?.trim();
  const password = process.env.TEST_ACCOUNT_PASSWORD?.trim();

  return Boolean(email && password);
}

export function getTestAccountCredentials(): {
  email: string;
  password: string;
} | null {
  if (!isDemoLoginEnvironment() || !isDemoLoginConfigured()) {
    return null;
  }

  return {
    email: process.env.TEST_ACCOUNT_EMAIL!.trim(),
    password: process.env.TEST_ACCOUNT_PASSWORD!.trim(),
  };
}
