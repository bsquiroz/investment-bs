export type PrimaryColor = "orange" | "red" | "blue";

export const PRIMARY_COLOR_STORAGE_KEY = "primary-color";

export const PRIMARY_COLORS: { id: PrimaryColor; label: string; swatchClassName: string }[] = [
  { id: "orange", label: "Naranja", swatchClassName: "bg-[oklch(0.705_0.191_47.6)]" },
  { id: "red", label: "Rojo", swatchClassName: "bg-[oklch(0.637_0.237_25.331)]" },
  { id: "blue", label: "Azul", swatchClassName: "bg-[oklch(0.623_0.214_259.815)]" },
];

export const DEFAULT_PRIMARY_COLOR: PrimaryColor = "orange";

export function readStoredPrimaryColor(): PrimaryColor {
  if (typeof window === "undefined") return DEFAULT_PRIMARY_COLOR;

  const stored = window.localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);
  return stored === "orange" || stored === "red" || stored === "blue"
    ? stored
    : DEFAULT_PRIMARY_COLOR;
}

export function applyStoredPrimaryColor() {
  document.documentElement.dataset.primaryColor = readStoredPrimaryColor();
}
