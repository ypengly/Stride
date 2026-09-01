"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Activity } from "@/lib/types";
import { useProfile } from "@/hooks/useProfile";
import { useLocalActivities } from "@/hooks/useLocalActivities";
import { useToast } from "@/components/toast/ToastProvider";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActivitySummaryView } from "@/components/activity/ActivitySummaryView";
import { ManualStepsInput } from "@/components/activity/ManualStepsInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ActivitySummaryPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const { saveActivity } = useLocalActivities();
  const { show } = useToast();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("stride:draft-activity");
    if (raw) {
      try {
        setActivity(JSON.parse(raw));
      } catch {
        setActivity(null);
      }
    }
  }, []);

  if (!activity) {
    return (
      <div className="px-5 py-6 md:px-8">
        <PageHeader title="Activity summary" />
        <div className="mt-6">
          <EmptyState
            title="No activity to show"
            description="Finish an activity from the tracker to see its summary here."
            action={<Button onClick={() => router.push("/activity/live")}>Start an activity</Button>}
          />
        </div>
      </div>
    );
  }

  function handleSave() {
    if (!activity) return;
    saveActivity(activity);
    sessionStorage.removeItem("stride:draft-activity");
    show("Activity saved", "success");
    router.push("/history");
  }

  function handleDiscard() {
    sessionStorage.removeItem("stride:draft-activity");
    show("Activity discarded");
    router.push("/");
  }

  return (
    <div className="pb-8">
      <PageHeader title="Great work" subtitle="Here's how it went." />

      <div className="space-y-5 px-5 py-6 md:px-8">
        <ActivitySummaryView activity={activity} unit={profile.unit} />

        {activity.stepsSource !== "sensor" && (
          <ManualStepsInput
            initialSteps={activity.steps}
            onSave={(steps) => setActivity({ ...activity, steps, stepsSource: "manual" })}
          />
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={() => setConfirmDiscard(true)}>
            Discard
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            Save Activity
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title="Discard this activity?"
        description="This can't be undone — the route, time, and steps you just recorded will be lost."
        confirmLabel="Discard"
        destructive
        onConfirm={handleDiscard}
        onCancel={() => setConfirmDiscard(false)}
      />
    </div>
  );
}
