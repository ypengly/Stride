"use client";

import Link from "next/link";
import { useLocalActivities } from "@/hooks/useLocalActivities";
import { useProfile } from "@/hooks/useProfile";
import { Hero } from "@/components/dashboard/Hero";
import { StatCard } from "@/components/ui/StatCard";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { bucketByDay } from "@/lib/analytics";
import { computeCurrentStreak } from "@/lib/streak";
import { formatDistance, formatDistanceValue, formatDuration } from "@/lib/format";

export default function DashboardPage() {
  const { activities, isLoading } = useLocalActivities();
  const { profile } = useProfile();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysActivities = activities.filter((a) => a.startedAt >= today.getTime());
  const todaySteps = todaysActivities.reduce((s, a) => s + a.steps, 0);
  const todayDistance = todaysActivities.reduce((s, a) => s + a.distance, 0);
  const todayActiveSeconds = todaysActivities.reduce((s, a) => s + a.duration, 0);

  const weekBuckets = bucketByDay(activities, 7);
  const weekDistance = weekBuckets.reduce((s, b) => s + b.distanceMeters, 0);
  const streak = computeCurrentStreak(activities);
  const recent = activities.slice(0, 4);

  return (
    <div>
      <Hero />

      <section className="grid grid-cols-2 gap-3 px-5 py-6 md:grid-cols-4 md:px-8">
        <StatCard
          label="Today's steps"
          value={
            isLoading ? <Skeleton className="h-9 w-16" /> : <AnimatedNumber value={todaySteps} format={(n) => Math.round(n).toLocaleString()} />
          }
        />
        <StatCard
          label="Today's distance"
          accent="signal"
          value={
            isLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <AnimatedNumber value={Number(formatDistanceValue(todayDistance, profile.unit))} format={(n) => n.toFixed(2)} />
            )
          }
          unit={profile.unit === "imperial" ? "mi" : "km"}
        />
        <StatCard
          label="Active time"
          value={isLoading ? <Skeleton className="h-9 w-16" /> : formatDuration(todayActiveSeconds)}
        />
        <StatCard
          label="Current streak"
          accent="mint"
          value={isLoading ? <Skeleton className="h-9 w-16" /> : streak}
          unit={streak === 1 ? "day" : "days"}
        />
      </section>

      <section className="px-5 md:px-8">
        <div className="rounded-xl2 border border-line bg-bg-raised p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">This week</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-ink">
                {formatDistance(weekDistance, profile.unit)}
              </p>
            </div>
            <Link href="/stats" className="text-xs font-medium text-signal hover:text-signal-soft">
              View stats →
            </Link>
          </div>
          <div className="mt-4">
            {isLoading ? <Skeleton className="h-40 w-full" /> : <WeeklyChart buckets={weekBuckets} unit={profile.unit} />}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 md:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Recent activities</h2>
          {activities.length > 0 && (
            <Link href="/history" className="text-xs font-medium text-signal hover:text-signal-soft">
              See all →
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            title="No activities yet"
            description="Your first walk or run will show up here, along with its route, pace, and steps."
            action={
              <Link href="/activity/live">
                <Button>Start your first activity</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {recent.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} unit={profile.unit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
