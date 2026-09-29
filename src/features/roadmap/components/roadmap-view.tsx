"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import { getMasteryDistribution } from "@/features/today/data";
import { roadmapCatalogData } from "../data";
import { useRoadmapStore } from "../roadmap-provider";
import { DashboardScrollReveal } from "@/components/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { handleRoadmapMutationResult } from "@/lib/api/mutation-result";
import { ProviderErrorBanner } from "@/components/ui/provider-error-banner";
import { Map } from "lucide-react";
import { CategoryCard } from "./category-card";
import type { MasteryLevel } from "../types";
import {
  MASTERY_CONFIG,
  MASTERY_WEIGHTS,
  MASTERY_REMAINING_FACTOR,
} from "../types";

const masteryOrder: MasteryLevel[] = [
  "not_started",
  "learning",
  "practiced",
  "mastered",
];

type MasteryFilter = "all" | MasteryLevel;

function RoadmapViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[10px] border border-border-subtle bg-bg-surface px-4 py-3"
          >
            <div className="mb-2 h-3 w-16 animate-pulse rounded bg-bg-elevated" />
            <div className="h-7 w-10 animate-pulse rounded bg-bg-elevated" />
          </div>
        ))}
      </div>
      <div className="h-9 max-w-md animate-pulse rounded-lg bg-bg-surface/60" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-[10px] border border-border-subtle bg-bg-surface/60"
          />
        ))}
      </div>
    </div>
  );
}

export function RoadmapView() {
  const {
    roadmap: categories,
    isHydrated,
    error,
    pendingTopicIds,
    reload,
    updateMastery,
  } = useRoadmapStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([roadmapCatalogData[0]?.id])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>("all");

  const toggleCategory = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleMasteryChange = useCallback(
    async (topicId: string, level: MasteryLevel) => {
      const result = await updateMastery(topicId, level);
      handleRoadmapMutationResult(result);
    },
    [updateMastery],
  );

  // Filter categories/topics by search + mastery filter
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return categories
      .map((cat) => {
        let topics = cat.topics;

        // Apply mastery filter
        if (masteryFilter !== "all") {
          topics = topics.filter((t) => t.mastery === masteryFilter);
        }

        // Apply search filter
        if (query) {
          topics = topics.filter(
            (t) =>
              t.name.toLowerCase().includes(query) ||
              cat.name.toLowerCase().includes(query)
          );
        }

        return { ...cat, topics };
      })
      .filter((cat) => cat.topics.length > 0);
  }, [categories, searchQuery, masteryFilter]);

  // Compute overall stats from the FULL dataset (not filtered)
  const overallStats = useMemo(() => {
    const allTopics = categories.flatMap((c) => c.topics);
    const total = allTopics.length;

    const distribution = getMasteryDistribution(categories);
    const counts = Object.fromEntries(
      distribution.map((segment) => [segment.level, segment.count]),
    ) as Record<MasteryLevel, number>;

    const readiness =
      total > 0
        ? Math.round(
            (allTopics.reduce(
              (sum, t) => sum + MASTERY_WEIGHTS[t.mastery],
              0
            ) /
              total) *
              100
          )
        : 0;

    const totalHours = allTopics.reduce((sum, t) => sum + t.estimatedHours, 0);

    const remainingHours = parseFloat(
      allTopics
        .reduce(
          (sum, t) =>
            sum + t.estimatedHours * MASTERY_REMAINING_FACTOR[t.mastery],
          0
        )
        .toFixed(1)
    );

    return { total, counts, readiness, totalHours, remainingHours };
  }, [categories]);

  const isFiltering = searchQuery.trim() !== "" || masteryFilter !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roadmap"
        subtitle="Track mastery across your Data Science learning path."
        icon={<Map size={22} />}
      />

      {!isHydrated ? (
        <RoadmapViewSkeleton />
      ) : (
        <>
      {error && (
        <ProviderErrorBanner
          title={error.title}
          description={error.description}
          onRetry={() => void reload()}
        />
      )}
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {masteryOrder.map((level) => {
          const config = MASTERY_CONFIG[level];
          return (
            <div
              key={level}
              className="rounded-[10px] border border-border-subtle bg-bg-surface px-4 py-3"
            >
              <p className="mb-1 text-xs font-medium text-text-secondary">{config.label}</p>
              <p
                className={`text-2xl font-semibold tabular-nums ${config.activeColor}`}
              >
                <CountUp to={overallStats.counts[level]} duration={0.9} />
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                of {overallStats.total} topics
              </p>
            </div>
          );
        })}

        <div className="rounded-[10px] border border-border-subtle bg-bg-surface px-4 py-3">
          <p className="mb-1 text-xs font-medium text-text-secondary">Readiness</p>
          <p className="text-2xl font-semibold tabular-nums text-brand-teal">
            <CountUp to={overallStats.readiness} suffix="%" duration={1} />
          </p>
          <p className="mt-0.5 text-xs text-text-muted">overall</p>
        </div>

        <div className="rounded-[10px] border border-border-subtle bg-bg-surface px-4 py-3">
          <p className="mb-1 text-xs font-medium text-text-secondary">Remaining</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-semibold tabular-nums text-text-primary">
              <CountUp to={overallStats.remainingHours} decimals={1} duration={1} />
            </p>
            <span className="text-sm text-text-muted">hrs</span>
          </div>
          <p className="mt-0.5 text-xs text-text-muted">
            of {overallStats.totalHours}h total
          </p>
        </div>
      </div>

      {/* Search + Mastery filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search topics"
            placeholder="Search topics..."
            className="h-9 w-full rounded-lg border border-border-strong bg-bg-input pl-9 pr-9 text-sm text-text-primary
              placeholder:text-text-muted
              focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal
              transition-colors duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="focus-ring absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted transition-colors hover:text-text-primary"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mastery filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <FilterPill
            label="All"
            isActive={masteryFilter === "all"}
            onClick={() => setMasteryFilter("all")}
            count={overallStats.total}
          />
          {masteryOrder.map((level) => {
            const config = MASTERY_CONFIG[level];
            return (
              <FilterPill
                key={level}
                label={config.label}
                isActive={masteryFilter === level}
                onClick={() =>
                  setMasteryFilter(masteryFilter === level ? "all" : level)
                }
                count={overallStats.counts[level]}
                activeColor={config.activeColor}
                activeBg={config.activeBg}
              />
            );
          })}
        </div>
      </div>

      {/* Category cards */}
      <div className="space-y-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <DashboardScrollReveal key={category.id} delayMs={index * 40}>
              <CategoryCard
                category={category}
                isExpanded={expandedIds.has(category.id)}
                onToggle={() => toggleCategory(category.id)}
                onMasteryChange={handleMasteryChange}
                pendingTopicIds={pendingTopicIds}
              />
            </DashboardScrollReveal>
          ))
        ) : (
          <div className="rounded-[10px] border border-dashed border-border-primary bg-bg-surface/50 p-12 text-center">
            <p className="text-text-muted text-sm">
              {isFiltering
                ? "No topics match your search or filter"
                : "No topics added to your roadmap yet"}
            </p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

/* ──── Filter Pill ──── */

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
  activeColor?: string;
  activeBg?: string;
}

function FilterPill({
  label,
  isActive,
  onClick,
  count,
  activeColor,
  activeBg,
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-150 whitespace-nowrap cursor-pointer
        focus-ring
        ${
          isActive
            ? activeColor && activeBg
              ? `border-transparent ${activeBg} ${activeColor} ring-1 ring-current/25`
              : "border-transparent bg-accent-muted text-brand-teal ring-1 ring-brand-teal/30"
            : "border border-border-strong bg-bg-elevated text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
        }
      `}
    >
      {label}
      <span
        className={`tabular-nums ${
          isActive ? "opacity-90" : "text-text-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
