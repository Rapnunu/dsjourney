/** Single-flight auth-expiry handling for API 401 responses. */

export const AUTH_EXPIRED_TOAST_ID = "auth-session-expired";
const SIGNING_OUT_KEY = "dsjourney:signing-out";
const IDLE_TIMEOUT_SIGNOUT_KEY = "dsjourney:idle-timeout-signout";

let isHandlingAuthExpiry = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isPublicAppRoute(pathname?: string): boolean {
  const path = pathname ?? (isBrowser() ? window.location.pathname : "/");
  return path === "/" || path.startsWith("/auth");
}

export function markSigningOut(): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(SIGNING_OUT_KEY, "1");
}

export function markIdleTimeoutSignOut(): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(IDLE_TIMEOUT_SIGNOUT_KEY, "1");
}

export function clearSigningOutFlag(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(SIGNING_OUT_KEY);
}

export function clearIdleTimeoutSignOutFlag(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(IDLE_TIMEOUT_SIGNOUT_KEY);
}

function isSigningOut(): boolean {
  return isBrowser() && sessionStorage.getItem(SIGNING_OUT_KEY) === "1";
}

function isIdleTimeoutSignOut(): boolean {
  return (
    isBrowser() && sessionStorage.getItem(IDLE_TIMEOUT_SIGNOUT_KEY) === "1"
  );
}

/**
 * Handle an API 401 once: deduped toast + full-document redirect to /auth.
 * No-op on public routes, while already handling, during intentional sign-out,
 * or after an idle-timeout redirect has already started.
 */
export function handleAuthExpiredFromApi(): void {
  if (!isBrowser()) return;
  if (isHandlingAuthExpiry) return;
  if (isPublicAppRoute()) return;
  if (isSigningOut()) return;
  if (isIdleTimeoutSignOut()) return;

  isHandlingAuthExpiry = true;

  void import("@/lib/toast").then(({ showSessionExpiredToast }) => {
    showSessionExpiredToast();
  });

  window.location.replace("/auth");
}
