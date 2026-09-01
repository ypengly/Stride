"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { UnitSystem } from "@/lib/types";
import { formatDuration, formatPace } from "@/lib/format";

export function PaceChart({
  data,
  unit,
}: {
  data: { t: number; paceSecPerKm: number | null }[];
  unit: UnitSystem;
}) {
  const points = data.filter((d) => d.paceSecPerKm !== null);
  if (points.length < 2) {
    return <p className="py-8 text-center text-xs text-ink-faint">Not enough data to chart pace over time.</p>;
  }

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1a1f25" />
          <XAxis dataKey="t" tickFormatter={(v) => formatDuration(v)} tick={{ fill: "#5c6570", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} reversed />
          <Tooltip
            contentStyle={{ background: "#191e24", border: "1px solid #242a31", borderRadius: 12, fontSize: 12 }}
            labelFormatter={(v) => formatDuration(Number(v))}
            formatter={(value: number) => [formatPace(value, unit), "Pace"]}
          />
          <Line type="monotone" dataKey="paceSecPerKm" stroke="#ff6a3d" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
