import { useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "@/features/auth/api/auth.api";
import { useSession } from "@/features/auth/ui/hooks/use-session";
import { usePasswordStatus } from "@/features/auth/ui/hooks/use-password-status";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { PrimaryColorSwitcher } from "@/components/common/primary-color-switcher";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/dashboard", label: "Finanzas" },
  { to: "/investments", label: "Inversiones" },
];

export function AuthenticatedLayout() {
  const { user } = useSession();
  const passwordStatus = usePasswordStatus();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    setMobileMenuOpen(false);
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
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <nav className="hidden items-center gap-4 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground",
                  isActive && "text-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Abrir menú" className="md:hidden">
                <Menu />
              </Button>
            }
          />
          <SheetContent side="left" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                      isActive && "bg-muted text-foreground",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t border-border p-4">
              <span className="truncate text-sm text-muted-foreground">{user?.email}</span>
              <div className="flex items-center gap-2">
                <PrimaryColorSwitcher />
                <ThemeToggle />
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut /> Cerrar sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden items-center gap-2 md:flex">
          <span className="text-sm font-medium text-muted-foreground">{user?.email}</span>
          <PrimaryColorSwitcher />
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={handleSignOut}>
            <LogOut />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
