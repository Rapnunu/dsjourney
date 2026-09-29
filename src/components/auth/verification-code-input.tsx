"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { authCodeCellClassName } from "@/components/auth/auth-form-styles";
import { VERIFICATION_CODE_LENGTH } from "@/lib/auth/constants";

interface VerificationCodeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  length?: number;
}

export function VerificationCodeInput({
  id = "verification-code",
  value,
  onChange,
  disabled = false,
  autoFocus = false,
  length = VERIFICATION_CODE_LENGTH,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusInput = useCallback((index: number) => {
    const target = inputRefs.current[index];
    target?.focus();
    target?.select();
  }, []);

  useEffect(() => {
    if (autoFocus) {
      focusInput(0);
    }
  }, [autoFocus, focusInput]);

  function updateDigit(index: number, nextDigit: string) {
    const sanitized = nextDigit.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitized;
    onChange(nextDigits.join("").slice(0, length));

    if (sanitized && index < length - 1) {
      focusInput(index + 1);
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        onChange(nextDigits.join(""));
        return;
      }

      if (index > 0) {
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) {
      return;
    }

    onChange(pasted);
    focusInput(Math.min(pasted.length, length - 1));
  }

  return (
    <div>
      <label htmlFor={`${id}-0`} className="sr-only">
        Verification code
      </label>
      <div
        className="flex justify-center gap-1.5 sm:gap-2"
        role="group"
        aria-label="Verification code"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            id={index === 0 ? `${id}-0` : undefined}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            className={authCodeCellClassName}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
          />
        ))}
      </div>
    </div>
  );
}
