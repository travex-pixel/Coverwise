"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

const noop = () => () => {};

/** True once rendering on the client. False during server prerender. */
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Current calendar year, read on the client so the static shell stays prerenderable. */
export function useCurrentYear(fallback = 2026) {
  return useSyncExternalStore(noop, () => new Date().getFullYear(), () => fallback);
}
