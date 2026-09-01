"use client";

import { useCallback, useEffect, useState } from "react";
import type { Activity } from "@/lib/types";
import { localActivityStore, hasSeededDemoData, markDemoSeeded } from "@/lib/storage";
import { generateDemoActivities } from "@/lib/demoData";

/**
 * Reads/writes activities through the storage abstraction and seeds demo
 * data on first launch so the app never looks empty out of the box.
 */
export function useLocalActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setActivities(localActivityStore.list());
  }, []);

  useEffect(() => {
    if (!hasSeededDemoData()) {
      generateDemoActivities().forEach((a) => localActivityStore.save(a));
      markDemoSeeded();
    }
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const saveActivity = useCallback(
    (activity: Activity) => {
      localActivityStore.save(activity);
      refresh();
    },
    [refresh]
  );

  const removeActivity = useCallback(
    (id: string) => {
      localActivityStore.remove(id);
      refresh();
    },
    [refresh]
  );

  const clearDemoData = useCallback(() => {
    localActivityStore.clearDemo();
    refresh();
  }, [refresh]);

  const clearAllData = useCallback(() => {
    localActivityStore.clearAll();
    refresh();
  }, [refresh]);

  return { activities, isLoading, saveActivity, removeActivity, clearDemoData, clearAllData, refresh };
}
