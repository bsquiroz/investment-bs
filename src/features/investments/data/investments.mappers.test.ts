import { describe, expect, it } from "vitest";
import {
  toInsertMovementPayload,
  toInsertPlatformPayload,
  toMovement,
  toPlatform,
  toUpdateMovementPayload,
  toUpdatePlatformPayload,
} from "@/features/investments/data/investments.mappers";
import type { Tables } from "@/lib/database.types";

describe("toPlatform / toMovement", () => {
  it("maps a platform row to the domain model", () => {
    const row: Tables<"investment_platforms"> = {
      id: "plat-1",
      user_id: "user-1",
      name: "Binance",
      color: "chart-2",
      created_at: "2026-01-01T00:00:00.000Z",
    };

    expect(toPlatform(row)).toEqual({
      id: "plat-1",
      name: "Binance",
      color: "chart-2",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("maps a movement row to the domain model, converting amounts to numbers", () => {
    const row: Tables<"investment_movements"> = {
      id: "mov-1",
      user_id: "user-1",
      platform_id: "plat-1",
      type: "withdrawal",
      amount_cop: "1000000" as unknown as number,
      amount_usd: "250" as unknown as number,
      occurred_at: "2026-03-01",
      created_at: "2026-03-01T00:00:00.000Z",
    };

    expect(toMovement(row)).toEqual({
      id: "mov-1",
      platformId: "plat-1",
      type: "withdrawal",
      amountCop: 1_000_000,
      amountUsd: 250,
      occurredAt: "2026-03-01",
      createdAt: "2026-03-01T00:00:00.000Z",
    });
  });
});

describe("toInsertPlatformPayload", () => {
  it("assigns the color based on how many platforms already exist", () => {
    expect(toInsertPlatformPayload({ name: "IBKR" }, "user-1", 0)).toEqual({
      user_id: "user-1",
      name: "IBKR",
      color: "chart-1",
    });

    expect(toInsertPlatformPayload({ name: "Binance" }, "user-1", 1)).toEqual({
      user_id: "user-1",
      name: "Binance",
      color: "chart-2",
    });
  });
});

describe("toUpdatePlatformPayload", () => {
  it("only updates the name", () => {
    expect(toUpdatePlatformPayload({ name: "Nuevo nombre" })).toEqual({ name: "Nuevo nombre" });
  });
});

describe("toInsertMovementPayload / toUpdateMovementPayload", () => {
  const input = {
    platformId: "plat-1",
    type: "deposit" as const,
    amountCop: 2_000_000,
    amountUsd: 500,
    occurredAt: "2026-04-01",
  };

  it("builds the insert payload with the owning user", () => {
    expect(toInsertMovementPayload(input, "user-1")).toEqual({
      user_id: "user-1",
      platform_id: "plat-1",
      type: "deposit",
      amount_cop: 2_000_000,
      amount_usd: 500,
      occurred_at: "2026-04-01",
    });
  });

  it("builds the update payload without platform/user fields", () => {
    expect(toUpdateMovementPayload(input)).toEqual({
      type: "deposit",
      amount_cop: 2_000_000,
      amount_usd: 500,
      occurred_at: "2026-04-01",
    });
  });
});
