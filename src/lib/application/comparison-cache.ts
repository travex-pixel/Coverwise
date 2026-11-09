"use client";

import { useSyncExternalStore } from "react";
import type { ComparisonRecord } from "@/lib/providers/orchestrator";

/* Session-scoped cache of comparison results, exposed as an external store
   so React components can subscribe without effects. Lives in
   sessionStorage so a refresh keeps the results and closing the tab
   discards them. */

const RESULT_PREFIX = "coverwise.comparison.";
const SEEN_PREFIX = "coverwise.seen.";

const listeners = new Set<() => void>();
const parsed = new Map<string, { raw: string; value: ComparisonRecord }>();

function notify() {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function read(id: string): ComparisonRecord | null {
  try {
    const raw = window.sessionStorage.getItem(RESULT_PREFIX + id);
    if (!raw) return null;
    const hit = parsed.get(id);
    if (hit && hit.raw === raw) return hit.value;
    const value = JSON.parse(raw) as ComparisonRecord;
    parsed.set(id, { raw, value });
    return value;
  } catch {
    return null;
  }
}

export function cacheComparison(record: ComparisonRecord) {
  try {
    window.sessionStorage.setItem(RESULT_PREFIX + record.id, JSON.stringify(record));
  } catch {
    parsed.set(record.id, { raw: "", value: record });
  }
  notify();
}

export function forgetComparison(id: string) {
  try {
    window.sessionStorage.removeItem(RESULT_PREFIX + id);
    window.sessionStorage.removeItem(SEEN_PREFIX + id);
  } catch {
    /* ignore */
  }
  parsed.delete(id);
  notify();
}

export function markComparisonSeen(id: string) {
  try {
    window.sessionStorage.setItem(SEEN_PREFIX + id, "1");
  } catch {
    /* ignore */
  }
  notify();
}

function readSeen(id: string) {
  try {
    return window.sessionStorage.getItem(SEEN_PREFIX + id) === "1";
  } catch {
    return true;
  }
}

export function useCachedComparison(id: string) {
  return useSyncExternalStore(subscribe, () => read(id), () => null);
}

export function useComparisonSeen(id: string) {
  return useSyncExternalStore(subscribe, () => readSeen(id), () => true);
}
