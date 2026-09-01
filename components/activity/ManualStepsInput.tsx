"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ManualStepsInput({
  initialSteps,
  onSave,
}: {
  initialSteps: number;
  onSave: (steps: number) => void;
}) {
  const [value, setValue] = useState(String(initialSteps || ""));

  return (
    <div className="rounded-xl2 border border-line bg-bg-raised p-4">
      <label htmlFor="manual-steps" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        Steps (manual entry)
      </label>
      <p className="mt-1 text-xs text-ink-dim">Step detection wasn't available for this activity — enter a count if you know it.</p>
      <div className="mt-3 flex gap-2">
        <input
          id="manual-steps"
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-bg-elevated px-3 font-mono text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50"
          placeholder="e.g. 6200"
        />
        <Button variant="secondary" onClick={() => onSave(Math.max(0, Number(value) || 0))}>
          Set
        </Button>
      </div>
    </div>
  );
}
