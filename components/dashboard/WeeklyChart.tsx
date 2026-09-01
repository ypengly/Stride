"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import type { DayBucket } from "@/lib/analytics";
import type { UnitSystem } from "@/lib/types";
import { formatDistanceValue } from "@/lib/format";

export function WeeklyChart({ buckets, unit }: { buckets: DayBucket[]; unit: UnitSystem }) {
  const data = buckets.map((b) => ({
    day: b.dateLabel.split(" ")[1] ?? b.dateLabel,
    distance: Number(formatDistanceValue(b.distanceMeters, unit)),
  }));

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1a1f25" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#5c6570", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background: "#191e24",
              border: "1px solid #242a31",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "#98a2ae" }}
            formatter={(value: number) => [`${value} ${unit === "imperial" ? "mi" : "km"}`, "Distance"]}
          />
          <Bar dataKey="distance" radius={[6, 6, 2, 2]} fill="#3db2ff" maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
