import { createContext } from "react";
import type { AppSession, AppUser, AuthStatus } from "@/features/auth/data/auth.types";

export interface SessionContextValue {
  session: AppSession | null;
  user: AppUser | null;
  status: AuthStatus;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
