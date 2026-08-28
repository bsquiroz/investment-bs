import { useEffect, useState } from "react";
import { hasPassword } from "@/features/auth/api/auth.api";
import { useSession } from "@/features/auth/ui/hooks/use-session";

export type PasswordStatus = "loading" | "has-password" | "no-password";

export function usePasswordStatus(): PasswordStatus {
  const { user } = useSession();
  const [status, setStatus] = useState<PasswordStatus>("loading");

  useEffect(() => {
    if (!user?.email) return;

    let cancelled = false;
    setStatus("loading");

    hasPassword(user.email)
      .then((result) => {
        if (!cancelled) setStatus(result ? "has-password" : "no-password");
      })
      .catch(() => {
        // Fail open: a transient check error shouldn't trap the user outside the app.
        if (!cancelled) setStatus("has-password");
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  return status;
}
