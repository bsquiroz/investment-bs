import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { hasPassword, signInWithMagicLink, signInWithPassword } from "@/features/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Step = "email" | "password" | "magic-link-sent";

export function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function sendMagicLink() {
    const { error } = await signInWithMagicLink(email);
    if (error) {
      toast.error("No pudimos enviar el enlace", { description: error.message });
      return;
    }
    setStep("magic-link-sent");
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const userHasPassword = await hasPassword(email);
      if (userHasPassword) {
        setStep("password");
      } else {
        await sendMagicLink();
      }
    } catch (err) {
      toast.error("Algo salió mal", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await signInWithPassword(email, password);
    setSubmitting(false);

    if (error) {
      toast.error("No pudimos iniciar sesión", { description: "Correo o contraseña incorrectos" });
    }
  }

  function reset() {
    setStep("email");
    setPassword("");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          {step === "email" && "Ingresa tu correo para continuar."}
          {step === "password" && "Ingresa tu contraseña."}
          {step === "magic-link-sent" && "Te enviamos un enlace mágico a tu correo."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" && (
          <form className="flex flex-col gap-4" onSubmit={handleEmailSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Verificando..." : "Continuar"}
            </Button>
          </form>
        )}

        {step === "password" && (
          <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Ingresando..." : "Iniciar sesión"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              Usar otro correo
            </Button>
          </form>
        )}

        {step === "magic-link-sent" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Revisa tu correo <span className="font-medium text-foreground">{email}</span> y haz
              clic en el enlace para verificar tu cuenta y crear tu contraseña.
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              Usar otro correo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
