import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { ScrollableTable } from "@/components/common/scrollable-table";
import { currencyFormatter } from "@/lib/format";
import { EditTransactionDialog } from "@/features/transactions/ui/edit-transaction-dialog";
import type { NewTransactionInput, Transaction } from "@/features/transactions/data/transactions.types";

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (id: string, input: NewTransactionInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aún no hay transacciones registradas.
      </p>
    );
  }

  return (
    <ScrollableTable>
      <Table>
        <TableHeader>
          <TableRow className="sticky top-0 z-10 bg-background">
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="w-0" />
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
              <TableCell>
                <div className="flex items-center gap-1">
                  <EditTransactionDialog
                    transaction={transaction}
                    onSubmit={(input) => onEdit(transaction.id, input)}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Editar">
                        <Pencil />
                      </Button>
                    }
                  />
                  <ConfirmDeleteDialog
                    title="¿Eliminar esta transacción?"
                    description="Esta acción no se puede deshacer."
                    onConfirm={() => onDelete(transaction.id)}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Eliminar">
                        <Trash2 />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollableTable>
  );
}
