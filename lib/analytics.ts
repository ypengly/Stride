import type { Activity } from "./types";

export type StatsRange = "7d" | "30d" | "3m";

export function rangeToDays(range: StatsRange): number {
  switch (range) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "3m":
      return 90;
  }
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export interface DayBucket {
  dateLabel: string;
  dayStart: number;
  distanceMeters: number;
  steps: number;
  activeSeconds: number;
}

export function bucketByDay(activities: Activity[], days: number): DayBucket[] {
  const now = startOfDay(Date.now());
  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - i * 86_400_000;
    buckets.push({
      dateLabel: new Date(dayStart).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      dayStart,
      distanceMeters: 0,
      steps: 0,
      activeSeconds: 0,
    });
  }
  const index = new Map(buckets.map((b, i) => [b.dayStart, i]));

  for (const activity of activities) {
    const day = startOfDay(activity.startedAt);
    const i = index.get(day);
    if (i === undefined) continue;
    const bucket = buckets[i];
    if (!bucket) continue;
    bucket.distanceMeters += activity.distance;
    bucket.steps += activity.steps;
    bucket.activeSeconds += activity.duration;
  }

  return buckets;
}

export interface AggregateStats {
  totalDistanceMeters: number;
  totalSteps: number;
  totalActiveSeconds: number;
  averagePaceSecPerKm: number | null;
  activityCount: number;
}

export function aggregate(activities: Activity[]): AggregateStats {
  const totalDistanceMeters = activities.reduce((s, a) => s + a.distance, 0);
  const totalSteps = activities.reduce((s, a) => s + a.steps, 0);
  const totalActiveSeconds = activities.reduce((s, a) => s + a.duration, 0);
  const averagePaceSecPerKm =
    totalDistanceMeters > 0 ? totalActiveSeconds / (totalDistanceMeters / 1000) : null;

  return {
    totalDistanceMeters,
    totalSteps,
    totalActiveSeconds,
    averagePaceSecPerKm,
    activityCount: activities.length,
  };
}

export function paceTrend(activities: Activity[], days: number) {
  const cutoff = Date.now() - days * 86_400_000;
  return activities
    .filter((a) => a.startedAt >= cutoff && a.averagePace !== null)
    .sort((a, b) => a.startedAt - b.startedAt)
    .map((a) => ({
      dateLabel: new Date(a.startedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      paceSecPerKm: a.averagePace as number,
    }));
}
