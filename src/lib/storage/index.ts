import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { ComparisonStore } from "./comparison-store";
import { memoryStore } from "./memory-store";
import { supabaseStore } from "./supabase-store";

export function getComparisonStore(): ComparisonStore {
  return isSupabaseConfigured() ? supabaseStore : memoryStore;
}

export type { ComparisonStore };
