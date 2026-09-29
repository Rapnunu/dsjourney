import {
  PASSWORD_MAX_LENGTH,
} from "@/lib/auth/password-policy";

type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

const VERIFICATION_REQUIRED_CODES = new Set([
  "EMAIL_NOT_VERIFIED",
  "email_not_confirmed",
]);

const OTP_ERROR_CODES = new Set([
  "INVALID_OTP",
  "OTP_EXPIRED",
  "TOO_MANY_ATTEMPTS",
]);

type AuthErrorContext =
  | "verification"
  | "password-reset"
  | "settings"
  | "account-deletion";

function otpCodeLabel(context: AuthErrorContext): string {
  return context === "password-reset" ? "reset code" : "verification code";
}

function mapOtpErrorMessage(
  error: AuthErrorLike,
  context: AuthErrorContext,
): string | null {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();
  const codeLabel = otpCodeLabel(context);

  if (OTP_ERROR_CODES.has(code)) {
    if (code === "OTP_EXPIRED") {
      return `That ${codeLabel} has expired. Request a new code and try again.`;
    }
    if (code === "TOO_MANY_ATTEMPTS") {
      return `Too many incorrect attempts. Request a new ${codeLabel} and try again.`;
    }
    return `That ${codeLabel} is invalid. Check the code and try again.`;
  }

  if (message.includes("otp expired") || message.includes("expired")) {
    return `That ${codeLabel} has expired. Request a new code and try again.`;
  }

  if (message.includes("invalid otp") || message.includes("invalid code")) {
    return `That ${codeLabel} is invalid. Check the code and try again.`;
  }

  if (message.includes("too many attempts")) {
    return `Too many incorrect attempts. Request a new ${codeLabel} and try again.`;
  }

  return null;
}

const DUPLICATE_EMAIL_CODES = new Set([
  "USER_ALREADY_EXISTS",
  "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
  "user_already_exists",
  "email_exists",
]);

export function isVerificationRequiredError(error: AuthErrorLike): boolean {
  if (error.code && VERIFICATION_REQUIRED_CODES.has(error.code)) {
    return true;
  }

  const message = (error.message ?? "").toLowerCase();
  return (
    message.includes("email not verified") ||
    message.includes("email not confirmed") ||
    message.includes("verify your email")
  );
}

export function mapAuthErrorMessage(
  error: AuthErrorLike,
  context: AuthErrorContext = "verification",
): string {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  const otpMessage = mapOtpErrorMessage(error, context);
  if (otpMessage) {
    return otpMessage;
  }

  if (DUPLICATE_EMAIL_CODES.has(code) || message.includes("already exists")) {
    return "We couldn't create this account. Try signing in or use a different email.";
  }

  if (code === "INVALID_EMAIL" || code === "email_address_invalid") {
    return "Enter a valid email address.";
  }

  if (
    code === "PASSWORD_TOO_SHORT" ||
    code === "weak_password" ||
    message.includes("password is too short")
  ) {
    return "Password must be 10–128 characters and include uppercase, lowercase, a number, and a special character.";
  }

  if (
    code === "PASSWORD_TOO_LONG" ||
    message.includes("password is too long")
  ) {
    return `Password must be no more than ${PASSWORD_MAX_LENGTH} characters.`;
  }

  if (code === "INVALID_PASSWORD" || message.includes("invalid password")) {
    if (context === "settings" || context === "account-deletion") {
      return "Current password is incorrect.";
    }
    return "Enter a valid password.";
  }

  if (
    code === "CREDENTIAL_ACCOUNT_NOT_FOUND" ||
    message.includes("credential account not found")
  ) {
    if (context === "settings") {
      return "Password change is not available for this account.";
    }
  }

  if (
    code === "SESSION_EXPIRED" ||
    message.includes("session expired") ||
    message.includes("session is not fresh")
  ) {
    if (context === "account-deletion") {
      return "Your session is no longer fresh. Sign out, sign in again, and retry account deletion.";
    }
  }

  if (
    code === "INVALID_EMAIL_OR_PASSWORD" ||
    code === "invalid_credentials" ||
    message.includes("invalid email or password")
  ) {
    return "Incorrect email or password.";
  }

  if (
    code === "OverEmailSendRateLimit" ||
    code === "over_email_send_rate_limit" ||
    message.includes("rate limit")
  ) {
    return context === "password-reset"
      ? "Too many reset requests. Wait a moment and try again."
      : "Too many verification requests. Wait a moment and try again.";
  }

  return "Something went wrong. Please try again.";
}

export function mapOAuthQueryError(errorParam?: string): string | undefined {
  if (!errorParam) {
    return undefined;
  }

  const normalized = errorParam.toLowerCase();

  if (normalized.includes("cancel") || normalized === "access_denied") {
    return "Google sign-in was cancelled.";
  }

  if (
    normalized.includes("oauth") ||
    normalized.includes("google") ||
    normalized === "oauth_failed"
  ) {
    return "Google sign-in failed. Please try again.";
  }

  return "Authentication failed. Please try again.";
}
