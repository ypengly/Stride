"use client";

import type { Activity, UnitSystem } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { MapContainer } from "@/components/activity/MapContainer";
import { PaceChart } from "@/components/charts/PaceChart";
import { DistanceChart } from "@/components/charts/DistanceChart";
import { ActivityTypeIcon } from "@/components/ui/ActivityTypeIcon";
import {
  formatDateShort,
  formatDistance,
  formatDuration,
  formatPace,
  formatSpeed,
  formatTimeShort,
} from "@/lib/format";

export function ActivitySummaryView({ activity, unit }: { activity: Activity; unit: UnitSystem }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            activity.type === "run" ? "bg-ember/10 text-ember" : "bg-signal/10 text-signal"
          }`}
        >
          <ActivityTypeIcon type={activity.type} />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-ink">
            {activity.type === "run" ? "Run" : "Walk"}
          </p>
          <p className="text-xs text-ink-faint">
            {formatDateShort(activity.startedAt)} · {formatTimeShort(activity.startedAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Distance" size="lg" accent="signal" value={formatDistance(activity.distance, unit).split(" ")[0]} unit={unit === "imperial" ? "mi" : "km"} />
        <StatCard label="Duration" size="lg" value={formatDuration(activity.duration)} />
        <StatCard label="Avg pace" value={formatPace(activity.averagePace, unit)} />
        <StatCard label="Avg speed" value={formatSpeed(activity.averageSpeed, unit)} />
        <StatCard label="Steps" value={activity.steps.toLocaleString()} />
        <StatCard label="Calories*" value={`${Math.round(activity.calories)}`} unit="kcal" />
      </div>
      <p className="-mt-3 text-[11px] text-ink-faint">*Estimate based on activity type and duration — not medically accurate.</p>

      {activity.routePoints.length > 0 ? (
        <MapContainer route={activity.routePoints} minHeight={260} className="h-64 w-full overflow-hidden rounded-xl2 border border-line md:h-80" />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl2 border border-dashed border-line text-sm text-ink-faint">
          No route recorded for this activity.
        </div>
      )}

      <div className="rounded-xl2 border border-line bg-bg-raised p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Pace over time</p>
        <PaceChart data={activity.paceSeries} unit={unit} />
      </div>

      <div className="rounded-xl2 border border-line bg-bg-raised p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Distance over time</p>
        <DistanceChart data={activity.distanceSeries} unit={unit} />
      </div>
    </div>
  );
}
