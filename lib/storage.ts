import type { Activity, UserProfile } from "./types";

// A thin storage abstraction. Every read/write to persisted app data goes
// through this module so the LocalStorage implementation can be swapped
// for a Supabase-backed one later without touching any component or hook.

const ACTIVITIES_KEY = "stride:activities";
const PROFILE_KEY = "stride:profile";
const DEMO_SEEDED_KEY = "stride:demo-seeded";

export interface ActivityStore {
  list(): Activity[];
  get(id: string): Activity | null;
  save(activity: Activity): void;
  remove(id: string): void;
  clearDemo(): void;
  clearAll(): void;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export const localActivityStore: ActivityStore = {
  list() {
    if (!isBrowser()) return [];
    const activities = safeParse<Activity[]>(localStorage.getItem(ACTIVITIES_KEY), []);
    return activities.sort((a, b) => b.startedAt - a.startedAt);
  },
  get(id) {
    return this.list().find((a) => a.id === id) ?? null;
  },
  save(activity) {
    if (!isBrowser()) return;
    const activities = safeParse<Activity[]>(localStorage.getItem(ACTIVITIES_KEY), []);
    const next = [activity, ...activities.filter((a) => a.id !== activity.id)];
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(next));
  },
  remove(id) {
    if (!isBrowser()) return;
    const activities = safeParse<Activity[]>(localStorage.getItem(ACTIVITIES_KEY), []);
    localStorage.setItem(
      ACTIVITIES_KEY,
      JSON.stringify(activities.filter((a) => a.id !== id))
    );
  },
  clearDemo() {
    if (!isBrowser()) return;
    const activities = safeParse<Activity[]>(localStorage.getItem(ACTIVITIES_KEY), []);
    localStorage.setItem(
      ACTIVITIES_KEY,
      JSON.stringify(activities.filter((a) => !a.isDemo))
    );
  },
  clearAll() {
    if (!isBrowser()) return;
    localStorage.removeItem(ACTIVITIES_KEY);
    localStorage.removeItem(DEMO_SEEDED_KEY);
  },
};

export const DEFAULT_PROFILE: UserProfile = {
  displayName: "Athlete",
  weightKg: null,
  unit: "metric",
  theme: "dark",
};

export function loadProfile(): UserProfile {
  if (!isBrowser()) return DEFAULT_PROFILE;
  return { ...DEFAULT_PROFILE, ...safeParse<Partial<UserProfile>>(localStorage.getItem(PROFILE_KEY), {}) };
}

export function saveProfile(profile: UserProfile): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function hasSeededDemoData(): boolean {
  if (!isBrowser()) return true;
  return localStorage.getItem(DEMO_SEEDED_KEY) === "1";
}

export function markDemoSeeded(): void {
  if (!isBrowser()) return;
  localStorage.setItem(DEMO_SEEDED_KEY, "1");
}
