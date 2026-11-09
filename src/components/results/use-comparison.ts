"use client";

import * as React from "react";
import {
  cacheComparison,
  forgetComparison,
  markComparisonSeen,
  useCachedComparison,
  useComparisonSeen,
} from "@/lib/application/comparison-cache";
import type { ComparisonRecord } from "@/lib/providers/orchestrator";
import type { ProviderResult } from "@/lib/providers/types";

type State =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; record: ComparisonRecord; fresh: boolean };

export function useComparison(id: string) {
  const cached = useCachedComparison(id);
  const seen = useComparisonSeen(id);
  const [fetchStatus, setFetchStatus] = React.useState<"idle" | "missing">("idle");
  const [retrying, setRetrying] = React.useState<Set<string>>(new Set());

  // Only reach for the server when this tab has no copy (e.g. a shared link
  // with Supabase persistence configured).
  React.useEffect(() => {
    if (cached) return;
    let cancelled = false;
    fetch(`/api/comparisons/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        const record = (await res.json()) as ComparisonRecord;
        if (!cancelled) cacheComparison(record);
      })
      .catch(() => {
        if (!cancelled) setFetchStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [id, cached]);

  const state: State = cached
    ? { status: "ready", record: cached, fresh: !seen }
    : fetchStatus === "missing"
      ? { status: "missing" }
      : { status: "loading" };

  const markSeen = React.useCallback(() => markComparisonSeen(id), [id]);

  const retry = React.useCallback(
    async (providerId: string) => {
      if (!cached) return;
      const current = cached.results.find((r) => r.providerId === providerId);
      if (!current) return;
      setRetrying((s) => new Set(s).add(providerId));
      try {
        const res = await fetch(`/api/comparisons/${id}/retry`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ providerId, attempt: current.attempt + 1, application: cached.application }),
        });
        if (!res.ok) throw new Error("retry failed");
        const result = (await res.json()) as ProviderResult;
        // A brief visible "quoting" state so the change reads clearly.
        await new Promise((r) => setTimeout(r, 900));
        cacheComparison({
          ...cached,
          results: cached.results.map((r) => (r.providerId === providerId ? result : r)),
        });
      } finally {
        setRetrying((s) => {
          const next = new Set(s);
          next.delete(providerId);
          return next;
        });
      }
    },
    [id, cached],
  );

  const remove = React.useCallback(async () => {
    await fetch(`/api/comparisons/${id}`, { method: "DELETE" }).catch(() => null);
    forgetComparison(id);
    try {
      window.sessionStorage.removeItem("coverwise.draft.v1");
    } catch {
      /* ignore */
    }
  }, [id]);

  return { state, retry, retrying, remove, markSeen };
}
