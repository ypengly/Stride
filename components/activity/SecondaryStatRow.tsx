import type { TrackingSnapshot, UnitSystem } from "@/lib/types";
import { formatPace, formatSpeed } from "@/lib/format";

export function SecondaryStatRow({ snapshot, unit }: { snapshot: TrackingSnapshot; unit: UnitSystem }) {
  const items = [
    { label: "Avg pace", value: formatPace(snapshot.averagePaceSecPerKm, unit) },
    { label: "Speed", value: formatSpeed(snapshot.currentSpeedMs, unit) },
    { label: "Calories", value: `${Math.round(snapshot.calories)} kcal*` },
    {
      label: "GPS accuracy",
      value: snapshot.accuracy !== null ? `±${Math.round(snapshot.accuracy)} m` : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl2 border border-line bg-bg-raised p-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{item.label}</p>
          <p className="mt-1 font-mono text-sm font-semibold text-ink">{item.value}</p>
        </div>
      ))}
      <p className="col-span-2 text-[10px] text-ink-faint sm:col-span-4">*Calorie estimate, not medically accurate.</p>
    </div>
  );
}
