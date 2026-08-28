import { differenceInYears } from "date-fns";
import type { Movement, PlatformTotals } from "@/features/investments/data/investments.types";

export function computePlatformTotals(movements: Movement[]): PlatformTotals {
  return movements.reduce<PlatformTotals>(
    (totals, movement) => {
      const sign = movement.type === "deposit" ? 1 : -1;
      return {
        totalCop: totals.totalCop + sign * movement.amountCop,
        totalUsd: totals.totalUsd + sign * movement.amountUsd,
      };
    },
    { totalCop: 0, totalUsd: 0 },
  );
}

export function computeYearsInvested(movements: Movement[]): number {
  if (movements.length === 0) return 0;

  const earliest = movements.reduce(
    (min, movement) => (movement.occurredAt < min ? movement.occurredAt : min),
    movements[0].occurredAt,
  );

  return Math.max(0, differenceInYears(new Date(), new Date(earliest)));
}

export function computePlatformPercentage(platformTotalCop: number, overallTotalCop: number): number {
  if (overallTotalCop === 0) return 0;
  return (platformTotalCop / overallTotalCop) * 100;
}

export function computeOverallTotals(platformTotals: PlatformTotals[]): PlatformTotals {
  return platformTotals.reduce<PlatformTotals>(
    (totals, platformTotal) => ({
      totalCop: totals.totalCop + platformTotal.totalCop,
      totalUsd: totals.totalUsd + platformTotal.totalUsd,
    }),
    { totalCop: 0, totalUsd: 0 },
  );
}
