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
  MovementFormFields,
  type MovementFormValues,
} from "@/features/investments/ui/movement-form-fields";
import type { NewMovementInput } from "@/features/investments/data/investments.types";

const EMPTY_VALUES: MovementFormValues = {
  type: "deposit",
  amountCopDigits: "",
  amountUsdDigits: "",
  occurredAt: new Date(),
};

export function NewMovementDialog({
  platformId,
  trigger,
  onSubmit,
}: {
  platformId: string;
  trigger: ReactElement;
  onSubmit: (input: NewMovementInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<MovementFormValues>(EMPTY_VALUES);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amountCop = Number(values.amountCopDigits);
    const amountUsd = Number(values.amountUsdDigits);

    if (!amountCop || amountCop <= 0 || !amountUsd || amountUsd <= 0) {
      toast.error("Los montos en COP y USD deben ser mayores a cero");
      return;
    }

    if (!values.occurredAt) {
      toast.error("Selecciona una fecha");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        platformId,
        type: values.type,
        amountCop,
        amountUsd,
        occurredAt: format(values.occurredAt, "yyyy-MM-dd"),
      });
      setValues({ ...EMPTY_VALUES, occurredAt: new Date() });
      setOpen(false);
    } catch (err) {
      toast.error("No se pudo registrar el movimiento", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo movimiento</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <MovementFormFields idPrefix="create" values={values} onChange={setValues} />
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Registrar movimiento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
