import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/features/auth/ui/hooks/use-session";

export function ProtectedRoute() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
