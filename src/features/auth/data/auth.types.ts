import type { Session, User } from "@supabase/supabase-js";

export type AppSession = Session;
export type AppUser = User;

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
