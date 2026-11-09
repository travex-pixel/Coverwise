import type { Metadata } from "next";
import { ReviewStep } from "@/components/compare/review-step";

export const metadata: Metadata = { title: "Review and consent" };

export default function ReviewPage() {
  return <ReviewStep />;
}
