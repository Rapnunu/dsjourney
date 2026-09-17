"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { clearSigningOutFlag } from "@/lib/api/auth-expiry";
import { demoLoginAction, signInAction, signUpAction } from "./actions";

type AuthMode = "sign_in" | "sign_up";

interface AuthFormProps {
  initialError?: string;
  initialMessage?: string;
  initialMode?: AuthMode;
  showDemoSection?: boolean;
  demoLoginAvailable?: boolean;
}

function navigateAfterAuthSuccess(): void {
  window.location.replace("/today");
}

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-colors";

export function AuthForm({
  initialError,
  initialMessage,
  initialMode = "sign_in",
  showDemoSection = false,
  demoLoginAvailable = false,
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  useEffect(() => {
    clearSigningOutFlag();
  }, []);

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

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-white">
          {mode === "sign_in" ? "Welcome back" : "Start your journey"}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {mode === "sign_in"
            ? "Continue your Data Science journey."
            : "Build your path toward becoming a Data Scientist."}
        </p>
      </div>

      <div
        className="mb-5 grid grid-cols-2 rounded-lg bg-black/30 p-1"
        role="tablist"
        aria-label="Authentication mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign_in"}
          onClick={() => changeMode("sign_in")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "sign_in"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sign_up"}
          onClick={() => changeMode("sign_up")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "sign_up"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="auth-email"
            className="mb-1.5 block text-xs font-medium text-white/70"
          >
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClassName}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-xs font-medium text-white/70"
          >
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={
              mode === "sign_in" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            required
          />
        </div>

        {mode === "sign_up" && (
          <div>
            <label
              htmlFor="auth-confirm-password"
              className="mb-1.5 block text-xs font-medium text-white/70"
            >
              Confirm Password
            </label>
            <input
              id="auth-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClassName}
              required
            />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isDemoSubmitting}
          className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-teal to-brand-cyan px-4 py-2.5 text-sm font-semibold text-brand-navy hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight size={16} aria-hidden="true" />
          )}
          {isSubmitting
            ? "Please wait..."
            : mode === "sign_in"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      {showDemoSection && mode === "sign_in" && (
        <div className="mt-5">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/10" />
            </div>
            <p className="relative mx-auto w-fit bg-transparent px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Test Account
            </p>
          </div>

          {demoLoginAvailable ? (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoSubmitting || isSubmitting}
              className="focus-ring w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                {isDemoSubmitting && (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                )}
                Demo User
              </span>
              <span className="mt-0.5 block text-xs text-white/50">
                Auto sign in for QA
              </span>
            </button>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-sm text-white/50">
              Test account unavailable
            </p>
          )}

          <p className="mt-3 text-center text-xs text-white/40">
            Preview testing only
          </p>
        </div>
      )}
    </div>
  );
}
