import { NextResponse } from "next/server";
import { z } from "zod";
import { AU_STATES } from "@/lib/application/schema";
import { getRegistrationLookupProvider } from "@/lib/registration/lookup";

const schema = z.object({
  registration: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{1,7}$/),
  state: z.enum(AU_STATES),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ status: "not_found", message: "Enter a valid registration and state." }, { status: 422 });
  }
  const provider = getRegistrationLookupProvider();
  const result = await provider.lookup(parsed.data);
  return NextResponse.json({ ...result, provider: provider.id });
}
