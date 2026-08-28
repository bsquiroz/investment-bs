import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { PLATFORM_COLOR_CLASSES, type PlatformColor } from "@/features/investments/data/investments.constants";
import type {
  NewMovementInput,
  NewPlatformInput,
  PlatformSummary,
} from "@/features/investments/data/investments.types";
import { EditMovementDialog } from "@/features/investments/ui/edit-movement-dialog";
import { NewMovementDialog } from "@/features/investments/ui/new-movement-dialog";
import { PlatformDialog } from "@/features/investments/ui/platform-dialog";

const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const percentFormatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });

export function PlatformCard({
  summary,
  onAddMovement,
  onEditMovement,
  onDeleteMovement,
  onEditPlatform,
  onDeletePlatform,
}: {
  summary: PlatformSummary;
  onAddMovement: (input: NewMovementInput) => Promise<void>;
  onEditMovement: (id: string, input: NewMovementInput) => Promise<void>;
  onDeleteMovement: (id: string) => Promise<void>;
  onEditPlatform: (id: string, input: NewPlatformInput) => Promise<void>;
  onDeletePlatform: (id: string) => Promise<void>;
}) {
  const colorClasses = PLATFORM_COLOR_CLASSES[summary.platform.color as PlatformColor];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", colorClasses?.bg)} />
            <CardTitle>{summary.platform.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <span className={cn("text-sm font-medium", colorClasses?.text)}>
              {percentFormatter.format(summary.percentage)}%
            </span>
            <PlatformDialog
              title="Editar plataforma"
              submitLabel="Guardar cambios"
              initialName={summary.platform.name}
              onSubmit={(input) => onEditPlatform(summary.platform.id, input)}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Editar plataforma">
                  <Pencil />
                </Button>
              }
            />
            <ConfirmDeleteDialog
              title={`¿Eliminar ${summary.platform.name}?`}
              description="Se eliminarán también todos los movimientos registrados en esta plataforma. Esta acción no se puede deshacer."
              onConfirm={() => onDeletePlatform(summary.platform.id)}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Eliminar plataforma">
                  <Trash2 />
                </Button>
              }
            />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span>
            <span className="text-muted-foreground">COP: </span>
            {currencyFormatter.format(summary.totals.totalCop)}
          </span>
          <span>
            <span className="text-muted-foreground">USD: </span>
            {usdFormatter.format(summary.totals.totalUsd)}
          </span>
          <span>
            <span className="text-muted-foreground">Años: </span>
            {summary.years}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <NewMovementDialog
          platformId={summary.platform.id}
          onSubmit={onAddMovement}
          trigger={
            <Button variant="outline" size="sm">
              <Plus /> Movimiento
            </Button>
          }
        />

        {summary.movements.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Aún no hay movimientos en esta plataforma.
          </p>
        ) : (
          <ScrollableTable>
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 z-10 bg-card">
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">COP</TableHead>
                  <TableHead className="text-right">USD</TableHead>
                  <TableHead className="w-0" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.occurredAt}</TableCell>
                    <TableCell>
                      <Badge variant={movement.type === "deposit" ? "default" : "destructive"}>
                        {movement.type === "deposit" ? "Aporte" : "Retiro"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter.format(movement.amountCop)}
                    </TableCell>
                    <TableCell className="text-right">
                      {usdFormatter.format(movement.amountUsd)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditMovementDialog
                          movement={movement}
                          onSubmit={(input) => onEditMovement(movement.id, input)}
                          trigger={
                            <Button variant="ghost" size="icon-sm" aria-label="Editar">
                              <Pencil />
                            </Button>
                          }
                        />
                        <ConfirmDeleteDialog
                          title="¿Eliminar este movimiento?"
                          description="Esta acción no se puede deshacer."
                          onConfirm={() => onDeleteMovement(movement.id)}
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
        )}
      </CardContent>
    </Card>
  );
}
