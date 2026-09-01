# Stride

A mobile-first fitness tracker for walking and running: live GPS routes, pace,
speed, and browser-based step counting, with activity history and stats.

Built with Next.js (App Router) + TypeScript + Tailwind CSS + Leaflet + Recharts.
Activities persist to LocalStorage behind a small storage abstraction
(`lib/storage.ts`) so a Supabase-backed store can be swapped in later without
touching any component.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. For GPS and motion sensors to work you'll
need to open the app over `https://` or `localhost` (browsers block both APIs
on plain `http://`), and grant location + motion permission when prompted.
Step detection and background GPS both depend on browser support — see
"Known browser limitations" below.

To build for production:

```bash
npm run build
npm run start
```

## Project structure

```
app/                  Routes (App Router)
  page.tsx              Dashboard
  activity/live/        Live activity tracker
  activity/summary/     Post-activity summary (reads a draft from sessionStorage)
  history/               Activity history list + [id] detail
  stats/                 Statistics dashboard
  profile/               Profile + local data controls
components/
  ui/                    Design-system primitives (Button, Card, StatCard, Trace, ...)
  activity/              Tracker-specific UI (stat grid, map, controls, banners)
  dashboard/, charts/, nav/, toast/
hooks/
  useGeolocationTracking.ts   Wraps watchPosition, filters noisy/implausible fixes
  useStepCounter.ts           Accelerometer-based step detection (peak detection)
  useActivityTracker.ts       Orchestrates GPS + steps + timer into one session
  useLocalActivities.ts       Reads/writes activities, seeds demo data once
  useProfile.ts               Display name, units, weight (for calorie estimate)
lib/
  types.ts, distance.ts, format.ts, calories.ts, storage.ts, streak.ts,
  analytics.ts, demoData.ts
```

## Design notes

- Dark-mode-only, built around three accent colors: **ember** (`#ff6a3d`,
  actions/pace), **signal** (`#3db2ff`, GPS/route/distance), and **mint**
  (`#5ee6a8`, streaks/positive states).
- Type system: Space Grotesk (display/UI), Manrope (body), JetBrains Mono
  (stat numbers — tabular figures, watch-readout feel).
- Signature element: "the Trace," a hand-drawn GPS-style line used in the
  logo, as a section flourish, and in empty/error states.

## Known browser limitations (by design, and surfaced in the UI)

- **Step detection** uses `DeviceMotionEvent` peak detection — a reasonable
  approximation, not a clinical pedometer. It requires an explicit permission
  prompt on iOS Safari, and isn't available on desktop browsers or when the
  page loses focus. Manual step entry is offered as a fallback in the
  activity summary whenever sensor data wasn't available.
- **Calorie estimates** are a simple MET-based calculation, clearly labeled
  as an estimate everywhere they appear.
- **GPS tracking** only runs while the tab is open and in the foreground;
  locking the phone or switching apps pauses tracking. The live tracker
  shows a persistent notice about this.
- GPS fixes with poor accuracy (>35m) are discarded, and implausible jumps
  (implied speed >~45 km/h) are ignored so distance doesn't inflate from
  noisy fixes — see `lib/distance.ts`.

## What's not included yet (by design, per the brief)

No auth, no social features (followers, leaderboards, messaging). The data
model and storage layer are intentionally structured so those and a Supabase
backend can be layered on without a rewrite.
