import type { ActivityType } from "@/lib/types";
import clsx from "clsx";

export function ActivityTypeIcon({ type, className }: { type: ActivityType; className?: string }) {
  if (type === "run") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={clsx("h-5 w-5", className)} aria-hidden>
        <circle cx="15.5" cy="4.5" r="1.8" fill="currentColor" />
        <path
          d="M11 21l1.8-4.6-2.3-2 .6-3.6 2.6 2.4 1 2.8 3.4.7M6 15l3-2.4 1.6-4.1-3.1 1.2L5 12.3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={clsx("h-5 w-5", className)} aria-hidden>
      <circle cx="13" cy="4.5" r="1.8" fill="currentColor" />
      <path
        d="M10 21l1-5.4-1.8-1.6.4-4 2 1.8.8 2.4 3 .6M8 15.4l2.2-2 .8-3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
