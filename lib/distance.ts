import type { RoutePoint } from "./types";

const EARTH_RADIUS_M = 6371000;

/**
 * Haversine great-circle distance between two lat/lng points, in meters.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

// --- GPS point filtering -------------------------------------------------
// Raw browser geolocation is noisy: accuracy can swing from 5m to 500m,
// and the occasional point teleports hundreds of meters away because of
// a wifi/cell tower re-lock. We reject points that are almost certainly
// noise rather than real movement, so distance doesn't creep upward while
// the phone sits still on a table.

const MAX_ACCEPTABLE_ACCURACY_M = 35; // ignore fixes worse than this
const MAX_PLAUSIBLE_SPEED_MS = 12.5; // ~45 km/h, generous for a sprint finish
const MIN_MOVEMENT_M = 1.5; // ignore GPS jitter smaller than this

export interface GpsFilterResult {
  accept: boolean;
  reason?: "poor-accuracy" | "implausible-jump" | "jitter";
  distanceDeltaM: number;
}

export function evaluateNextPoint(
  previous: RoutePoint | null,
  next: RoutePoint
): GpsFilterResult {
  if (next.accuracy !== null && next.accuracy > MAX_ACCEPTABLE_ACCURACY_M) {
    return { accept: false, reason: "poor-accuracy", distanceDeltaM: 0 };
  }

  if (!previous) {
    return { accept: true, distanceDeltaM: 0 };
  }

  const distanceDeltaM = haversineDistance(
    previous.latitude,
    previous.longitude,
    next.latitude,
    next.longitude
  );

  const dtSeconds = Math.max((next.timestamp - previous.timestamp) / 1000, 0.001);
  const impliedSpeed = distanceDeltaM / dtSeconds;

  if (impliedSpeed > MAX_PLAUSIBLE_SPEED_MS) {
    return { accept: false, reason: "implausible-jump", distanceDeltaM: 0 };
  }

  if (distanceDeltaM < MIN_MOVEMENT_M) {
    // Real point, but too small to count as movement — keep it as the
    // new "previous" so we don't compound tiny errors, just don't add distance.
    return { accept: true, reason: "jitter", distanceDeltaM: 0 };
  }

  return { accept: true, distanceDeltaM };
}

export function metersToKm(meters: number): number {
  return meters / 1000;
}

export function metersToMiles(meters: number): number {
  return meters / 1609.344;
}
