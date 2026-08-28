import { useCallback, useEffect, useState } from "react";
import { createTransaction, listTransactions } from "@/features/transactions/api/transactions.api";
import { toInsertPayload, toTransaction } from "@/features/transactions/data/transactions.mappers";
import type { NewTransactionInput, Transaction } from "@/features/transactions/data/transactions.types";
import { useSession } from "@/features/auth/ui/hooks/use-session";

export function useTransactions() {
  const { user } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listTransactions();
      setTransactions(rows.map(toTransaction));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las transacciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(
    async (input: NewTransactionInput) => {
      if (!user) throw new Error("No hay sesión activa");
      const row = await createTransaction(toInsertPayload(input, user.id));
      setTransactions((prev) => [toTransaction(row), ...prev]);
    },
    [user],
  );

  return { transactions, loading, error, addTransaction };
}
