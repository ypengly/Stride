"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useLocalActivities } from "@/hooks/useLocalActivities";
import { useToast } from "@/components/toast/ToastProvider";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { aggregate } from "@/lib/analytics";
import { computeCurrentStreak } from "@/lib/streak";
import { formatDistance, formatDuration } from "@/lib/format";
import clsx from "clsx";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const { activities, clearAllData, clearDemoData } = useLocalActivities();
  const { show } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = aggregate(activities);
  const streak = computeCurrentStreak(activities);
  const hasDemoData = activities.some((a) => a.isDemo);

  function handleReset() {
    clearAllData();
    show("Local data cleared");
    setConfirmReset(false);
  }

  return (
    <div className="pb-8">
      <PageHeader title="Profile" />

      <div className="space-y-5 px-5 py-6 md:px-8">
        <Card className="p-5">
          <label htmlFor="display-name" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Display name
          </label>
          <input
            id="display-name"
            value={profile.displayName}
            onChange={(e) => updateProfile({ displayName: e.target.value })}
            className="mt-2 h-11 w-full rounded-xl border border-line bg-bg-elevated px-3 font-display text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50"
          />
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBlock label="Distance" value={formatDistance(stats.totalDistanceMeters, profile.unit)} />
          <StatBlock label="Steps" value={stats.totalSteps.toLocaleString()} />
          <StatBlock label="Activities" value={String(stats.activityCount)} />
          <StatBlock label="Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} />
        </div>

        <Card className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Units</p>
          <div className="mt-2 inline-flex rounded-xl border border-line bg-bg-elevated p-1">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => updateProfile({ unit: u })}
                className={clsx(
                  "rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-colors",
                  profile.unit === u ? "bg-bg-raised text-ink" : "text-ink-faint hover:text-ink-dim"
                )}
              >
                {u === "metric" ? "Metric (km)" : "Imperial (mi)"}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Theme</p>
          <p className="mt-2 text-sm text-ink-dim">
            Stride is designed dark-first for outdoor visibility. Light mode is on the roadmap.
          </p>
        </Card>

        {hasDemoData && (
          <Card className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">Sample data</p>
            <p className="mt-2 text-sm text-ink-dim">
              Your dashboard currently includes a few sample activities so it isn't empty. Remove them once you've
              logged your own.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => {
                clearDemoData();
                show("Sample activities removed");
              }}
            >
              Remove sample activities
            </Button>
          </Card>
        )}

        <Card className="border-danger/20 bg-danger/5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-danger">Danger zone</p>
          <p className="mt-2 text-sm text-ink-dim">
            {hasDemoData
              ? "This will remove all activities, including the sample data."
              : "This will permanently remove every saved activity on this device."}
          </p>
          <Button variant="danger" size="sm" className="mt-3" onClick={() => setConfirmReset(true)}>
            Reset local data
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all local data?"
        description="Every saved activity on this device will be permanently deleted. This can't be undone."
        confirmLabel="Reset data"
        destructive
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-ink">{value}</p>
    </Card>
  );
}
