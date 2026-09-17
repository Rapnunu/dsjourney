/** DSJourney chart palette — solid colors, no gradients. */

export const CHART_COLORS = {
  teal: "#18B8C6",
  blue: "#3578E5",
  mutedBlue: "#55789C",
  neutral: "#334155",
  success: "#25B782",
  warning: "#E1A72D",
  mutedGray: "#667586",
  grid: "rgba(255,255,255,0.05)",
  axis: "#667586",
  tooltipBg: "#141D28",
  tooltipBorder: "rgba(255,255,255,0.10)",
  tooltipText: "#F4F7FA",
  tooltipSecondary: "#98A6B8",
  track: "rgba(255,255,255,0.08)",
} as const;

export const MASTERY_CHART_COLORS: Record<string, string> = {
  not_started: CHART_COLORS.mutedGray,
  learning: CHART_COLORS.warning,
  practiced: CHART_COLORS.blue,
  mastered: CHART_COLORS.success,
};

export const CATEGORY_BAR_COLORS = [
  CHART_COLORS.teal,
  CHART_COLORS.blue,
  CHART_COLORS.mutedBlue,
  `${CHART_COLORS.teal}B3`,
  `${CHART_COLORS.blue}B3`,
] as const;
