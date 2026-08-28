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
import type { TransactionType } from "@/features/transactions/data/transactions.types";

const TYPE_LABELS: Record<TransactionType, string> = {
  expense: "Gasto",
  income: "Ingreso",
};

export interface TransactionFormValues {
  type: TransactionType;
  amountDigits: string;
  category: string;
  description: string;
  occurredAt: Date | undefined;
}

export function TransactionFormFields({
  idPrefix,
  values,
  onChange,
}: {
  idPrefix: string;
  values: TransactionFormValues;
  onChange: (values: TransactionFormValues) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>Tipo</Label>
        <Select
          value={values.type}
          onValueChange={(value) => onChange({ ...values, type: value as TransactionType })}
        >
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
        <Label htmlFor={`${idPrefix}-amount`}>Monto</Label>
        <Input
          id={`${idPrefix}-amount`}
          type="text"
          inputMode="numeric"
          required
          placeholder="0"
          value={formatAmountInput(values.amountDigits)}
          onChange={(event) => onChange({ ...values, amountDigits: digitsOnly(event.target.value) })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-category`}>Categoría (opcional)</Label>
        <Input
          id={`${idPrefix}-category`}
          value={values.category}
          onChange={(event) => onChange({ ...values, category: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-occurred-at`}>Fecha</Label>
        <DatePicker
          id={`${idPrefix}-occurred-at`}
          value={values.occurredAt}
          onChange={(date) => onChange({ ...values, occurredAt: date })}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-description`}>Descripción (opcional)</Label>
        <Input
          id={`${idPrefix}-description`}
          value={values.description}
          onChange={(event) => onChange({ ...values, description: event.target.value })}
        />
      </div>
    </>
  );
}
