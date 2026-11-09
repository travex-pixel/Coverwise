import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/application/schema";
import { runComparison } from "@/lib/providers/orchestrator";
import { getComparisonStore } from "@/lib/storage";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) },
      { status: 422 },
    );
  }

  const { application, consent } = parsed.data;
  // Consent must be recorded before any provider receives personal information.
  if (consent.shareWithProviders !== true) {
    return NextResponse.json({ error: "Consent required" }, { status: 403 });
  }

  const id = crypto.randomUUID();
  const record = await runComparison({ id, application, consent });

  try {
    await getComparisonStore().create(record);
  } catch (err) {
    // Persistence failure should not lose the customer's results; log without PII.
    console.error("comparison_store_create_failed", { id, reason: err instanceof Error ? err.message : "unknown" });
  }

  return NextResponse.json(record, { status: 201 });
}
