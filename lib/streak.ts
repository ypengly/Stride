import type { Activity } from "./types";

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Current streak = consecutive days (ending today or yesterday) that have
 * at least one saved activity.
 */
export function computeCurrentStreak(activities: Activity[]): number {
  if (activities.length === 0) return 0;
  const days = new Set(activities.map((a) => dayKey(a.startedAt)));

  const cursor = new Date();
  let streak = 0;

  // If nothing today, the streak can still be "alive" through yesterday.
  if (!days.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor.getTime()))) return 0;
  }

  while (days.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
