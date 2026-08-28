import type { Tables, TablesInsert, TablesUpdate } from "@/lib/database.types";
import { nextPlatformColor } from "@/features/investments/data/investments.constants";
import type {
  Movement,
  NewMovementInput,
  NewPlatformInput,
  Platform,
} from "@/features/investments/data/investments.types";

export function toPlatform(row: Tables<"investment_platforms">): Platform {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
  };
}

export function toInsertPlatformPayload(
  input: NewPlatformInput,
  userId: string,
  existingPlatformsCount: number,
): TablesInsert<"investment_platforms"> {
  return {
    user_id: userId,
    name: input.name,
    color: nextPlatformColor(existingPlatformsCount),
  };
}

export function toUpdatePlatformPayload(
  input: NewPlatformInput,
): TablesUpdate<"investment_platforms"> {
  return {
    name: input.name,
  };
}

export function toMovement(row: Tables<"investment_movements">): Movement {
  return {
    id: row.id,
    platformId: row.platform_id,
    type: row.type,
    amountCop: Number(row.amount_cop),
    amountUsd: Number(row.amount_usd),
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  };
}

export function toInsertMovementPayload(
  input: NewMovementInput,
  userId: string,
): TablesInsert<"investment_movements"> {
  return {
    user_id: userId,
    platform_id: input.platformId,
    type: input.type,
    amount_cop: input.amountCop,
    amount_usd: input.amountUsd,
    occurred_at: input.occurredAt,
  };
}

export function toUpdateMovementPayload(
  input: NewMovementInput,
): TablesUpdate<"investment_movements"> {
  return {
    type: input.type,
    amount_cop: input.amountCop,
    amount_usd: input.amountUsd,
    occurred_at: input.occurredAt,
  };
}
