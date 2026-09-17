"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import { dashboardCard } from "./styles";

interface MetricCardProps {
  label: string;
  value?: ReactNode;
  countTo?: number;
  decimals?: number;
  icon?: LucideIcon;
  suffix?: string;
  countSuffix?: string;
  trailing?: ReactNode;
  className?: string;
  valueClassName?: string;
  staggerIndex?: number;
}

export function MetricCard({
  label,
  value,
  countTo,
  decimals = 0,
  icon: Icon,
  suffix,
  countSuffix = "",
  trailing,
  className = "",
  valueClassName = "",
}: MetricCardProps) {
  const displayValue =
    countTo !== undefined ? (
      <CountUp
        to={countTo}
        decimals={decimals}
        suffix={countSuffix}
        duration={1}
        className={valueClassName}
      />
    ) : (
      value
    );

  return (
    <div className={`${dashboardCard} flex items-center gap-3 px-4 py-3.5 ${className}`}>
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated text-brand-teal">
          <Icon size={18} strokeWidth={1.75} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1">
          <p
            className={`text-2xl font-semibold tabular-nums leading-none text-text-primary ${valueClassName}`}
          >
            {displayValue}
          </p>
          {suffix && <span className="text-xs text-text-muted">{suffix}</span>}
        </div>
        <p className="mt-1 text-xs text-text-secondary">{label}</p>
      </div>
      {trailing && <div className="shrink-0 self-end">{trailing}</div>}
    </div>
  );
}
