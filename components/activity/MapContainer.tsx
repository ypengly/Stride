"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RoutePoint } from "@/lib/types";

const RouteMap = dynamic(() => import("./RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-[220px] w-full rounded-xl2" />,
});

export function MapContainer({
  route,
  liveDot,
  minHeight = 220,
  className = "h-full w-full overflow-hidden rounded-xl2 border border-line",
}: {
  route: RoutePoint[];
  liveDot?: boolean;
  minHeight?: number;
  className?: string;
}) {
  return <RouteMap route={route} liveDot={liveDot} minHeight={minHeight} className={className} />;
}
