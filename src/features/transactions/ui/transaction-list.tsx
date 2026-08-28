import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currencyFormatter } from "@/lib/format";
import type { Transaction } from "@/features/transactions/data/transactions.types";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aún no hay transacciones registradas.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.occurredAt}</TableCell>
            <TableCell>
              <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                {transaction.type === "income" ? "Ingreso" : "Gasto"}
              </Badge>
            </TableCell>
            <TableCell>{transaction.category ?? "—"}</TableCell>
            <TableCell>{transaction.description ?? "—"}</TableCell>
            <TableCell className="text-right">
              {currencyFormatter.format(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
