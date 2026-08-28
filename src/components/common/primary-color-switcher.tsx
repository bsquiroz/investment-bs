import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrimaryColor } from "@/hooks/use-primary-color";
import { PRIMARY_COLORS } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function PrimaryColorSwitcher() {
  const { primaryColor, setPrimaryColor } = usePrimaryColor();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Cambiar color primario">
            <Palette />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {PRIMARY_COLORS.map((color) => (
          <DropdownMenuItem key={color.id} onClick={() => setPrimaryColor(color.id)}>
            <span className={cn("size-3 rounded-full", color.swatchClassName)} />
            {color.label}
            {primaryColor === color.id && (
              <span className="ml-auto text-xs text-muted-foreground">Activo</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
