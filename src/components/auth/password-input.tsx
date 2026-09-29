"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInputClassName } from "@/components/auth/auth-form-styles";
import { FieldError } from "@/components/ui/field-error";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
  placeholder?: string;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  placeholder = "",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${authInputClassName} pr-10`}
          placeholder={placeholder}
          readOnly
          onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
          required
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-muted transition-colors hover:text-text-secondary"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      </div>
      <FieldError message={error} />
    </div>
  );
}
