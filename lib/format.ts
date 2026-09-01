import type { UnitSystem } from "./types";
import { metersToKm, metersToMiles } from "./distance";

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function formatDistance(meters: number, unit: UnitSystem): string {
  if (unit === "imperial") {
    return `${metersToMiles(meters).toFixed(2)} mi`;
  }
  return `${metersToKm(meters).toFixed(2)} km`;
}

export function formatDistanceValue(meters: number, unit: UnitSystem): string {
  return unit === "imperial"
    ? metersToMiles(meters).toFixed(2)
    : metersToKm(meters).toFixed(2);
}

export function formatPace(secPerKm: number | null, unit: UnitSystem): string {
  if (secPerKm === null || !isFinite(secPerKm) || secPerKm <= 0) return "--:--";
  const secPerUnit = unit === "imperial" ? secPerKm * 1.609344 : secPerKm;
  const m = Math.floor(secPerUnit / 60);
  const s = Math.round(secPerUnit % 60);
  return `${m}:${String(s).padStart(2, "0")} /${unit === "imperial" ? "mi" : "km"}`;
}

export function formatSpeed(ms: number, unit: UnitSystem): string {
  const kmh = ms * 3.6;
  const value = unit === "imperial" ? kmh * 0.621371 : kmh;
  return `${value.toFixed(1)} ${unit === "imperial" ? "mph" : "km/h"}`;
}

export function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatTimeShort(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString();
}
