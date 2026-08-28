import { describe, expect, it } from "vitest";
import { toInsertPayload, toTransaction, toUpdatePayload } from "@/features/transactions/data/transactions.mappers";
import type { Tables } from "@/lib/database.types";

describe("toTransaction", () => {
  it("maps a database row to the domain model, converting amount to a number", () => {
    const row: Tables<"transactions"> = {
      id: "tx-1",
      user_id: "user-1",
      type: "expense",
      amount: "125000" as unknown as number, // Postgres numeric comes back as a string
      category: "Comida",
      description: null,
      occurred_at: "2026-01-15",
      created_at: "2026-01-15T10:00:00.000Z",
    };

    expect(toTransaction(row)).toEqual({
      id: "tx-1",
      type: "expense",
      amount: 125000,
      category: "Comida",
      description: null,
      occurredAt: "2026-01-15",
      createdAt: "2026-01-15T10:00:00.000Z",
    });
  });
});

describe("toInsertPayload / toUpdatePayload", () => {
  it("normalizes empty optional strings to null", () => {
    const input = {
      type: "income" as const,
      amount: 5000,
      category: "",
      description: "",
      occurredAt: "2026-02-01",
    };

    expect(toInsertPayload(input, "user-1")).toEqual({
      user_id: "user-1",
      type: "income",
      amount: 5000,
      category: null,
      description: null,
      occurred_at: "2026-02-01",
    });

    expect(toUpdatePayload(input)).toEqual({
      type: "income",
      amount: 5000,
      category: null,
      description: null,
      occurred_at: "2026-02-01",
    });
  });

  it("keeps provided optional values", () => {
    const input = {
      type: "expense" as const,
      amount: 1000,
      category: "Transporte",
      description: "Taxi",
      occurredAt: "2026-02-02",
    };

    expect(toInsertPayload(input, "user-1").category).toBe("Transporte");
    expect(toInsertPayload(input, "user-1").description).toBe("Taxi");
  });
});
