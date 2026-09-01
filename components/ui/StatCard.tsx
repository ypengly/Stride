import clsx from "clsx";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  unit,
  accent = "ink",
  size = "md",
  className,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  accent?: "ink" | "ember" | "signal" | "mint";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const accentClass = {
    ink: "text-ink",
    ember: "text-ember",
    signal: "text-signal",
    mint: "text-mint",
  }[accent];

  const valueSize = {
    sm: "text-2xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  }[size];

  return (
    <Card className={clsx("p-4", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </p>
      <p className={clsx("mt-1.5 font-mono font-semibold tabular-nums", valueSize, accentClass)}>
        {value}
        {unit && <span className="ml-1 text-base font-medium text-ink-dim">{unit}</span>}
      </p>
    </Card>
  );
}
