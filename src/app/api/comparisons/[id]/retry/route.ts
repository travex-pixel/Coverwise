import { NextResponse } from "next/server";
import { z } from "zod";
import { applicationSchema } from "@/lib/application/schema";
import { retryProvider } from "@/lib/providers/orchestrator";
import { getComparisonStore } from "@/lib/storage";

const bodySchema = z.object({
  providerId: z.string().min(1).max(40),
  attempt: z.number().int().min(2).max(5),
  /** Fallback when the server has no persisted copy (memory store on serverless). */
  application: applicationSchema.optional(),
});

export async function POST(request: Request, ctx: RouteContext<"/api/comparisons/[id]/retry">) {
  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const store = getComparisonStore();
  const record = await store.get(id);
  const application = record?.application ?? parsed.data.application;
  if (!application) {
    return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
  }

  const result = await retryProvider({
    comparisonId: id,
    providerId: parsed.data.providerId,
    application,
    attempt: parsed.data.attempt,
  });
  if (!result) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

  if (record) {
    try {
      await store.upsertResult(id, result);
    } catch (err) {
      console.error("comparison_store_upsert_failed", { id, reason: err instanceof Error ? err.message : "unknown" });
    }
  }
  return NextResponse.json(result);
}
