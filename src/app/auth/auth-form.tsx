"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { PasswordInput } from "@/components/auth/password-input";
import {
  clearIdleTimeoutSignOutFlag,
  clearSigningOutFlag,
} from "@/lib/api/auth-expiry";
import { clearIdleTimeoutRuntimeFlags } from "@/lib/auth/session-timeout/perform-idle-timeout-sign-out";
import {
  LEGAL_AGREEMENT_ERROR,
  PASSWORD_RESET_REQUEST_SUCCESS,
  VERIFICATION_RESEND_COOLDOWN_SECONDS,
} from "@/lib/auth/constants";
import {
  getPasswordPolicyErrorMessage,
  validatePassword,
} from "@/lib/auth/password-policy";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { showSuccessToast } from "@/lib/toast";
import { FieldError } from "@/components/ui/field-error";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { LegalModalLinkButton } from "@/components/auth/legal-modal-link-button";
import { VerificationCodeInput } from "@/components/auth/verification-code-input";
import {
  demoLoginAction,
  requestPasswordResetAction,
  resendPasswordResetCodeAction,
  resendVerificationCodeAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
  verifyEmailAction,
} from "./actions";

type AuthMode =
  | "sign_in"
  | "sign_up"
  | "verify_email"
  | "forgot_password"
  | "reset_password";

interface AuthFormProps {
  initialError?: string;
  initialMessage?: string;
  initialMode?: "sign_in" | "sign_up";
  showDemoSection?: boolean;
  demoLoginAvailable?: boolean;
}

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  legalAgreement?: string;
  resetCode?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

function navigateAfterAuthSuccess(): void {
  window.location.replace("/today");
}

const emailInputClassName =
  "w-full rounded-[9px] border border-white/10 bg-[#11161D] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-colors h-11";

function AuthOrDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-white/[0.08]" />
      </div>
      <p className="relative mx-auto w-fit px-3 text-sm text-text-muted">Or</p>
    </div>
  );
}

function AuthSectionDivider({ label }: { label: string }) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-white/[0.08]" />
      </div>
      <p className="relative mx-auto w-fit px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        {label}
      </p>
    </div>
  );
}

function AuthCardIcon() {
  return (
    <div className="mb-[18px] flex justify-center">
      <DsjourneyLogo variant="icon" tone="public" className="h-10 w-10" />
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  loading,
}: {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-brand-teal px-4 text-sm font-semibold text-brand-navy transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        <ArrowRight size={16} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring h-11 w-full rounded-[9px] border border-white/10 bg-[#11161D] px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-white/[0.04]"
    >
      {children}
    </button>
  );
}

function FormBanner({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (!error && !message) {
    return null;
  }

  return (
    <div className="space-y-3">
      {error && (
        <p
          role="alert"
          className="rounded-[9px] border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-[9px] border border-success/30 bg-success/10 px-3 py-2 text-sm text-success whitespace-pre-line"
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function AuthForm({
  initialError,
  initialMessage,
  initialMode = "sign_in",
  showDemoSection = false,
  demoLoginAvailable = false,
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingResetEmail, setPendingResetEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newResetPassword, setNewResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [passwordResetComplete, setPasswordResetComplete] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationFocusKey, setVerificationFocusKey] = useState(0);
  const [resetFocusKey, setResetFocusKey] = useState(0);

  useEffect(() => {
    clearSigningOutFlag();
    clearIdleTimeoutSignOutFlag();
    clearIdleTimeoutRuntimeFlags();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  function clearSensitiveCredentialState() {
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setResetCode("");
    setNewResetPassword("");
    setConfirmResetPassword("");
    setAgreedToTerms(false);
  }

  function clearCredentialFields() {
    clearSensitiveCredentialState();
  }

  function clearResetFormFields() {
    setResetCode("");
    setNewResetPassword("");
    setConfirmResetPassword("");
    setPasswordResetComplete(false);
  }

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleBackToSignIn() {
    setMode("sign_in");
    setPendingEmail("");
    setPendingResetEmail("");
    setVerificationCode("");
    setVerificationComplete(false);
    clearResetFormFields();
    setError("");
    setMessage("");
    setFieldErrors({});
    clearCredentialFields();
  }

  function enterVerificationMode(nextEmail: string) {
    setPendingEmail(nextEmail);
    setVerificationCode("");
    setVerificationComplete(false);
    setMode("verify_email");
    setError("");
    setMessage("");
    setFieldErrors({});
    setConfirmPassword("");
    setAgreedToTerms(false);
    setVerificationFocusKey((current) => current + 1);
  }

  function enterForgotPasswordMode() {
    setMode("forgot_password");
    setPendingResetEmail("");
    clearResetFormFields();
    setError("");
    setMessage("");
    setFieldErrors({});
  }

  function enterResetPasswordMode(nextEmail: string) {
    setPendingResetEmail(nextEmail);
    setResetCode("");
    setNewResetPassword("");
    setConfirmResetPassword("");
    setPasswordResetComplete(false);
    setMode("reset_password");
    setError("");
    setMessage(PASSWORD_RESET_REQUEST_SUCCESS);
    setFieldErrors({});
    setResetFocusKey((current) => current + 1);
  }

  function changeMode(nextMode: "sign_in" | "sign_up") {
    setMode(nextMode);
    setVerificationComplete(false);
    setError("");
    setMessage("");
    setFieldErrors({});
    clearCredentialFields();
  }

  function handleUseDifferentEmail() {
    handleBackToSignIn();
  }

  function handleContinueToSignIn() {
    setMode("sign_in");
    setEmail(pendingEmail);
    setPendingEmail("");
    setVerificationCode("");
    setVerificationComplete(false);
    setError("");
    setMessage("");
    setFieldErrors({});
    clearCredentialFields();
  }

  function handleContinueAfterPasswordReset() {
    setMode("sign_in");
    setEmail(pendingResetEmail);
    setPendingResetEmail("");
    clearResetFormFields();
    setError("");
    setMessage("");
    setFieldErrors({});
    clearCredentialFields();
  }

  async function completeVerifiedAuthentication(): Promise<boolean> {
    clearSensitiveCredentialState();
    navigateAfterAuthSuccess();
    return true;
  }

  async function attemptVerificationAutoLogin(): Promise<boolean> {
    if (!password) {
      return false;
    }

    const signInResult = await signInAction(pendingEmail, password);

    if ("authenticated" in signInResult && signInResult.authenticated) {
      await completeVerifiedAuthentication();
      return true;
    }

    return false;
  }

  function validateCredentialForm(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (mode === "sign_in" && !password) {
      nextErrors.password = "Enter your password.";
    }

    if (mode === "sign_up") {
      const passwordPolicyError = getPasswordPolicyErrorMessage(password);
      if (passwordPolicyError) {
        nextErrors.password = passwordPolicyError;
      }
    }

    if (mode === "sign_up" && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (mode === "sign_up" && !agreedToTerms) {
      nextErrors.legalAgreement = LEGAL_AGREEMENT_ERROR;
    }

    return nextErrors;
  }

  function validateForgotPasswordForm(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  }

  function validateResetPasswordForm(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!resetCode.trim()) {
      nextErrors.resetCode = "Enter the reset code from your email.";
    }

    const passwordPolicyError = getPasswordPolicyErrorMessage(newResetPassword);
    if (passwordPolicyError) {
      nextErrors.newPassword = passwordPolicyError;
    }

    if (newResetPassword !== confirmResetPassword) {
      nextErrors.confirmNewPassword = "Passwords do not match.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const nextFieldErrors = validateCredentialForm();
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result =
        mode === "sign_up"
          ? await signUpAction(email, password, agreedToTerms)
          : await signInAction(email, password);

      if ("error" in result) {
        if (result.requiresVerification && result.email) {
          enterVerificationMode(result.email);
          return;
        }

        setError(result.error);
        return;
      }

      if ("requiresVerification" in result && result.requiresVerification) {
        enterVerificationMode(result.email);
        return;
      }

      if ("authenticated" in result && result.authenticated) {
        clearSensitiveCredentialState();
        navigateAfterAuthSuccess();
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const nextFieldErrors = validateForgotPasswordForm();
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await requestPasswordResetAction(email);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      if ("passwordResetRequested" in result && result.passwordResetRequested) {
        enterResetPasswordMode(result.email);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send reset instructions. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const nextFieldErrors = validateResetPasswordForm();
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await resetPasswordAction(
        pendingResetEmail,
        resetCode,
        newResetPassword,
      );

      if ("error" in result) {
        setError(result.error);
        setResetFocusKey((current) => current + 1);
        return;
      }

      if ("passwordResetComplete" in result && result.passwordResetComplete) {
        setPasswordResetComplete(true);
        setMessage("Your password has been reset successfully.");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset your password. Try again.",
      );
      setResetFocusKey((current) => current + 1);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await verifyEmailAction(pendingEmail, verificationCode);

      if ("error" in result) {
        setError(result.error);
        setVerificationFocusKey((current) => current + 1);
        return;
      }

      if ("authenticated" in result && result.authenticated) {
        await completeVerifiedAuthentication();
        return;
      }

      if (await attemptVerificationAutoLogin()) {
        return;
      }

      clearSensitiveCredentialState();
      setVerificationComplete(true);
      setMessage("Your email has been verified successfully.");
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Verification failed. Try again.",
      );
      setVerificationFocusKey((current) => current + 1);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendVerificationCode() {
    if (isResending || resendCooldown > 0 || !pendingEmail) {
      return;
    }

    setError("");
    setIsResending(true);

    try {
      const result = await resendVerificationCodeAction(pendingEmail);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      showSuccessToast("A new verification code was sent.");
      setResendCooldown(VERIFICATION_RESEND_COOLDOWN_SECONDS);
      setVerificationFocusKey((current) => current + 1);
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "Unable to resend the verification code.",
      );
    } finally {
      setIsResending(false);
    }
  }

  async function handleResendResetCode() {
    if (isResending || resendCooldown > 0 || !pendingResetEmail) {
      return;
    }

    setError("");
    setIsResending(true);

    try {
      const result = await resendPasswordResetCodeAction(pendingResetEmail);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      showSuccessToast("A new reset code was sent.");
      setResendCooldown(VERIFICATION_RESEND_COOLDOWN_SECONDS);
      setResetFocusKey((current) => current + 1);
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "Unable to resend the reset code.",
      );
    } finally {
      setIsResending(false);
    }
  }

  async function handleDemoLogin() {
    if (!demoLoginAvailable || isDemoSubmitting || isSubmitting) {
      return;
    }

    setError("");
    setMessage("");
    setIsDemoSubmitting(true);

    try {
      const result = await demoLoginAction();

      if ("error" in result) {
        setError(result.error);
        return;
      }

      navigateAfterAuthSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Demo sign-in failed. Try again.",
      );
    } finally {
      setIsDemoSubmitting(false);
    }
  }

  const isBusy = isSubmitting || isDemoSubmitting || isResending;

  if (mode === "forgot_password") {
    return (
      <div className="w-full">
        <AuthCardIcon />

        <div className="text-center">
          <h1 className="text-[1.625rem] font-semibold leading-tight text-text-primary">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Enter the email associated with your DSJourney account and we&apos;ll
            send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
          <FormBanner error={error} />

          <div>
            <label
              htmlFor="auth-forgot-email"
              className="mb-1.5 block text-xs font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              id="auth-forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              className={emailInputClassName}
              placeholder="you@example.com"
              required
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <PrimaryButton disabled={isBusy} loading={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Instructions"}
          </PrimaryButton>

          <SecondaryButton onClick={handleBackToSignIn}>
            Back to Sign In
          </SecondaryButton>
        </form>
      </div>
    );
  }

  if (mode === "reset_password") {
    return (
      <div className="w-full">
        <AuthCardIcon />

        <div className="text-center">
          <h1 className="text-[1.625rem] font-semibold leading-tight text-text-primary">
            {passwordResetComplete ? "Password updated" : "Reset your password"}
          </h1>
          {!passwordResetComplete && (
            <>
              <p className="mt-2 text-sm text-text-muted">
                We sent a reset code to
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {pendingResetEmail}
              </p>
            </>
          )}
        </div>

        {passwordResetComplete ? (
          <div className="mt-6 space-y-4">
            <FormBanner message={message} />
            <button
              type="button"
              onClick={handleContinueAfterPasswordReset}
              className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-brand-teal px-4 text-sm font-semibold text-brand-navy transition-colors hover:bg-accent-hover"
            >
              Continue to Sign In
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <FormBanner error={error} message={message} />

            <div>
              <VerificationCodeInput
                key={resetFocusKey}
                value={resetCode}
                onChange={(value) => {
                  setResetCode(value);
                  clearFieldError("resetCode");
                }}
                disabled={isSubmitting}
                autoFocus
              />
              <FieldError message={fieldErrors.resetCode} />
            </div>

            <PasswordInput
              id="auth-reset-password"
              label="New Password"
              value={newResetPassword}
              onChange={(value) => {
                setNewResetPassword(value);
                clearFieldError("newPassword");
              }}
              autoComplete="new-password"
              error={fieldErrors.newPassword}
            />

            <div className="mt-2">
              <PasswordRequirements password={newResetPassword} />
            </div>

            <PasswordInput
              id="auth-reset-confirm-password"
              label="Confirm New Password"
              value={confirmResetPassword}
              onChange={(value) => {
                setConfirmResetPassword(value);
                clearFieldError("confirmNewPassword");
              }}
              autoComplete="new-password"
              error={fieldErrors.confirmNewPassword}
            />

            <PrimaryButton
              disabled={
                isBusy ||
                resetCode.trim().length === 0 ||
                !validatePassword(newResetPassword).valid ||
                newResetPassword !== confirmResetPassword
              }
              loading={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </PrimaryButton>

            <div className="space-y-2 text-center text-sm text-text-muted">
              <p>Didn&apos;t receive a code?</p>
              <button
                type="button"
                onClick={handleResendResetCode}
                disabled={isResending || resendCooldown > 0}
                className="focus-ring font-medium text-brand-teal transition-colors hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
              </button>
            </div>

            <SecondaryButton onClick={handleBackToSignIn}>
              Back to Sign In
            </SecondaryButton>
          </form>
        )}
      </div>
    );
  }

  if (mode === "verify_email") {
    return (
      <div className="w-full">
        <AuthCardIcon />

        <div className="text-center">
          <h1 className="text-[1.625rem] font-semibold leading-tight text-text-primary">
            {verificationComplete ? "Email verified" : "Verify your email"}
          </h1>
          {!verificationComplete && (
            <>
              <p className="mt-2 text-sm text-text-muted">
                We sent a verification code to
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {pendingEmail}
              </p>
            </>
          )}
        </div>

        {verificationComplete ? (
          <div className="mt-6 space-y-4">
            <FormBanner message={message} />
            <button
              type="button"
              onClick={handleContinueToSignIn}
              className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-brand-teal px-4 text-sm font-semibold text-brand-navy transition-colors hover:bg-accent-hover"
            >
              Continue to Sign In
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyEmail} className="mt-6 space-y-4">
            <VerificationCodeInput
              key={verificationFocusKey}
              value={verificationCode}
              onChange={setVerificationCode}
              disabled={isSubmitting}
              autoFocus
            />

            <FormBanner error={error} />

            <PrimaryButton
              disabled={isSubmitting || verificationCode.trim().length === 0}
              loading={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </PrimaryButton>

            <div className="space-y-2 text-center text-sm text-text-muted">
              <p>Didn&apos;t receive a code?</p>
              <button
                type="button"
                onClick={handleResendVerificationCode}
                disabled={isResending || resendCooldown > 0}
                className="focus-ring font-medium text-brand-teal transition-colors hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
              </button>
            </div>

            <SecondaryButton onClick={handleUseDifferentEmail}>
              Use a different email
            </SecondaryButton>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <AuthCardIcon />

      <div className="text-center">
        <h1 className="text-[1.625rem] font-semibold leading-tight text-text-primary">
          {mode === "sign_in" ? "Welcome back" : "Create an Account"}
        </h1>
        {mode === "sign_in" && (
          <p className="mt-2 text-sm text-text-muted">
            Continue your Data Science journey.
          </p>
        )}
        <p className="mt-2 text-sm text-text-muted">
          {mode === "sign_in" ? (
            <>
              New to DSJourney?{" "}
              <button
                type="button"
                onClick={() => changeMode("sign_up")}
                className="focus-ring font-medium text-brand-teal transition-colors hover:text-accent-hover"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => changeMode("sign_in")}
                className="focus-ring font-medium text-brand-teal transition-colors hover:text-accent-hover"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-6">
        <FormBanner error={error} message={message} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-xs font-medium text-text-secondary"
            >
              {mode === "sign_up" ? "Email Address" : "Email"}
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              className={emailInputClassName}
              placeholder="you@example.com"
              required
              aria-invalid={Boolean(fieldErrors.email)}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div>
            <PasswordInput
              id="auth-password"
              label="Password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                clearFieldError("password");
              }}
              autoComplete={
                mode === "sign_in" ? "current-password" : "new-password"
              }
              error={fieldErrors.password}
            />
            {mode === "sign_up" && (
              <div className="mt-2">
                <PasswordRequirements password={password} />
              </div>
            )}
            {mode === "sign_in" && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={enterForgotPasswordMode}
                  className="focus-ring text-xs font-medium text-brand-teal transition-colors hover:text-accent-hover"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {mode === "sign_up" && (
            <PasswordInput
              id="auth-confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                clearFieldError("confirmPassword");
              }}
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
            />
          )}

          {mode === "sign_up" && (
            <div>
              <label
                htmlFor="auth-legal-agreement"
                className="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary"
              >
                <input
                  id="auth-legal-agreement"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => {
                    setAgreedToTerms(event.target.checked);
                    clearFieldError("legalAgreement");
                  }}
                  className="focus-ring mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#11161D] text-brand-teal"
                  aria-invalid={Boolean(fieldErrors.legalAgreement)}
                />
                <span>
                  I agree to the{" "}
                  <LegalModalLinkButton
                    type="terms"
                    className="focus-ring font-medium text-brand-teal underline underline-offset-2 transition-colors hover:text-accent-hover"
                  >
                    Terms of Service
                  </LegalModalLinkButton>{" "}
                  and{" "}
                  <LegalModalLinkButton
                    type="privacy"
                    className="focus-ring font-medium text-brand-teal underline underline-offset-2 transition-colors hover:text-accent-hover"
                  >
                    Privacy Policy
                  </LegalModalLinkButton>
                  .
                </span>
              </label>
              <FieldError message={fieldErrors.legalAgreement} />
            </div>
          )}

          <div className="pt-1">
            <PrimaryButton
              disabled={
                isBusy ||
                (mode === "sign_up" &&
                  (!validatePassword(password).valid ||
                    password !== confirmPassword ||
                    !agreedToTerms))
              }
              loading={isSubmitting}
            >
              {isSubmitting
                ? mode === "sign_in"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "sign_in"
                  ? "Sign In"
                  : "Create Account"}
            </PrimaryButton>
          </div>
        </form>

        <AuthOrDivider />

        <GoogleSignInButton
          disabled={isBusy}
          label={
            mode === "sign_up" ? "Sign up with Google" : "Continue with Google"
          }
          onError={setError}
        />
      </div>

      {showDemoSection && mode === "sign_in" && (
        <div className="mt-5">
          <AuthSectionDivider label="Test Account" />

          {demoLoginAvailable ? (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isBusy}
              className="focus-ring w-full rounded-[9px] border border-white/10 bg-[#11161D] px-4 py-3 text-left transition-colors hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                {isDemoSubmitting && (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                )}
                Demo User
              </span>
              <span className="mt-0.5 block text-xs text-text-muted">
                Auto sign in for QA
              </span>
            </button>
          ) : (
            <p className="rounded-[9px] border border-white/10 bg-[#11161D] px-3 py-2 text-center text-sm text-text-muted">
              Test account unavailable
            </p>
          )}

          <p className="mt-3 text-center text-xs text-text-muted">
            Preview testing only
          </p>
        </div>
      )}
    </div>
  );
}
