import { NextResponse } from "next/server";
import { getComparisonStore } from "@/lib/storage";

export async function GET(_request: Request, ctx: RouteContext<"/api/comparisons/[id]">) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const record = await getComparisonStore().get(id);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/comparisons/[id]">) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await getComparisonStore().delete(id);
  return new NextResponse(null, { status: 204 });
}
