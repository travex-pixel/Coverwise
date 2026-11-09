import type { ProviderResult } from "@/lib/providers/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { ComparisonStore } from "./comparison-store";

/* Supabase-backed store. Tables are defined in supabase/migrations.
   Row-level security denies all anon/authenticated access; only the
   service role (server) reads and writes. */

export const supabaseStore: ComparisonStore = {
  kind: "supabase",
  async create(record) {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("comparisons").insert({
      id: record.id,
      created_at: record.createdAt,
      mode: record.mode,
      application: record.application,
      providers: record.providers,
    });
    if (error) throw error;

    const consent = await sb.from("consent_records").insert({
      comparison_id: record.id,
      consented_at: record.consent.consentedAt,
      share_with_providers: record.consent.shareWithProviders,
      acknowledge_demonstration: record.consent.acknowledgeDemonstration,
      providers_shared: record.consent.providersShared,
    });
    if (consent.error) throw consent.error;

    const results = await sb.from("provider_responses").insert(
      record.results.map((r) => ({
        comparison_id: record.id,
        provider_id: r.providerId,
        status: r.status,
        attempt: r.attempt,
        received_at: r.receivedAt,
        payload: r,
      })),
    );
    if (results.error) throw results.error;
  },

  async get(id) {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("comparisons")
      .select("id, created_at, mode, application, providers, consent_records(*), provider_responses(payload)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const consent = Array.isArray(data.consent_records) ? data.consent_records[0] : data.consent_records;
    return {
      id: data.id,
      createdAt: data.created_at,
      mode: data.mode,
      application: data.application,
      providers: data.providers,
      consent: {
        consentedAt: consent?.consented_at,
        shareWithProviders: true,
        acknowledgeDemonstration: true,
        providersShared: consent?.providers_shared ?? [],
      },
      results: (data.provider_responses ?? []).map((r: { payload: ProviderResult }) => r.payload),
    };
  },

  async upsertResult(id, result) {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("provider_responses").upsert(
      {
        comparison_id: id,
        provider_id: result.providerId,
        status: result.status,
        attempt: result.attempt,
        received_at: result.receivedAt,
        payload: result,
      },
      { onConflict: "comparison_id,provider_id" },
    );
    if (error) throw error;
  },

  async delete(id) {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from("comparisons").delete().eq("id", id);
    if (error) throw error;
  },
};
