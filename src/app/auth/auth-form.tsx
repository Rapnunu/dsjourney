"use client";

import { useState, type FormEvent } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { signInAction, signUpAction } from "./actions";

type AuthMode = "sign_in" | "sign_up";

interface AuthFormProps {
  initialError?: string;
  initialMessage?: string;
}

export function AuthForm({ initialError, initialMessage }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (result?.error) {
        setError(result.error);
      }
    } catch (submitError) {
      if (isRedirectError(submitError)) {
        throw submitError;
      }

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
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

        <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover focus-ring disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {isSubmitting ? "Please wait..." : mode === "sign_in" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
