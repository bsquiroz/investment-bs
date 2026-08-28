export interface AuthUrlError {
  code: string;
  description: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "El enlace mágico expiró o ya fue usado. Solicita uno nuevo.",
  access_denied: "No se pudo completar el inicio de sesión. Solicita un nuevo enlace.",
};

export function readAuthErrorFromUrl(): AuthUrlError | null {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const params = new URLSearchParams(hash);
  const error = params.get("error");

  if (!error) return null;

  const code = params.get("error_code") ?? error;

  return {
    code,
    description: ERROR_MESSAGES[code] ?? "No se pudo completar el inicio de sesión. Intenta de nuevo.",
  };
}

export function clearAuthErrorFromUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  window.history.replaceState(window.history.state, "", url.toString());
}
