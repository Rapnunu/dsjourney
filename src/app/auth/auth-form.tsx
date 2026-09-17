"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { demoLoginAction, signInAction, signUpAction } from "./actions";

type AuthMode = "sign_in" | "sign_up";

interface AuthFormProps {
  initialError?: string;
  initialMessage?: string;
  showDemoSection?: boolean;
  demoLoginAvailable?: boolean;
}

function navigateAfterAuthSuccess(): void {
  window.location.replace("/today");
}

export function AuthForm({
  initialError,
  initialMessage,
  showDemoSection = false,
  demoLoginAvailable = false,
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "sign_up" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        mode === "sign_up"
          ? await signUpAction(email, password)
          : await signInAction(email, password);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      navigateAfterAuthSuccess();
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

  const inputClasses =
    "w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors";

  return (
    <div className="w-full max-w-md rounded-2xl border border-border-primary bg-bg-surface/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-500">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary">DS Prep Tracker</h1>
        <p className="mt-1 text-sm text-text-muted">
          {mode === "sign_in" ? "Sign in to continue your preparation" : "Create your tracker account"}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-lg bg-bg-primary p-1">
        <button type="button" onClick={() => changeMode("sign_in")} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${mode === "sign_in" ? "bg-bg-surface-hover text-text-primary" : "text-text-muted hover:text-text-secondary"}`}>
          Sign In
        </button>
        <button type="button" onClick={() => changeMode("sign_up")} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${mode === "sign_up" ? "bg-bg-surface-hover text-text-primary" : "text-text-muted hover:text-text-secondary"}`}>
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
          <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClasses} placeholder="you@example.com" required />
        </div>
        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-xs font-medium text-text-secondary">Password</label>
          <input id="auth-password" type="password" autoComplete={mode === "sign_in" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className={inputClasses} required />
        </div>
        {mode === "sign_up" && (
          <div>
            <label htmlFor="auth-confirm-password" className="mb-1.5 block text-xs font-medium text-text-secondary">Confirm Password</label>
            <input id="auth-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClasses} required />
          </div>
        )}

        {error && <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
        {message && <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p>}

        <button type="submit" disabled={isSubmitting || isDemoSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover focus-ring disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {isSubmitting ? "Please wait..." : mode === "sign_in" ? "Sign In" : "Create Account"}
        </button>
      </form>

      {showDemoSection && mode === "sign_in" && (
        <div className="mt-5">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border-primary" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-bg-surface/80 px-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Test Account
              </span>
            </div>
          </div>

          {demoLoginAvailable ? (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoSubmitting || isSubmitting}
              className="w-full rounded-lg border border-border-primary bg-bg-primary px-4 py-3 text-left transition-colors hover:border-accent/40 hover:bg-bg-surface-hover focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Demo User</p>
                  <p className="mt-0.5 text-xs text-text-muted">Auto sign in for QA</p>
                </div>
                {isDemoSubmitting && (
                  <LoaderCircle size={16} className="shrink-0 animate-spin text-text-muted" />
                )}
              </div>
            </button>
          ) : (
            <p className="rounded-lg border border-border-primary bg-bg-primary px-4 py-3 text-center text-sm text-text-muted">
              Test account unavailable
            </p>
          )}

          <p className="mt-3 text-center text-[11px] text-text-muted">
            Preview testing only
          </p>
        </div>
      )}
    </div>
  );
}
