import { describe, expect, it } from "vitest";
import { computeSummary } from "@/features/transactions/data/transactions.selectors";
import type { Transaction } from "@/features/transactions/data/transactions.types";

function makeTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: "tx-1",
    type: "expense",
    amount: 0,
    category: null,
    description: null,
    occurredAt: "2026-01-01",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computeSummary", () => {
  it("returns zeros for an empty list", () => {
    expect(computeSummary([])).toEqual({ totalIncome: 0, totalExpense: 0, balance: 0 });
  });

  it("sums income and expense separately and computes the balance", () => {
    const transactions = [
      makeTransaction({ type: "income", amount: 100000 }),
      makeTransaction({ type: "income", amount: 50000 }),
      makeTransaction({ type: "expense", amount: 30000 }),
    ];

    expect(computeSummary(transactions)).toEqual({
      totalIncome: 150000,
      totalExpense: 30000,
      balance: 120000,
    });
  });

  it("allows a negative balance when expenses exceed income", () => {
    const transactions = [
      makeTransaction({ type: "income", amount: 10000 }),
      makeTransaction({ type: "expense", amount: 40000 }),
    ];

    expect(computeSummary(transactions).balance).toBe(-30000);
  });
});
