import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvestments } from "@/features/investments/ui/hooks/use-investments";
import { PlatformDialog } from "@/features/investments/ui/platform-dialog";
import { OverallTotalCard } from "@/features/investments/ui/overall-total-card";
import { PlatformCard } from "@/features/investments/ui/platform-card";

export function InvestmentsPage() {
  const {
    platformSummaries,
    overallTotals,
    loading,
    error,
    addPlatform,
    addMovement,
    editPlatform,
    removePlatform,
    editMovement,
    removeMovement,
  } = useInvestments();

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <OverallTotalCard totals={overallTotals} />
        <PlatformDialog
          title="Nueva plataforma"
          submitLabel="Crear plataforma"
          onSubmit={addPlatform}
          trigger={
            <Button>
              <Plus /> Nueva plataforma
            </Button>
          }
        />
      </div>

      {platformSummaries.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Aún no tienes plataformas. Crea una para empezar a registrar tus
          inversiones.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {platformSummaries.map((summary) => (
            <PlatformCard
              key={summary.platform.id}
              summary={summary}
              onAddMovement={addMovement}
              onEditMovement={editMovement}
              onDeleteMovement={removeMovement}
              onEditPlatform={editPlatform}
              onDeletePlatform={removePlatform}
            />
          ))}
        </div>
      )}
    </div>
  );
}
