"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionPermissionState } from "@/lib/types";

// --- Step detection ------------------------------------------------------
// There is no reliable "give me a step count" API on the web, so we derive
// steps from the device's accelerometer via DeviceMotion events. The
// approach is a classic peak-detection algorithm:
//
//   1. Take the magnitude of the 3-axis acceleration vector (so device
//      orientation doesn't matter as much).
//   2. Smooth it with a small moving average to remove high-frequency
//      sensor noise.
//   3. Track the running mean ("dynamic baseline") of that smoothed
//      signal so the detector adapts to how the phone is being carried.
//   4. Count a "step" whenever the signal crosses above
//      (baseline + threshold) and then back down, provided enough time
//      has passed since the last counted step (a refractory period).
//
// This is a reasonable approximation, not a clinical-grade pedometer —
// we say so explicitly in the UI. It will under/over-count on rough
// terrain, in a pocket vs. in hand, etc.

const SMOOTHING_WINDOW = 6;
const PEAK_THRESHOLD = 1.15; // m/s^2 above the rolling baseline
const MIN_STEP_INTERVAL_MS = 250; // ~240 steps/min ceiling, filters false doubles
const BASELINE_SMOOTHING = 0.05;

export interface StepCounterState {
  permission: MotionPermissionState;
  steps: number;
  isSupported: boolean;
}

export function useStepCounter() {
  const [state, setState] = useState<StepCounterState>({
    permission: "unknown",
    steps: 0,
    isSupported: true,
  });

  const activeRef = useRef(false);
  const bufferRef = useRef<number[]>([]);
  const baselineRef = useRef<number | null>(null);
  const risingRef = useRef(false);
  const lastStepAtRef = useRef(0);
  const stepsRef = useRef(0);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    if (!activeRef.current) return;
    const acc = event.accelerationIncludingGravity ?? event.acceleration;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

    const buffer = bufferRef.current;
    buffer.push(magnitude);
    if (buffer.length > SMOOTHING_WINDOW) buffer.shift();
    const smoothed = buffer.reduce((a, b) => a + b, 0) / buffer.length;

    if (baselineRef.current === null) {
      baselineRef.current = smoothed;
      return;
    }
    baselineRef.current =
      baselineRef.current * (1 - BASELINE_SMOOTHING) + smoothed * BASELINE_SMOOTHING;

    const delta = smoothed - baselineRef.current;
    const now = Date.now();

    if (!risingRef.current && delta > PEAK_THRESHOLD) {
      risingRef.current = true;
      if (now - lastStepAtRef.current > MIN_STEP_INTERVAL_MS) {
        lastStepAtRef.current = now;
        stepsRef.current += 1;
        setState((prev) => ({ ...prev, steps: stepsRef.current }));
      }
    } else if (risingRef.current && delta < PEAK_THRESHOLD * 0.3) {
      risingRef.current = false;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      setState((prev) => ({ ...prev, permission: "unavailable", isSupported: false }));
      return "unavailable" as MotionPermissionState;
    }

    const DeviceMotionEventTyped = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof DeviceMotionEventTyped.requestPermission === "function") {
      try {
        const result = await DeviceMotionEventTyped.requestPermission();
        setState((prev) => ({ ...prev, permission: result }));
        return result as MotionPermissionState;
      } catch {
        setState((prev) => ({ ...prev, permission: "denied" }));
        return "denied" as MotionPermissionState;
      }
    }

    // Most non-iOS browsers don't require explicit permission.
    setState((prev) => ({ ...prev, permission: "not-required" }));
    return "not-required" as MotionPermissionState;
  }, []);

  const start = useCallback(async () => {
    const permission = await requestPermission();
    if (permission === "denied" || permission === "unavailable") return;

    activeRef.current = true;
    bufferRef.current = [];
    baselineRef.current = null;
    risingRef.current = false;
    window.addEventListener("devicemotion", handleMotion);
  }, [handleMotion, requestPermission]);

  const pause = useCallback(() => {
    activeRef.current = false;
  }, []);

  const resume = useCallback(() => {
    activeRef.current = true;
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (typeof window !== "undefined") {
      window.removeEventListener("devicemotion", handleMotion);
    }
  }, [handleMotion]);

  const setManualSteps = useCallback((n: number) => {
    stepsRef.current = n;
    setState((prev) => ({ ...prev, steps: n }));
  }, []);

  const reset = useCallback(() => {
    stepsRef.current = 0;
    bufferRef.current = [];
    baselineRef.current = null;
    setState({ permission: "unknown", steps: 0, isSupported: true });
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devicemotion", handleMotion);
      }
    };
  }, [handleMotion]);

  return { state, start, pause, resume, stop, reset, setManualSteps };
}
