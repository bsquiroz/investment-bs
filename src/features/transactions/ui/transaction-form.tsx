import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/common/date-picker";
import { digitsOnly, formatAmountInput } from "@/lib/format";
import type { NewTransactionInput, TransactionType } from "@/features/transactions/data/transactions.types";

const TYPE_LABELS: Record<TransactionType, string> = {
  expense: "Gasto",
  income: "Ingreso",
};

export function TransactionForm({
  onSubmit,
}: {
  onSubmit: (input: NewTransactionInput) => Promise<void>;
}) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amountDigits, setAmountDigits] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState<Date | undefined>(new Date());
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amountDigits);

    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("El monto debe ser mayor a cero");
      return;
    }

    if (!occurredAt) {
      toast.error("Selecciona una fecha");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: parsedAmount,
        category: category || undefined,
        description: description || undefined,
        occurredAt: format(occurredAt, "yyyy-MM-dd"),
      });
      toast.success("Transacción registrada");
      setAmountDigits("");
      setCategory("");
      setDescription("");
      setOccurredAt(new Date());
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
          <div className="flex flex-col gap-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
              <SelectTrigger className="w-full">
                <SelectValue>{(value: TransactionType) => TYPE_LABELS[value]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Gasto</SelectItem>
                <SelectItem value="income">Ingreso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              required
              placeholder="0"
              value={formatAmountInput(amountDigits)}
              onChange={(event) => setAmountDigits(digitsOnly(event.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Categoría (opcional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="occurred-at">Fecha</Label>
            <DatePicker id="occurred-at" value={occurredAt} onChange={setOccurredAt} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <Button type="submit" disabled={submitting} className="sm:col-span-2">
            {submitting ? "Guardando..." : "Registrar transacción"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
