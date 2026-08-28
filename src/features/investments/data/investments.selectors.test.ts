import { describe, expect, it } from "vitest";
import {
  computeOverallTotals,
  computePlatformPercentage,
  computePlatformTotals,
  computeYearsInvested,
} from "@/features/investments/data/investments.selectors";
import type { Movement } from "@/features/investments/data/investments.types";

function makeMovement(overrides: Partial<Movement>): Movement {
  return {
    id: "mov-1",
    platformId: "plat-1",
    type: "deposit",
    amountCop: 0,
    amountUsd: 0,
    occurredAt: "2026-01-01",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computePlatformTotals", () => {
  it("returns zeros with no movements", () => {
    expect(computePlatformTotals([])).toEqual({ totalCop: 0, totalUsd: 0 });
  });

  it("adds deposits and subtracts withdrawals independently in COP and USD", () => {
    const movements = [
      makeMovement({ type: "deposit", amountCop: 1_000_000, amountUsd: 250 }),
      makeMovement({ type: "deposit", amountCop: 500_000, amountUsd: 125 }),
      makeMovement({ type: "withdrawal", amountCop: 200_000, amountUsd: 50 }),
    ];

    expect(computePlatformTotals(movements)).toEqual({ totalCop: 1_300_000, totalUsd: 325 });
  });
});

describe("computeYearsInvested", () => {
  it("returns 0 with no movements", () => {
    expect(computeYearsInvested([])).toBe(0);
  });

  it("computes whole years since the earliest movement, ignoring order", () => {
    const threeYearsAndADayAgo = new Date();
    threeYearsAndADayAgo.setFullYear(threeYearsAndADayAgo.getFullYear() - 3);
    threeYearsAndADayAgo.setDate(threeYearsAndADayAgo.getDate() - 1);

    const movements = [
      makeMovement({ occurredAt: "2026-06-01" }),
      makeMovement({ occurredAt: threeYearsAndADayAgo.toISOString().slice(0, 10) }),
      makeMovement({ occurredAt: "2026-01-01" }),
    ];

    expect(computeYearsInvested(movements)).toBe(3);
  });
});

describe("computePlatformPercentage", () => {
  it("returns 0 when the overall total is 0 (avoids dividing by zero)", () => {
    expect(computePlatformPercentage(500, 0)).toBe(0);
  });

  it("computes the share of the platform over the overall total", () => {
    expect(computePlatformPercentage(250, 1000)).toBe(25);
  });
});

describe("computeOverallTotals", () => {
  it("sums totals across platforms", () => {
    const totals = computeOverallTotals([
      { totalCop: 1000, totalUsd: 10 },
      { totalCop: 2000, totalUsd: 20 },
    ]);

    expect(totals).toEqual({ totalCop: 3000, totalUsd: 30 });
  });
});
