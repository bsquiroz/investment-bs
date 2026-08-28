import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatter } from "@/lib/format";
import type { PlatformTotals } from "@/features/investments/data/investments.types";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function OverallTotalCard({ totals }: { totals: PlatformTotals }) {
  return (
    <Card className="min-w-64 flex-none">
      <CardHeader>
        <CardDescription>Total invertido</CardDescription>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <CardTitle className="text-2xl">{currencyFormatter.format(totals.totalCop)}</CardTitle>
          <CardTitle className="text-2xl text-muted-foreground">
            {usdFormatter.format(totals.totalUsd)}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}
