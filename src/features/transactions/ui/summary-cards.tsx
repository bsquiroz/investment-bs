import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatter } from "@/lib/format";
import type { TransactionsSummary } from "@/features/transactions/data/transactions.selectors";

export function SummaryCards({ summary }: { summary: TransactionsSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Ingresos</CardDescription>
          <CardTitle className="text-2xl text-chart-1">
            {currencyFormatter.format(summary.totalIncome)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Gastos</CardDescription>
          <CardTitle className="text-2xl text-destructive">
            {currencyFormatter.format(summary.totalExpense)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-2xl">{currencyFormatter.format(summary.balance)}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
