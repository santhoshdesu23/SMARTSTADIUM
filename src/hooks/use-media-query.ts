"use client";

import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onChange);

  return () => mediaQueryList.removeEventListener("change", onChange);
}

function getMediaQuerySnapshot(query: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery(query, onStoreChange),
    () => getMediaQuerySnapshot(query),
    () => false
  );
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}
