/** Better Auth email-otp default length (see EmailOTPOptions.otpLength). */
export const VERIFICATION_CODE_LENGTH = 6;

/** Client-side UX cooldown between resend attempts (seconds). */
export const VERIFICATION_RESEND_COOLDOWN_SECONDS = 45;

export const LEGAL_AGREEMENT_ERROR =
  "You must agree to the Terms of Service and Privacy Policy to create an account.";

export const PASSWORD_RESET_REQUEST_SUCCESS =
  "If an account exists for this email, we'll send password reset instructions.";

export const PASSWORD_RESET_EMAIL_OTP_TYPE = "forget-password" as const;
