import { computeSummary } from "@/features/transactions/data/transactions.selectors";
import { useTransactions } from "@/features/transactions/ui/hooks/use-transactions";
import { SummaryCards } from "@/features/transactions/ui/summary-cards";
import { TransactionForm } from "@/features/transactions/ui/transaction-form";
import { TransactionList } from "@/features/transactions/ui/transaction-list";

export function DashboardPage() {
  const { transactions, loading, error, addTransaction, editTransaction, removeTransaction } =
    useTransactions();

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards summary={computeSummary(transactions)} />
      <TransactionForm onSubmit={addTransaction} />
      <TransactionList
        transactions={transactions}
        onEdit={editTransaction}
        onDelete={removeTransaction}
      />
    </div>
  );
}
