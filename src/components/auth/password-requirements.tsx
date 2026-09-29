"use client";

import { Check, Circle } from "lucide-react";
import {
  PASSWORD_REQUIREMENT_ITEMS,
  validatePassword,
} from "@/lib/auth/password-policy";

interface PasswordRequirementsProps {
  password: string;
  id?: string;
}

export function PasswordRequirements({
  password,
  id = "password-requirements",
}: PasswordRequirementsProps) {
  const state = validatePassword(password);

  return (
    <div
      id={id}
      className="rounded-[9px] border border-white/10 bg-[#11161D]/60 px-3 py-2.5"
      aria-live="polite"
    >
      <p className="mb-2 text-xs font-medium text-text-secondary">
        Password must contain:
      </p>
      <ul className="space-y-1">
        {PASSWORD_REQUIREMENT_ITEMS.map((item) => {
          const met = item.isMet(state);

          return (
            <li key={item.key} className="flex items-center gap-2 text-xs">
              {met ? (
                <Check
                  size={12}
                  className="shrink-0 text-success"
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  size={12}
                  className="shrink-0 text-text-muted"
                  aria-hidden="true"
                />
              )}
              <span className={met ? "text-success" : "text-text-muted"}>
                {met ? `${item.label} — met` : item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
