import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createMovement,
  createPlatform,
  deleteMovement,
  deletePlatform,
  listMovements,
  listPlatforms,
  updateMovement,
  updatePlatform,
} from "@/features/investments/api/investments.api";
import {
  toInsertMovementPayload,
  toInsertPlatformPayload,
  toMovement,
  toPlatform,
  toUpdateMovementPayload,
  toUpdatePlatformPayload,
} from "@/features/investments/data/investments.mappers";
import {
  computeOverallTotals,
  computePlatformPercentage,
  computePlatformTotals,
  computeYearsInvested,
} from "@/features/investments/data/investments.selectors";
import type {
  Movement,
  NewMovementInput,
  NewPlatformInput,
  Platform,
  PlatformSummary,
} from "@/features/investments/data/investments.types";
import { useSession } from "@/features/auth/ui/hooks/use-session";

export function useInvestments() {
  const { user } = useSession();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [platformRows, movementRows] = await Promise.all([listPlatforms(), listMovements()]);
      setPlatforms(platformRows.map(toPlatform));
      setMovements(movementRows.map(toMovement));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las inversiones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addPlatform = useCallback(
    async (input: NewPlatformInput) => {
      if (!user) throw new Error("No hay sesión activa");
      const row = await createPlatform(toInsertPlatformPayload(input, user.id, platforms.length));
      setPlatforms((prev) => [...prev, toPlatform(row)]);
    },
    [user, platforms.length],
  );

  const addMovement = useCallback(
    async (input: NewMovementInput) => {
      if (!user) throw new Error("No hay sesión activa");
      const row = await createMovement(toInsertMovementPayload(input, user.id));
      setMovements((prev) => [toMovement(row), ...prev]);
    },
    [user],
  );

  const editPlatform = useCallback(async (id: string, input: NewPlatformInput) => {
    const row = await updatePlatform(id, toUpdatePlatformPayload(input));
    const updated = toPlatform(row);
    setPlatforms((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }, []);

  const removePlatform = useCallback(async (id: string) => {
    await deletePlatform(id);
    setPlatforms((prev) => prev.filter((p) => p.id !== id));
    setMovements((prev) => prev.filter((m) => m.platformId !== id));
  }, []);

  const editMovement = useCallback(async (id: string, input: NewMovementInput) => {
    const row = await updateMovement(id, toUpdateMovementPayload(input));
    const updated = toMovement(row);
    setMovements((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }, []);

  const removeMovement = useCallback(async (id: string) => {
    await deleteMovement(id);
    setMovements((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const overallTotals = useMemo(() => {
    const perPlatformTotals = platforms.map((platform) =>
      computePlatformTotals(movements.filter((movement) => movement.platformId === platform.id)),
    );
    return computeOverallTotals(perPlatformTotals);
  }, [platforms, movements]);

  const platformSummaries = useMemo<PlatformSummary[]>(() => {
    return platforms.map((platform) => {
      const platformMovements = movements.filter((movement) => movement.platformId === platform.id);
      const totals = computePlatformTotals(platformMovements);

      return {
        platform,
        movements: platformMovements,
        totals,
        years: computeYearsInvested(platformMovements),
        percentage: computePlatformPercentage(totals.totalCop, overallTotals.totalCop),
      };
    });
  }, [platforms, movements, overallTotals.totalCop]);

  return {
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
  };
}
