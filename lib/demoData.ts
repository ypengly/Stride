import type { Activity, ActivityType, RoutePoint } from "./types";
import { estimateCalories } from "./calories";

// Sample data so the dashboard/history/stats pages have something to show
// on first launch. Every record is flagged isDemo so it's easy to filter
// out or wipe from the Profile page.

function synthesizeRoute(centerLat: number, centerLng: number, points: number, radiusDeg: number): RoutePoint[] {
  const route: RoutePoint[] = [];
  const start = Date.now() - points * 10_000;
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble = Math.sin(i * 1.3) * radiusDeg * 0.15;
    route.push({
      latitude: centerLat + Math.sin(angle) * radiusDeg + wobble,
      longitude: centerLng + Math.cos(angle) * radiusDeg,
      timestamp: start + i * 10_000,
      accuracy: 8 + Math.random() * 6,
      speed: 2.2 + Math.random() * 0.8,
    });
  }
  return route;
}

function buildDemoActivity(opts: {
  daysAgo: number;
  type: ActivityType;
  distanceKm: number;
  minutes: number;
  hour: number;
}): Activity {
  const started = new Date();
  started.setDate(started.getDate() - opts.daysAgo);
  started.setHours(opts.hour, 12, 0, 0);
  const startedAt = started.getTime();
  const duration = Math.round(opts.minutes * 60);
  const endedAt = startedAt + duration * 1000;
  const distance = opts.distanceKm * 1000;
  const averageSpeed = distance / duration;
  const averagePace = distance > 0 ? duration / (distance / 1000) : null;
  const steps = Math.round(distance * (opts.type === "run" ? 1.35 : 1.5));
  const route = synthesizeRoute(37.7775 - opts.daysAgo * 0.001, -122.4163 + opts.daysAgo * 0.0012, 24, 0.006 + opts.distanceKm * 0.0015);

  const paceSeries = Array.from({ length: 8 }, (_, i) => ({
    t: (duration / 7) * i,
    paceSecPerKm: averagePace ? averagePace + (Math.random() - 0.5) * 30 : null,
  }));
  const distanceSeries = Array.from({ length: 8 }, (_, i) => ({
    t: (duration / 7) * i,
    distanceMeters: (distance / 7) * i,
  }));

  return {
    id: `demo-${opts.daysAgo}-${opts.hour}`,
    type: opts.type,
    startedAt,
    endedAt,
    duration,
    distance,
    steps,
    stepsSource: "estimated",
    calories: estimateCalories(opts.type, duration, null),
    averagePace,
    averageSpeed,
    routePoints: route,
    paceSeries,
    distanceSeries,
    createdAt: startedAt,
    isDemo: true,
  };
}

export function generateDemoActivities(): Activity[] {
  return [
    buildDemoActivity({ daysAgo: 0, type: "run", distanceKm: 5.24, minutes: 34.35, hour: 7 }),
    buildDemoActivity({ daysAgo: 1, type: "walk", distanceKm: 2.8, minutes: 32, hour: 18 }),
    buildDemoActivity({ daysAgo: 2, type: "run", distanceKm: 8.1, minutes: 48, hour: 6 }),
    buildDemoActivity({ daysAgo: 3, type: "walk", distanceKm: 3.4, minutes: 40, hour: 12 }),
    buildDemoActivity({ daysAgo: 4, type: "run", distanceKm: 6.0, minutes: 37, hour: 7 }),
    buildDemoActivity({ daysAgo: 6, type: "run", distanceKm: 10.2, minutes: 58, hour: 8 }),
    buildDemoActivity({ daysAgo: 8, type: "walk", distanceKm: 4.1, minutes: 48, hour: 17 }),
    buildDemoActivity({ daysAgo: 10, type: "run", distanceKm: 5.6, minutes: 33, hour: 6 }),
  ];
}
