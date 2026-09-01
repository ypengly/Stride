import Link from "next/link";
import type { Activity, UnitSystem } from "@/lib/types";
import { formatDateShort, formatDistance, formatDuration, formatPace, formatTimeShort } from "@/lib/format";
import { ActivityTypeIcon } from "@/components/ui/ActivityTypeIcon";
import { Card } from "@/components/ui/Card";

export function ActivityCard({ activity, unit }: { activity: Activity; unit: UnitSystem }) {
  const title = activity.type === "run" ? "Run" : "Walk";
  const timeOfDay = new Date(activity.startedAt).getHours();
  const label = timeOfDay < 12 ? `Morning ${title}` : timeOfDay < 17 ? `Afternoon ${title}` : `Evening ${title}`;

  return (
    <Link href={`/history/${activity.id}`} className="block">
      <Card className="group flex items-center gap-4 p-4 transition-colors hover:border-ink-faint">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            activity.type === "run" ? "bg-ember/10 text-ember" : "bg-signal/10 text-signal"
          }`}
        >
          <ActivityTypeIcon type={activity.type} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-display text-sm font-semibold text-ink">{label}</p>
            {activity.isDemo && (
              <span className="shrink-0 rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                Sample
              </span>
            )}
          </div>
          <p className="text-xs text-ink-faint">
            {formatDateShort(activity.startedAt)} · {formatTimeShort(activity.startedAt)}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-xs text-ink-dim">
            <span>{formatDistance(activity.distance, unit)}</span>
            <span>{formatDuration(activity.duration)}</span>
            <span>{formatPace(activity.averagePace, unit)}</span>
            <span>{activity.steps.toLocaleString()} steps</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
