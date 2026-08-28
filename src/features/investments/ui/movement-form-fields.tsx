import { DatePicker } from "@/components/common/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { digitsOnly, formatAmountInput } from "@/lib/format";
import type { MovementType } from "@/features/investments/data/investments.types";

const TYPE_LABELS: Record<MovementType, string> = {
  deposit: "Aporte",
  withdrawal: "Retiro",
};

export interface MovementFormValues {
  type: MovementType;
  amountCopDigits: string;
  amountUsdDigits: string;
  occurredAt: Date | undefined;
}

export function MovementFormFields({
  idPrefix,
  values,
  onChange,
}: {
  idPrefix: string;
  values: MovementFormValues;
  onChange: (values: MovementFormValues) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>Tipo</Label>
        <Select
          value={values.type}
          onValueChange={(value) => onChange({ ...values, type: value as MovementType })}
        >
          <SelectTrigger className="w-full">
            <SelectValue>{(value: MovementType) => TYPE_LABELS[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">Aporte</SelectItem>
            <SelectItem value="withdrawal">Retiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-amount-cop`}>Monto en COP</Label>
        <Input
          id={`${idPrefix}-amount-cop`}
          type="text"
          inputMode="numeric"
          required
          placeholder="0"
          value={formatAmountInput(values.amountCopDigits)}
          onChange={(event) =>
            onChange({ ...values, amountCopDigits: digitsOnly(event.target.value) })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-amount-usd`}>Monto en USD</Label>
        <Input
          id={`${idPrefix}-amount-usd`}
          type="text"
          inputMode="numeric"
          required
          placeholder="0"
          value={formatAmountInput(values.amountUsdDigits)}
          onChange={(event) =>
            onChange({ ...values, amountUsdDigits: digitsOnly(event.target.value) })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-date`}>Fecha</Label>
        <DatePicker
          id={`${idPrefix}-date`}
          value={values.occurredAt}
          onChange={(date) => onChange({ ...values, occurredAt: date })}
        />
      </div>
    </>
  );
}
