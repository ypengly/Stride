"use client";

import { useEffect, useRef } from "react";
import type { RoutePoint } from "@/lib/types";

// Leaflet touches `window` on import, so this component must only ever be
// loaded client-side via next/dynamic({ ssr: false }) from its parent.

let L: typeof import("leaflet") | null = null;

export function RouteMap({
  route,
  liveDot = false,
  className,
  minHeight = 220,
}: {
  route: RoutePoint[];
  liveDot?: boolean;
  className?: string;
  minHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const polylineRef = useRef<import("leaflet").Polyline | null>(null);
  const dotRef = useRef<import("leaflet").CircleMarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!L) {
        L = (await import("leaflet")).default;
      }
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([37.7775, -122.4163], 15);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      mapRef.current = map;
      polylineRef.current = L.polyline([], { color: "#3db2ff", weight: 4, opacity: 0.9 }).addTo(map);
      if (liveDot) {
        dotRef.current = L.circleMarker([0, 0], {
          radius: 7,
          color: "#ff6a3d",
          fillColor: "#ff6a3d",
          fillOpacity: 1,
          weight: 2,
        }).addTo(map);
      }
    }

    init();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !polylineRef.current || !L) return;
    const latLngs = route.map((p) => [p.latitude, p.longitude] as [number, number]);
    polylineRef.current.setLatLngs(latLngs);

    if (latLngs.length > 0) {
      const last = latLngs[latLngs.length - 1]!;
      if (liveDot && dotRef.current) {
        dotRef.current.setLatLng(last);
      }
      if (latLngs.length === 1) {
        mapRef.current.setView(last, 16);
      } else {
        mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [32, 32] });
      }
    }
  }, [route, liveDot]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Map of the tracked route"
      className={className}
      style={{ minHeight }}
    />
  );
}
