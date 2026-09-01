"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocalActivities } from "@/hooks/useLocalActivities";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/toast/ToastProvider";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActivitySummaryView } from "@/components/activity/ActivitySummaryView";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ActivityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { activities, removeActivity, isLoading } = useLocalActivities();
  const { profile } = useProfile();
  const { show } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const activity = activities.find((a) => a.id === params.id) ?? null;

  if (isLoading) return null;

  if (!activity) {
    return (
      <div className="px-5 py-6 md:px-8">
        <PageHeader title="Activity" />
        <div className="mt-6">
          <EmptyState
            title="Activity not found"
            description="It may have been deleted, or the link is out of date."
            action={<Button onClick={() => router.push("/history")}>Back to history</Button>}
          />
        </div>
      </div>
    );
  }

  function handleDelete() {
    if (!activity) return;
    removeActivity(activity.id);
    show("Activity deleted");
    router.push("/history");
  }

  return (
    <div className="pb-8">
      <PageHeader title={activity.type === "run" ? "Run" : "Walk"} />
      <div className="space-y-5 px-5 py-6 md:px-8">
        <ActivitySummaryView activity={activity} unit={profile.unit} />
        <Button variant="danger" className="w-full" onClick={() => setConfirmDelete(true)}>
          Delete activity
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this activity?"
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
