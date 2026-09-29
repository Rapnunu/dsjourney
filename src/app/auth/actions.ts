"use server";

import { getPasswordPolicyErrorMessage } from "@/lib/auth/password-policy";
import {
  isVerificationRequiredError,
  mapAuthErrorMessage,
} from "@/lib/auth/auth-errors";
import { LEGAL_AGREEMENT_ERROR, PASSWORD_RESET_EMAIL_OTP_TYPE } from "@/lib/auth/constants";
import { getTestAccountCredentials, isDemoLoginEnvironment } from "@/lib/auth/demo-login";
import { auth } from "@/lib/auth/server";

type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

export type AuthActionResult =
  | { success: true; authenticated: true }
  | { success: true; requiresVerification: true; email: string }
  | { success: true; verified: true; authenticated: false }
  | { success: true; codeSent: true }
  | { success: true; passwordResetRequested: true; email: string }
  | { success: true; passwordResetComplete: true }
  | {
      error: string;
      requiresVerification?: true;
      email?: string;
    };

function mapActionError(
  error: AuthErrorLike,
  context: "verification" | "password-reset" = "verification",
): AuthActionResult {
  return { error: mapAuthErrorMessage(error, context) };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  return email.trim();
}

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export async function signInAction(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    if (isVerificationRequiredError(error)) {
      return {
        error: "Verify your email to continue.",
        requiresVerification: true,
        email,
      };
    }

    return mapActionError(error);
  }

  return { success: true, authenticated: true };
}

export async function signUpAction(
  email: string,
  password: string,
  agreedToTerms: boolean,
): Promise<AuthActionResult> {
  if (!agreedToTerms) {
    return { error: LEGAL_AGREEMENT_ERROR };
  }

  const passwordPolicyError = getPasswordPolicyErrorMessage(password);
  if (passwordPolicyError) {
    return { error: passwordPolicyError };
  }

  const name = email.split("@")[0]?.trim() || "Account";

  const { data, error } = await auth.signUp.email({
    email,
    password,
    name,
  });

  if (error) {
    return mapActionError(error);
  }

  const { data: session } = await auth.getSession();

  if (session?.user?.emailVerified) {
    return { success: true, authenticated: true };
  }

  if (data?.user?.emailVerified) {
    return { success: true, authenticated: true };
  }

  return {
    success: true,
    requiresVerification: true,
    email: data?.user?.email ?? email,
  };
}

export async function verifyEmailAction(
  email: string,
  otp: string,
): Promise<AuthActionResult> {
  const trimmedCode = otp.trim();

  if (!trimmedCode) {
    return { error: "Enter the verification code from your email." };
  }

  const { error } = await auth.emailOtp.verifyEmail({
    email,
    otp: trimmedCode,
  });

  if (error) {
    return mapActionError(error);
  }

  const { data: session } = await auth.getSession();

  if (session?.user) {
    return { success: true, authenticated: true };
  }

  return { success: true, verified: true, authenticated: false };
}

export async function resendVerificationCodeAction(
  email: string,
): Promise<AuthActionResult> {
  const { error } = await auth.emailOtp.sendVerificationOtp({
    email,
    type: "email-verification",
  });

  if (error) {
    return mapActionError(error);
  }

  return { success: true, codeSent: true };
}

export async function requestPasswordResetAction(
  email: string,
): Promise<AuthActionResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return { error: "Enter a valid email address." };
  }

  const { error } = await auth.emailOtp.sendVerificationOtp({
    email: normalizedEmail,
    type: PASSWORD_RESET_EMAIL_OTP_TYPE,
  });

  if (error) {
    const mapped = mapAuthErrorMessage(error, "password-reset");

    if (
      error.code === "OverEmailSendRateLimit" ||
      error.code === "over_email_send_rate_limit" ||
      (error.message ?? "").toLowerCase().includes("rate limit")
    ) {
      return { error: mapped };
    }

    if (
      error.code === "INVALID_EMAIL" ||
      error.code === "email_address_invalid"
    ) {
      return { error: mapped };
    }
  }

  return {
    success: true,
    passwordResetRequested: true,
    email: normalizedEmail,
  };
}

export async function resetPasswordAction(
  email: string,
  otp: string,
  password: string,
): Promise<AuthActionResult> {
  const normalizedEmail = normalizeEmail(email);
  const trimmedCode = otp.trim();

  if (!isValidEmail(normalizedEmail)) {
    return { error: "Enter a valid email address." };
  }

  if (!trimmedCode) {
    return { error: "Enter the reset code from your email." };
  }

  const passwordPolicyError = getPasswordPolicyErrorMessage(password);
  if (passwordPolicyError) {
    return { error: passwordPolicyError };
  }

  const { error } = await auth.emailOtp.resetPassword({
    email: normalizedEmail,
    otp: trimmedCode,
    password,
  });

  if (error) {
    return mapActionError(error, "password-reset");
  }

  const { data: session } = await auth.getSession();

  if (session?.user) {
    await auth.signOut();
  }

  return { success: true, passwordResetComplete: true };
}

export async function resendPasswordResetCodeAction(
  email: string,
): Promise<AuthActionResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return { error: "Enter a valid email address." };
  }

  const { error } = await auth.emailOtp.sendVerificationOtp({
    email: normalizedEmail,
    type: PASSWORD_RESET_EMAIL_OTP_TYPE,
  });

  if (error) {
    return mapActionError(error, "password-reset");
  }

  return { success: true, codeSent: true };
}

export async function signOutAction(): Promise<
  { success: true } | { error: string }
> {
  await auth.signOut();
  return { success: true };
}

export async function demoLoginAction(): Promise<
  { success: true } | { error: string }
> {
  if (!isDemoLoginEnvironment()) {
    return { error: "Demo login is not available." };
  }

  const credentials = getTestAccountCredentials();

  if (!credentials) {
    return { error: "Test account is not configured." };
  }

  const { error } = await auth.signIn.email({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { error: mapAuthErrorMessage(error) };
  }

  return { success: true };
}
