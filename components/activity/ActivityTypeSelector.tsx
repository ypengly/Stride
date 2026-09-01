"use client";

import clsx from "clsx";
import type { ActivityType } from "@/lib/types";
import { ActivityTypeIcon } from "@/components/ui/ActivityTypeIcon";

export function ActivityTypeSelector({
  value,
  onChange,
}: {
  value: ActivityType;
  onChange: (type: ActivityType) => void;
}) {
  const options: { type: ActivityType; label: string }[] = [
    { type: "walk", label: "Walking" },
    { type: "run", label: "Running" },
  ];

  return (
    <div role="radiogroup" aria-label="Activity type" className="grid grid-cols-2 gap-3">
      {options.map(({ type, label }) => {
        const active = value === type;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(type)}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-xl2 border px-4 py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50",
              active
                ? "border-ember/50 bg-ember/10 text-ember"
                : "border-line bg-bg-raised text-ink-dim hover:border-ink-faint"
            )}
          >
            <ActivityTypeIcon type={type} className="h-6 w-6" />
            <span className="font-display text-sm font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
