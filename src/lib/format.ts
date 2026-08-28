export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const thousandsFormatter = new Intl.NumberFormat("es-CO");

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatAmountInput(rawDigits: string): string {
  if (!rawDigits) return "";
  return thousandsFormatter.format(Number(rawDigits));
}
