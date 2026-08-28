import { Navigate } from "react-router-dom";
import { useSession } from "@/features/auth/ui/hooks/use-session";
import { LoginForm } from "@/features/auth/ui/login-form";

export function LoginPage() {
  const { status } = useSession();

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
