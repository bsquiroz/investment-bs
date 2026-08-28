export const PLATFORM_COLORS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const;

export type PlatformColor = (typeof PLATFORM_COLORS)[number];

export const PLATFORM_COLOR_CLASSES: Record<PlatformColor, { text: string; bg: string }> = {
  "chart-1": { text: "text-chart-1", bg: "bg-chart-1" },
  "chart-2": { text: "text-chart-2", bg: "bg-chart-2" },
  "chart-3": { text: "text-chart-3", bg: "bg-chart-3" },
  "chart-4": { text: "text-chart-4", bg: "bg-chart-4" },
  "chart-5": { text: "text-chart-5", bg: "bg-chart-5" },
};

export function nextPlatformColor(existingCount: number): PlatformColor {
  return PLATFORM_COLORS[existingCount % PLATFORM_COLORS.length];
}
