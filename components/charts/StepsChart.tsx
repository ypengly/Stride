"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import type { DayBucket } from "@/lib/analytics";

export function StepsChart({ buckets }: { buckets: DayBucket[] }) {
  const data = buckets.map((b) => ({ day: b.dateLabel, steps: b.steps }));
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#1a1f25" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#5c6570", fontSize: 10 }} interval="preserveStartEnd" />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{ background: "#191e24", border: "1px solid #242a31", borderRadius: 12, fontSize: 12 }}
            formatter={(value: number) => [value.toLocaleString(), "Steps"]}
          />
          <Bar dataKey="steps" radius={[6, 6, 2, 2]} fill="#5ee6a8" maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
