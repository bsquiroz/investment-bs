import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { signOut } from "@/features/auth/api/auth.api";
import { useSession } from "@/features/auth/ui/hooks/use-session";
import { usePasswordStatus } from "@/features/auth/ui/hooks/use-password-status";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { PrimaryColorSwitcher } from "@/components/common/primary-color-switcher";

export function AuthenticatedLayout() {
  const { user } = useSession();
  const passwordStatus = usePasswordStatus();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  if (passwordStatus === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (passwordStatus === "no-password") {
    return <Navigate to="/set-password" replace />;
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="text-sm font-medium text-muted-foreground">{user?.email}</span>
        <div className="flex items-center gap-2">
          <PrimaryColorSwitcher />
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={handleSignOut}>
            <LogOut />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
