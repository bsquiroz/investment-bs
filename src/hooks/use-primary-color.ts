import { useCallback, useEffect, useState } from "react";
import { PRIMARY_COLOR_STORAGE_KEY, readStoredPrimaryColor, type PrimaryColor } from "@/lib/theme";

export function usePrimaryColor() {
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>(readStoredPrimaryColor);

  useEffect(() => {
    document.documentElement.dataset.primaryColor = primaryColor;
  }, [primaryColor]);

  const setPrimaryColor = useCallback((color: PrimaryColor) => {
    window.localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, color);
    setPrimaryColorState(color);
  }, []);

  return { primaryColor, setPrimaryColor };
}
