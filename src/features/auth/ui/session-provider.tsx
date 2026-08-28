import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getSession, onAuthStateChange } from "@/features/auth/api/auth.api";
import { clearAuthErrorFromUrl, readAuthErrorFromUrl } from "@/features/auth/data/auth-url-error";
import type { AppSession, AuthStatus } from "@/features/auth/data/auth.types";
import { SessionContext } from "@/features/auth/ui/session-context";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const urlError = readAuthErrorFromUrl();
    if (urlError) {
      toast.error("No pudimos iniciar sesión", { description: urlError.description });
      clearAuthErrorFromUrl();
    }

    getSession().then((initialSession) => {
      setSession(initialSession);
      setStatus(initialSession ? "authenticated" : "unauthenticated");
    });

    const {
      data: { subscription },
    } = onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "unauthenticated");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ session, user: session?.user ?? null, status }}>
      {children}
    </SessionContext.Provider>
  );
}
