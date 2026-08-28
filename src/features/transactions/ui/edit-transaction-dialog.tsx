import { useState, type FormEvent, type ReactElement } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TransactionFormFields,
  type TransactionFormValues,
} from "@/features/transactions/ui/transaction-form-fields";
import type { NewTransactionInput, Transaction } from "@/features/transactions/data/transactions.types";

function toValues(transaction: Transaction): TransactionFormValues {
  return {
    type: transaction.type,
    amountDigits: String(transaction.amount),
    category: transaction.category ?? "",
    description: transaction.description ?? "",
    occurredAt: new Date(`${transaction.occurredAt}T00:00:00`),
  };
}

export function EditTransactionDialog({
  transaction,
  trigger,
  onSubmit,
}: {
  transaction: Transaction;
  trigger: ReactElement;
  onSubmit: (input: NewTransactionInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<TransactionFormValues>(() => toValues(transaction));
  const [submitting, setSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setValues(toValues(transaction));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(values.amountDigits);

    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("El monto debe ser mayor a cero");
      return;
    }

    if (!values.occurredAt) {
      toast.error("Selecciona una fecha");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        type: values.type,
        amount: parsedAmount,
        category: values.category || undefined,
        description: values.description || undefined,
        occurredAt: format(values.occurredAt, "yyyy-MM-dd"),
      });
      toast.success("Transacción actualizada");
      setOpen(false);
    } catch (err) {
      toast.error("No se pudo actualizar la transacción", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar transacción</DialogTitle>
        </DialogHeader>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <TransactionFormFields idPrefix={`edit-${transaction.id}`} values={values} onChange={setValues} />
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
