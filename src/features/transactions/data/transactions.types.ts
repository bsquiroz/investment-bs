import type { Enums } from "@/lib/database.types";

export type TransactionType = Enums<"transaction_type">;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string | null;
  description: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface NewTransactionInput {
  type: TransactionType;
  amount: number;
  category?: string;
  description?: string;
  occurredAt: string;
}
