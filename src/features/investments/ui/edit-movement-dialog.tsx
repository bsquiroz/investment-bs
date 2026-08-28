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
import type { Movement, NewMovementInput } from "@/features/investments/data/investments.types";

function toValues(movement: Movement): MovementFormValues {
  return {
    type: movement.type,
    amountCopDigits: String(movement.amountCop),
    amountUsdDigits: String(movement.amountUsd),
    occurredAt: new Date(`${movement.occurredAt}T00:00:00`),
  };
}

export function EditMovementDialog({
  movement,
  trigger,
  onSubmit,
}: {
  movement: Movement;
  trigger: ReactElement;
  onSubmit: (input: NewMovementInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<MovementFormValues>(() => toValues(movement));
  const [submitting, setSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setValues(toValues(movement));
  }

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
        platformId: movement.platformId,
        type: values.type,
        amountCop,
        amountUsd,
        occurredAt: format(values.occurredAt, "yyyy-MM-dd"),
      });
      toast.success("Movimiento actualizado");
      setOpen(false);
    } catch (err) {
      toast.error("No se pudo actualizar el movimiento", {
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
          <DialogTitle>Editar movimiento</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <MovementFormFields idPrefix={`edit-${movement.id}`} values={values} onChange={setValues} />
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
