import type { Enums } from "@/lib/database.types";

export type MovementType = Enums<"investment_movement_type">;

export interface Platform {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Movement {
  id: string;
  platformId: string;
  type: MovementType;
  amountCop: number;
  amountUsd: number;
  occurredAt: string;
  createdAt: string;
}

export interface NewPlatformInput {
  name: string;
}

export interface NewMovementInput {
  platformId: string;
  type: MovementType;
  amountCop: number;
  amountUsd: number;
  occurredAt: string;
}

export interface PlatformTotals {
  totalCop: number;
  totalUsd: number;
}

export interface PlatformSummary {
  platform: Platform;
  movements: Movement[];
  totals: PlatformTotals;
  years: number;
  percentage: number;
}
