// Core domain types for Stride.
// Kept storage-agnostic on purpose: the same shapes will work whether
// activities live in LocalStorage (v1) or a Supabase table (later).

export type ActivityType = "walk" | "run";

export type UnitSystem = "metric" | "imperial";

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number; // ms epoch
  accuracy: number | null; // meters
  speed: number | null; // m/s, from the Geolocation API when available
}

export interface Activity {
  id: string;
  type: ActivityType;
  startedAt: number; // ms epoch
  endedAt: number; // ms epoch
  duration: number; // seconds, excludes paused time
  distance: number; // meters
  steps: number;
  stepsSource: "sensor" | "manual" | "estimated";
  calories: number; // estimate, never claim medical accuracy
  averagePace: number | null; // seconds per km, null if distance is ~0
  averageSpeed: number; // m/s
  routePoints: RoutePoint[];
  paceSeries: { t: number; paceSecPerKm: number | null }[]; // for the summary chart
  distanceSeries: { t: number; distanceMeters: number }[];
  createdAt: number; // ms epoch, when saved
  isDemo?: boolean;
}

export interface UserProfile {
  displayName: string;
  weightKg: number | null;
  unit: UnitSystem;
  theme: "dark" | "light";
}

export type GeoPermissionState = "unknown" | "granted" | "denied" | "unavailable";
export type MotionPermissionState =
  | "unknown"
  | "granted"
  | "denied"
  | "unavailable"
  | "not-required";

export interface TrackingSnapshot {
  elapsedSeconds: number;
  distanceMeters: number;
  steps: number;
  currentPaceSecPerKm: number | null;
  averagePaceSecPerKm: number | null;
  currentSpeedMs: number;
  averageSpeedMs: number;
  calories: number;
  accuracy: number | null;
  latitude: number | null;
  longitude: number | null;
  route: RoutePoint[];
}
