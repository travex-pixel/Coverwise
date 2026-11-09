import type { Metadata } from "next";
import { CoverStep } from "@/components/compare/cover-step";

export const metadata: Metadata = { title: "Cover" };

export default function CoverPage() {
  return <CoverStep />;
}
