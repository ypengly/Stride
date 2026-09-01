"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useProfile } from "@/hooks/useProfile";
import type { ActivityType } from "@/lib/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActivityTypeSelector } from "@/components/activity/ActivityTypeSelector";
import { LiveStatGrid } from "@/components/activity/LiveStatGrid";
import { SecondaryStatRow } from "@/components/activity/SecondaryStatRow";
import { TrackerControls } from "@/components/activity/TrackerControls";
import { StatusBanner } from "@/components/activity/StatusBanner";
import { MapContainer } from "@/components/activity/MapContainer";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/nav/icons";

export default function LiveActivityPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const [activityType, setActivityType] = useState<ActivityType>("run");

  const tracker = useActivityTracker(activityType, profile.weightKg);
  const { phase, snapshot, geoPermission, geoError, motionPermission, motionSupported } = tracker;

  function handleFinish() {
    const activity = tracker.finish();
    sessionStorage.setItem("stride:draft-activity", JSON.stringify(activity));
    router.push("/activity/summary");
  }

  const isActive = phase === "tracking" || phase === "paused";

  return (
    <div className="pb-8">
      <PageHeader
        title={isActive ? (activityType === "run" ? "Running" : "Walking") : "Start an activity"}
        subtitle={isActive ? (phase === "paused" ? "Paused" : "Tracking") : "Choose a type, then hit start."}
      />

      <div className="space-y-5 px-5 py-6 md:px-8">
        {!isActive && (
          <>
            <ActivityTypeSelector value={activityType} onChange={setActivityType} />

            <StatusBanner tone="info" title="Keep this tab open while you move">
              Web-based GPS and step tracking only run while Stride stays active in
              the foreground — locking your phone or switching apps will pause
              tracking.
            </StatusBanner>

            <Button size="lg" className="w-full" onClick={tracker.start}>
              <PlusIcon className="h-5 w-5" />
              Start Activity
            </Button>
          </>
        )}

        {isActive && (
          <>
            {geoPermission === "denied" && (
              <StatusBanner tone="danger" title="Location permission was denied">
                Your route and distance can't be tracked without location access.
                Time and steps are still being recorded. You can enable location
                in your browser's site settings and start a new activity.
              </StatusBanner>
            )}
            {geoPermission === "unavailable" && (
              <StatusBanner tone="danger" title="GPS isn't available on this device">
                This browser doesn't support location tracking. Time and steps
                are still being recorded.
              </StatusBanner>
            )}
            {geoError && geoPermission !== "denied" && (
              <StatusBanner tone="warn" title={geoError} />
            )}
            {geoPermission === "granted" && snapshot.accuracy !== null && snapshot.accuracy > 25 && (
              <StatusBanner tone="warn" title="GPS accuracy is currently low">
                Move somewhere with a clearer view of the sky for a more accurate route and distance.
              </StatusBanner>
            )}
            {(motionPermission === "denied" || !motionSupported) && (
              <StatusBanner tone="warn" title="Step detection isn't available on this device/browser">
                You'll be able to enter your step count manually on the summary screen.
              </StatusBanner>
            )}

            <LiveStatGrid snapshot={snapshot} unit={profile.unit} />

            <MapContainer route={snapshot.route} liveDot minHeight={260} className="h-64 w-full overflow-hidden rounded-xl2 border border-line md:h-80" />

            <SecondaryStatRow snapshot={snapshot} unit={profile.unit} />

            {snapshot.latitude !== null && snapshot.longitude !== null && (
              <p className="text-center font-mono text-xs text-ink-faint">
                {snapshot.latitude.toFixed(5)}, {snapshot.longitude.toFixed(5)}
              </p>
            )}

            <TrackerControls
              phase={phase}
              onPause={tracker.pause}
              onResume={tracker.resume}
              onFinish={handleFinish}
            />
          </>
        )}
      </div>
    </div>
  );
}
