import clsx from "clsx";
import type { StatsRange } from "@/lib/analytics";

const labels: Record<StatsRange, string> = { "7d": "7 days", "30d": "30 days", "3m": "3 months" };

export function RangeTabs({ value, onChange }: { value: StatsRange; onChange: (r: StatsRange) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-bg-raised p-1">
      {(Object.keys(labels) as StatsRange[]).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={clsx(
            "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
            value === r ? "bg-bg-elevated text-ink" : "text-ink-faint hover:text-ink-dim"
          )}
        >
          {labels[r]}
        </button>
      ))}
    </div>
  );
}
