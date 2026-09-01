import { Button } from "@/components/ui/Button";
import type { TrackerPhase } from "@/hooks/useActivityTracker";

export function TrackerControls({
  phase,
  onPause,
  onResume,
  onFinish,
}: {
  phase: TrackerPhase;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {phase === "tracking" ? (
        <Button variant="secondary" size="lg" className="flex-1" onClick={onPause}>
          Pause
        </Button>
      ) : (
        <Button variant="secondary" size="lg" className="flex-1" onClick={onResume}>
          Resume
        </Button>
      )}
      <Button variant="primary" size="lg" className="flex-1" onClick={onFinish}>
        Finish
      </Button>
    </div>
  );
}
