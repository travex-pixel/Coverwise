import type { ComparisonRecord } from "@/lib/providers/orchestrator";
import type { ProviderResult } from "@/lib/providers/types";

/* Persistence contract for comparison sessions. */
export interface ComparisonStore {
  readonly kind: "memory" | "supabase";
  create(record: ComparisonRecord): Promise<void>;
  get(id: string): Promise<ComparisonRecord | null>;
  upsertResult(id: string, result: ProviderResult): Promise<void>;
  /** Hard-delete a comparison and everything attached to it. */
  delete(id: string): Promise<void>;
}
