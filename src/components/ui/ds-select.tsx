"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
  indicator?: ReactNode;
}

interface DsSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  "aria-label"?: string;
}

export function DsSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled = false,
  error = false,
  "aria-label": ariaLabel,
}: DsSelectProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-bg-input px-3 text-sm text-text-primary transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-danger focus:border-danger focus:ring-danger/40"
            : "border-border-strong focus:border-brand-teal focus:ring-brand-teal"
        }`}
      >
        <Select.Value placeholder={placeholder}>
          {selected && (
            <span className="inline-flex items-center gap-2 truncate">
              {selected.indicator}
              <span className="truncate">{selected.label}</span>
            </span>
          )}
        </Select.Value>
        <Select.Icon>
          <ChevronDown size={16} className="shrink-0 text-text-muted" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[100] max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[10px] border border-border-subtle bg-bg-surface shadow-sm"
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none data-[highlighted]:bg-bg-elevated data-[state=checked]:bg-brand-teal/10"
              >
                <Select.ItemIndicator className="absolute right-3 inline-flex items-center text-brand-teal">
                  <Check size={14} />
                </Select.ItemIndicator>
                {option.indicator}
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
