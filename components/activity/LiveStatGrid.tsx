import type { TrackingSnapshot, UnitSystem } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatDistanceValue, formatDuration, formatPace } from "@/lib/format";

export function LiveStatGrid({ snapshot, unit }: { snapshot: TrackingSnapshot; unit: UnitSystem }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Time" size="lg" value={formatDuration(snapshot.elapsedSeconds)} />
      <StatCard
        label="Distance"
        size="lg"
        accent="signal"
        unit={unit === "imperial" ? "mi" : "km"}
        value={
          <AnimatedNumber
            value={Number(formatDistanceValue(snapshot.distanceMeters, unit))}
            format={(n) => n.toFixed(2)}
          />
        }
      />
      <StatCard label="Pace" size="lg" accent="ember" value={formatPace(snapshot.currentPaceSecPerKm, unit)} />
      <StatCard
        label="Steps"
        size="lg"
        value={<AnimatedNumber value={snapshot.steps} format={(n) => Math.round(n).toLocaleString()} />}
      />
    </div>
  );
}
