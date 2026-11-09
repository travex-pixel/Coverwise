import type { Metadata } from "next";
import { UsageStep } from "@/components/compare/usage-step";

export const metadata: Metadata = { title: "Usage" };

export default function UsagePage() {
  return <UsageStep />;
}
