"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGeolocationTracking } from "./useGeolocationTracking";
import { useStepCounter } from "./useStepCounter";
import type { Activity, ActivityType, TrackingSnapshot } from "@/lib/types";
import { estimateCalories } from "@/lib/calories";

export type TrackerPhase = "idle" | "tracking" | "paused" | "finished";

interface DistanceSample {
  t: number;
  distanceMeters: number;
}
interface PaceSample {
  t: number;
  paceSecPerKm: number | null;
}

const PACE_WINDOW_SECONDS = 30; // "current pace" is a trailing-window average

/**
 * Orchestrates GPS + step counting + the elapsed-time clock into one
 * activity session. This is the single source of truth the Live Activity
 * screen reads from — individual sensor hooks stay dumb and composable.
 */
export function useActivityTracker(activityType: ActivityType, weightKg: number | null) {
  const [phase, setPhase] = useState<TrackerPhase>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const geo = useGeolocationTracking();
  const steps = useStepCounter();

  const startTimeRef = useRef<number | null>(null);
  const accumulatedBeforePauseRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const distanceSeriesRef = useRef<DistanceSample[]>([]);
  const paceSeriesRef = useRef<PaceSample[]>([]);
  const lastDistanceForPaceRef = useRef({ t: 0, distance: 0 });

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    accumulatedBeforePauseRef.current = 0;
    distanceSeriesRef.current = [];
    paceSeriesRef.current = [];
    lastDistanceForPaceRef.current = { t: 0, distance: 0 };
    geo.reset();
    geo.start();
    steps.start();
    setPhase("tracking");

    clearTick();
    tickRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const secs =
        accumulatedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
      setElapsedSeconds(secs);
    }, 1000);
  }, [geo, steps]);

  const pause = useCallback(() => {
    if (startTimeRef.current) {
      accumulatedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      startTimeRef.current = null;
    }
    geo.pause();
    steps.pause();
    clearTick();
    setPhase("paused");
  }, [geo, steps]);

  const resume = useCallback(() => {
    startTimeRef.current = Date.now();
    geo.resume();
    steps.resume();
    setPhase("tracking");

    clearTick();
    tickRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const secs =
        accumulatedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
      setElapsedSeconds(secs);
    }, 1000);
  }, [geo, steps]);

  const finish = useCallback((): Activity => {
    if (startTimeRef.current) {
      accumulatedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      startTimeRef.current = null;
    }
    geo.stop();
    steps.stop();
    clearTick();
    setPhase("finished");

    const duration = Math.round(accumulatedBeforePauseRef.current);
    const distance = geo.state.totalDistanceMeters;
    const averageSpeed = duration > 0 ? distance / duration : 0;
    const averagePace = distance > 0 ? duration / (distance / 1000) : null;

    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: activityType,
      startedAt: Date.now() - duration * 1000,
      endedAt: Date.now(),
      duration,
      distance,
      steps: steps.state.steps,
      stepsSource: steps.state.permission === "denied" || steps.state.permission === "unavailable" ? "manual" : "sensor",
      calories: estimateCalories(activityType, duration, weightKg),
      averagePace,
      averageSpeed,
      routePoints: geo.state.route,
      paceSeries: paceSeriesRef.current,
      distanceSeries: distanceSeriesRef.current,
      createdAt: Date.now(),
    };

    return activity;
  }, [activityType, geo, steps, weightKg]);

  const reset = useCallback(() => {
    clearTick();
    startTimeRef.current = null;
    accumulatedBeforePauseRef.current = 0;
    setElapsedSeconds(0);
    geo.reset();
    steps.reset();
    setPhase("idle");
  }, [geo, steps]);

  // Sample distance/pace series roughly once per second of tracked time,
  // used to draw the "pace over time" / "distance over time" summary charts.
  useEffect(() => {
    if (phase !== "tracking") return;
    const distanceMeters = geo.state.totalDistanceMeters;
    distanceSeriesRef.current.push({ t: elapsedSeconds, distanceMeters });

    const last = lastDistanceForPaceRef.current;
    const dt = elapsedSeconds - last.t;
    if (dt >= PACE_WINDOW_SECONDS) {
      const dd = distanceMeters - last.distance;
      const paceSecPerKm = dd > 0 ? dt / (dd / 1000) : null;
      paceSeriesRef.current.push({ t: elapsedSeconds, paceSecPerKm });
      lastDistanceForPaceRef.current = { t: elapsedSeconds, distance: distanceMeters };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds]);

  useEffect(() => clearTick, []);

  const currentPace = (() => {
    const recent = paceSeriesRef.current[paceSeriesRef.current.length - 1];
    return recent ? recent.paceSecPerKm : null;
  })();

  const snapshot: TrackingSnapshot = {
    elapsedSeconds,
    distanceMeters: geo.state.totalDistanceMeters,
    steps: steps.state.steps,
    currentPaceSecPerKm: currentPace,
    averagePaceSecPerKm:
      geo.state.totalDistanceMeters > 0
        ? elapsedSeconds / (geo.state.totalDistanceMeters / 1000)
        : null,
    currentSpeedMs: geo.state.currentSpeedMs,
    averageSpeedMs: elapsedSeconds > 0 ? geo.state.totalDistanceMeters / elapsedSeconds : 0,
    calories: estimateCalories(activityType, elapsedSeconds, weightKg),
    accuracy: geo.state.accuracy,
    latitude: geo.state.latitude,
    longitude: geo.state.longitude,
    route: geo.state.route,
  };

  return {
    phase,
    snapshot,
    geoPermission: geo.state.permission,
    geoError: geo.state.error,
    motionPermission: steps.state.permission,
    motionSupported: steps.state.isSupported,
    start,
    pause,
    resume,
    finish,
    reset,
    setManualSteps: steps.setManualSteps,
  };
}
