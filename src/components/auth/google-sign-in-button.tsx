"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { GoogleIcon } from "./google-icon";

interface GoogleSignInButtonProps {
  disabled?: boolean;
  label?: string;
  onError: (message: string) => void;
}

export function GoogleSignInButton({
  disabled = false,
  label = "Continue with Google",
  onError,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (disabled || isLoading) {
      return;
    }

    onError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/today",
        errorCallbackURL: "/auth?error=oauth_failed",
      });

      if (error) {
        onError("Google sign-in failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // OAuth redirect is handled by the provider / Neon Auth proxy.
    } catch {
      onError("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      aria-label={label}
      className="focus-ring flex h-11 w-full items-center justify-center gap-3 rounded-[9px] border border-white/10 bg-[#11161D] px-4 text-sm font-medium text-text-primary transition-colors hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        <GoogleIcon className="h-[18px] w-[18px] shrink-0" />
      )}
      {label}
    </button>
  );
}
