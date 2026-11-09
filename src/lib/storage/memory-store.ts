import type { ComparisonRecord } from "@/lib/providers/orchestrator";
import type { ProviderResult } from "@/lib/providers/types";
import type { ComparisonStore } from "./comparison-store";

/* In-memory store for local development and environments without Supabase.
   Serverless instances do not share memory, so the client also keeps a
   session-scoped copy of its own comparison. */

const globalStore = globalThis as unknown as { __coverwiseComparisons?: Map<string, ComparisonRecord> };
const map = (globalStore.__coverwiseComparisons ??= new Map());

const TTL_MS = 1000 * 60 * 60 * 6;

export const memoryStore: ComparisonStore = {
  kind: "memory",
  async create(record) {
    map.set(record.id, record);
    // Opportunistic cleanup of stale sessions.
    const cutoff = Date.now() - TTL_MS;
    for (const [id, r] of map) {
      if (new Date(r.createdAt).getTime() < cutoff) map.delete(id);
    }
  },
  async get(id) {
    return map.get(id) ?? null;
  },
  async upsertResult(id, result) {
    const record = map.get(id);
    if (!record) return;
    const idx = record.results.findIndex((r: ProviderResult) => r.providerId === result.providerId);
    if (idx >= 0) record.results[idx] = result;
    else record.results.push(result);
  },
  async delete(id) {
    map.delete(id);
  },
};
