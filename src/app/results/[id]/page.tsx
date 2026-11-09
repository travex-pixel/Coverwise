import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultsSkeleton, ResultsView } from "@/components/results/results-view";

export const metadata: Metadata = { title: "Your comparison", robots: { index: false } };

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultsView />
    </Suspense>
  );
}
