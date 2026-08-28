import type { Transaction } from "@/features/transactions/data/transactions.types";

export interface TransactionsSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function computeSummary(items: Transaction[]): TransactionsSummary {
  const totalIncome = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}
