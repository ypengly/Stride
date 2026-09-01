"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import type { UnitSystem } from "@/lib/types";
import { formatPace } from "@/lib/format";

export function PaceTrendChart({
  data,
  unit,
}: {
  data: { dateLabel: string; paceSecPerKm: number }[];
  unit: UnitSystem;
}) {
  if (data.length < 2) {
    return <p className="py-8 text-center text-xs text-ink-faint">Log a few more activities to see a pace trend.</p>;
  }
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1a1f25" />
          <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fill: "#5c6570", fontSize: 10 }} interval="preserveStartEnd" />
          <Tooltip
            contentStyle={{ background: "#191e24", border: "1px solid #242a31", borderRadius: 12, fontSize: 12 }}
            formatter={(value: number) => [formatPace(value, unit), "Pace"]}
          />
          <Line type="monotone" dataKey="paceSecPerKm" stroke="#ff6a3d" strokeWidth={2.5} dot={{ r: 3, fill: "#ff6a3d" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
