"use client";

import { useMemo, useState } from "react";
import { useLocalActivities } from "@/hooks/useLocalActivities";
import { useProfile } from "@/hooks/useProfile";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RangeTabs } from "@/components/dashboard/RangeTabs";
import { StatCard } from "@/components/ui/StatCard";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { StepsChart } from "@/components/charts/StepsChart";
import { PaceTrendChart } from "@/components/charts/PaceTrendChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { aggregate, bucketByDay, paceTrend, rangeToDays, type StatsRange } from "@/lib/analytics";
import { computeCurrentStreak } from "@/lib/streak";
import { formatDistance, formatDuration, formatPace } from "@/lib/format";

export default function StatsPage() {
  const { activities, isLoading } = useLocalActivities();
  const { profile } = useProfile();
  const [range, setRange] = useState<StatsRange>("7d");

  const days = rangeToDays(range);
  const cutoff = Date.now() - days * 86_400_000;
  const inRange = useMemo(() => activities.filter((a) => a.startedAt >= cutoff), [activities, cutoff]);

  const stats = aggregate(inRange);
  const buckets = bucketByDay(activities, Math.min(days, 30));
  const trend = paceTrend(activities, days);
  const streak = computeCurrentStreak(activities);

  return (
    <div className="pb-8">
      <PageHeader title="Statistics" subtitle="Your training, at a glance." />

      <div className="px-5 pt-4 md:px-8">
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 py-6 md:grid-cols-3 md:px-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard label="Total distance" value={formatDistance(stats.totalDistanceMeters, profile.unit).split(" ")[0]} unit={profile.unit === "imperial" ? "mi" : "km"} accent="signal" />
            <StatCard label="Total steps" value={stats.totalSteps.toLocaleString()} />
            <StatCard label="Active time" value={formatDuration(stats.totalActiveSeconds)} />
            <StatCard label="Avg pace" value={formatPace(stats.averagePaceSecPerKm, profile.unit)} accent="ember" />
            <StatCard label="Activities" value={stats.activityCount} />
            <StatCard label="Current streak" value={streak} unit={streak === 1 ? "day" : "days"} accent="mint" />
          </>
        )}
      </div>

      <div className="space-y-5 px-5 pb-6 md:px-8">
        <div className="rounded-xl2 border border-line bg-bg-raised p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Distance by day</p>
          {isLoading ? <Skeleton className="h-40 w-full" /> : <WeeklyChart buckets={buckets} unit={profile.unit} />}
        </div>

        <div className="rounded-xl2 border border-line bg-bg-raised p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Steps by day</p>
          {isLoading ? <Skeleton className="h-52 w-full" /> : <StepsChart buckets={buckets} />}
        </div>

        <div className="rounded-xl2 border border-line bg-bg-raised p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Pace trend</p>
          {isLoading ? <Skeleton className="h-52 w-full" /> : <PaceTrendChart data={trend} unit={profile.unit} />}
        </div>
      </div>
    </div>
  );
}
