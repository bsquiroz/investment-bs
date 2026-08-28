import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/features/auth/ui/session-provider";
import { LoginPage } from "@/features/auth/ui/login-page";
import { ProtectedRoute } from "@/features/auth/ui/protected-route";
import { AuthenticatedLayout } from "@/features/auth/ui/authenticated-layout";
import { SetPasswordPage } from "@/features/auth/ui/set-password-page";
import { DashboardPage } from "@/features/transactions/ui/dashboard-page";

function App() {
  return (
    <SessionProvider>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </SessionProvider>
  );
}

export default App;
