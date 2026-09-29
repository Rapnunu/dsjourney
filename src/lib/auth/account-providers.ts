const PROVIDER_LABELS: Record<string, string> = {
  credential: "Email & Password",
  google: "Google",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readProviderId(account: unknown): string | null {
  if (!isRecord(account)) {
    return null;
  }

  const providerId = account.providerId;

  if (typeof providerId !== "string" || !providerId.trim()) {
    return null;
  }

  return providerId;
}

export interface LinkedAccountInfo {
  providerIds: string[];
  signInMethodLabels: string[];
  hasCredentialAccount: boolean;
}

/**
 * Normalizes Neon Auth / Better Auth listAccounts responses into display labels.
 */
export function parseLinkedAccounts(accounts: unknown): LinkedAccountInfo {
  const rawAccounts = Array.isArray(accounts) ? accounts : [];
  const providerIds = [
    ...new Set(
      rawAccounts
        .map(readProviderId)
        .filter((providerId): providerId is string => Boolean(providerId)),
    ),
  ];

  const signInMethodLabels = providerIds.map(
    (providerId) => PROVIDER_LABELS[providerId] ?? providerId,
  );

  return {
    providerIds,
    signInMethodLabels,
    hasCredentialAccount: providerIds.includes("credential"),
  };
}
