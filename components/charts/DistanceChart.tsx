"use client";

import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import type { UnitSystem } from "@/lib/types";
import { formatDuration, formatDistanceValue } from "@/lib/format";

export function DistanceChart({
  data,
  unit,
}: {
  data: { t: number; distanceMeters: number }[];
  unit: UnitSystem;
}) {
  if (data.length < 2) {
    return <p className="py-8 text-center text-xs text-ink-faint">Not enough data to chart distance over time.</p>;
  }

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="distanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3db2ff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3db2ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#1a1f25" />
          <XAxis dataKey="t" tickFormatter={(v) => formatDuration(v)} tick={{ fill: "#5c6570", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#191e24", border: "1px solid #242a31", borderRadius: 12, fontSize: 12 }}
            labelFormatter={(v) => formatDuration(Number(v))}
            formatter={(value: number) => [`${formatDistanceValue(value, unit)} ${unit === "imperial" ? "mi" : "km"}`, "Distance"]}
          />
          <Area type="monotone" dataKey="distanceMeters" stroke="#3db2ff" strokeWidth={2.5} fill="url(#distanceFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
