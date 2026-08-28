import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TransactionFormFields,
  type TransactionFormValues,
} from "@/features/transactions/ui/transaction-form-fields";
import type { NewTransactionInput } from "@/features/transactions/data/transactions.types";

const EMPTY_VALUES: TransactionFormValues = {
  type: "expense",
  amountDigits: "",
  category: "",
  description: "",
  occurredAt: new Date(),
};

export function TransactionForm({
  onSubmit,
}: {
  onSubmit: (input: NewTransactionInput) => Promise<void>;
}) {
  const [values, setValues] = useState<TransactionFormValues>(EMPTY_VALUES);
  const [submitting, setSubmitting] = useState(false);

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
      toast.success("Transacción registrada");
      setValues({ ...EMPTY_VALUES, occurredAt: new Date() });
    } catch (err) {
      toast.error("No se pudo registrar la transacción", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <TransactionFormFields idPrefix="create" values={values} onChange={setValues} />
          <Button type="submit" disabled={submitting} className="sm:col-span-2">
            {submitting ? "Guardando..." : "Registrar transacción"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
