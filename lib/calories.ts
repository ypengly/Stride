import type { ActivityType } from "./types";

// Calorie estimation is intentionally simple and clearly labeled as an
// estimate everywhere it's shown. This is NOT medically validated — it's a
// MET-based approximation, the same rough method many consumer apps use
// before they have a heart-rate sensor to work with.
//
// MET (metabolic equivalent) values:
//   walking ~3.5 METs, running ~9.8 METs (moderate pace assumptions)
// calories/min = MET * weightKg * 3.5 / 200

const DEFAULT_WEIGHT_KG = 70;
const MET_WALK = 3.5;
const MET_RUN = 9.8;

export function estimateCalories(
  type: ActivityType,
  durationSeconds: number,
  weightKg: number | null
): number {
  const weight = weightKg && weightKg > 0 ? weightKg : DEFAULT_WEIGHT_KG;
  const met = type === "run" ? MET_RUN : MET_WALK;
  const minutes = durationSeconds / 60;
  const calories = (met * weight * 3.5) / 200 * minutes;
  return Math.max(0, Math.round(calories));
}

export const CALORIE_DEFAULT_WEIGHT_KG = DEFAULT_WEIGHT_KG;
