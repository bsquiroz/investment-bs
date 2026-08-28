import type { Tables, TablesInsert } from "@/lib/database.types";
import type { NewTransactionInput, Transaction } from "@/features/transactions/data/transactions.types";

export function toTransaction(row: Tables<"transactions">): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    category: row.category,
    description: row.description,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  };
}

export function toInsertPayload(
  input: NewTransactionInput,
  userId: string,
): TablesInsert<"transactions"> {
  return {
    user_id: userId,
    type: input.type,
    amount: input.amount,
    category: input.category || null,
    description: input.description || null,
    occurred_at: input.occurredAt,
  };
}
