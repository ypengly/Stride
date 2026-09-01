"use client";

import { useCallback, useRef, useState } from "react";
import type { GeoPermissionState, RoutePoint } from "@/lib/types";
import { evaluateNextPoint } from "@/lib/distance";

export interface GeolocationTrackingState {
  permission: GeoPermissionState;
  isTracking: boolean;
  route: RoutePoint[];
  totalDistanceMeters: number;
  currentSpeedMs: number;
  accuracy: number | null;
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const initialState: GeolocationTrackingState = {
  permission: "unknown",
  isTracking: false,
  route: [],
  totalDistanceMeters: 0,
  currentSpeedMs: 0,
  accuracy: null,
  latitude: null,
  longitude: null,
  error: null,
};

/**
 * Wraps the browser Geolocation API's watchPosition into a small state
 * machine: request permission, accumulate a filtered route + distance,
 * and expose enough live data for the tracker UI.
 *
 * Kept deliberately separate from step counting and timing so each piece
 * of "what is the user doing right now" logic can be tested/reasoned
 * about on its own.
 */
export function useGeolocationTracking() {
  const [state, setState] = useState<GeolocationTrackingState>(initialState);
  const watchIdRef = useRef<number | null>(null);
  const lastAcceptedPointRef = useRef<RoutePoint | null>(null);
  const pausedRef = useRef(false);

  const handlePosition = useCallback((position: GeolocationPosition) => {
    if (pausedRef.current) return;

    const point: RoutePoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp,
      accuracy: position.coords.accuracy ?? null,
      speed: position.coords.speed ?? null,
    };

    const evaluation = evaluateNextPoint(lastAcceptedPointRef.current, point);

    setState((prev) => {
      if (!evaluation.accept) {
        // Poor-accuracy fixes are dropped entirely; we still surface the
        // accuracy number so the UI can warn the user.
        return {
          ...prev,
          accuracy: point.accuracy,
          latitude: point.latitude,
          longitude: point.longitude,
        };
      }

      lastAcceptedPointRef.current = point;
      const shouldAppend = evaluation.reason !== "jitter";
      const route = shouldAppend ? [...prev.route, point] : prev.route;

      return {
        ...prev,
        route,
        totalDistanceMeters: prev.totalDistanceMeters + evaluation.distanceDeltaM,
        currentSpeedMs: point.speed ?? prev.currentSpeedMs,
        accuracy: point.accuracy,
        latitude: point.latitude,
        longitude: point.longitude,
        error: null,
      };
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      permission: err.code === err.PERMISSION_DENIED ? "denied" : prev.permission,
      error:
        err.code === err.PERMISSION_DENIED
          ? "Location permission was denied."
          : err.code === err.POSITION_UNAVAILABLE
          ? "Your location is currently unavailable."
          : "Location request timed out.",
    }));
  }, []);

  const start = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState((prev) => ({ ...prev, permission: "unavailable", error: "This browser doesn't support GPS tracking." }));
      return;
    }

    pausedRef.current = false;
    lastAcceptedPointRef.current = null;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState((prev) => ({ ...prev, permission: "granted", isTracking: true }));
        handlePosition(position);
      },
      handleError,
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    );
  }, [handlePosition, handleError]);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    // Reset the "previous point" so the first fix after resuming never
    // gets counted as a giant jump across the paused gap.
    lastAcceptedPointRef.current = null;
    setState((prev) => ({ ...prev, isTracking: true }));
  }, []);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    pausedRef.current = true;
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  const reset = useCallback(() => {
    lastAcceptedPointRef.current = null;
    setState(initialState);
  }, []);

  return { state, start, pause, resume, stop, reset };
}
