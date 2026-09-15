import { formatINR } from "@/lib/yatri-data";
import { cn } from "@/lib/utils";

const barColor: Record<string, string> = {
  Accommodation: "bg-primary",
  Stay: "bg-primary",
  Food: "bg-budget",
  Transport: "bg-accent",
  Transportation: "bg-accent",
  Activities: "bg-verified",
  Shopping: "bg-chart-5",
  Contingency: "bg-muted-foreground",
  Other: "bg-muted-foreground",
};

export function BudgetBreakdown({
  rows,
  total,
}: {
  rows: { label: string; amount: number }[];
  total: number;
}) {
  return (
    <div className="space-y-4">
      {rows.map((r) => {
        const pct = total > 0 ? Math.min(100, (r.amount / total) * 100) : 0;
        return (
          <div key={r.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">{r.label}</span>
              <span className="text-muted-foreground">
                {formatINR(r.amount)} · {Math.round(pct)}%
              </span>
            </div>
            <div className="bg-secondary h-2.5 w-full overflow-hidden rounded-full">
              <div
                className={cn("h-full rounded-full transition-all", barColor[r.label] ?? "bg-primary")}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BudgetTracker({
  budget,
  spent,
}: {
  budget: number;
  spent: number;
}) {
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const nearLimit = pct >= 85;
  return (
    <div className="surface-card space-y-4 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs font-medium">Total budget</p>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
            {formatINR(budget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs font-medium">Remaining</p>
          <p
            className={cn(
              "font-[family-name:var(--font-display)] text-2xl font-bold",
              nearLimit ? "text-alert" : "text-verified",
            )}
          >
            {formatINR(Math.max(0, budget - spent))}
          </p>
        </div>
      </div>
      <div className="bg-secondary h-3 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", nearLimit ? "bg-alert" : "bg-verified")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        {formatINR(spent)} planned or spent · {Math.round(pct)}% of budget
        {nearLimit && " · you're close to your limit"}
      </p>
    </div>
  );
}
