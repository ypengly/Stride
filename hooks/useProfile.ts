"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";
import { DEFAULT_PROFILE, loadProfile, saveProfile } from "@/lib/storage";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setIsLoaded(true);
  }, []);

  const update = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
  }, []);

  return { profile, updateProfile: update, isLoaded };
}
