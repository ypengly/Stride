"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocalActivities } from "@/hooks/useLocalActivities";
import { useProfile } from "@/hooks/useProfile";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";

type Filter = "all" | "run" | "walk";

export default function HistoryPage() {
  const { activities, isLoading } = useLocalActivities();
  const { profile } = useProfile();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? activities : activities.filter((a) => a.type === filter)),
    [activities, filter]
  );

  return (
    <div className="pb-8">
      <PageHeader title="History" subtitle="Every walk and run you've saved." />

      <div className="px-5 pt-4 md:px-8">
        <div className="inline-flex rounded-xl border border-line bg-bg-raised p-1">
          {(["all", "run", "walk"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
                filter === f ? "bg-bg-elevated text-ink" : "text-ink-faint hover:text-ink-dim"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-5 py-6 md:px-8">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Activities you save from the tracker will show up here."
            action={
              <Link href="/activity/live">
                <Button>Start an activity</Button>
              </Link>
            }
          />
        ) : (
          filtered.map((activity) => <ActivityCard key={activity.id} activity={activity} unit={profile.unit} />)
        )}
      </div>
    </div>
  );
}
