import { ReactNode } from "react";
import { Trace } from "./Trace";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line px-6 py-14 text-center">
      <Trace className="mb-4 h-8 w-32 text-ink-faint" />
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-dim">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
