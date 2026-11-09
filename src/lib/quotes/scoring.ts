import type { Quote, QuoteExtras } from "@/lib/providers/types";

/* Coverage breadth score (0–100). Computed by Coverwise from the normalised
   policy features so customers can compare more than price. */
export function coverageScore(input: {
  valuation: "agreed" | "market";
  excess: number;
  inclusions: string[];
  extras: QuoteExtras;
}) {
  let score = 40;
  score += input.valuation === "agreed" ? 10 : 4;
  score += Math.max(0, 12 - (input.excess - 500) / 150); // lower excess, more points
  score += Math.min(18, input.inclusions.length * 2.5);
  const weights: Record<keyof QuoteExtras, number> = {
    choiceOfRepairer: 7,
    hireCar: 6,
    windscreen: 4,
    roadside: 3,
  };
  for (const key of Object.keys(weights) as (keyof QuoteExtras)[]) {
    const v = input.extras[key];
    score += v === "included" ? weights[key] : v === "optional" ? weights[key] * 0.35 : 0;
  }
  return Math.round(Math.max(0, Math.min(100, score)));
}

export type SortKey = "cheapest" | "coverage" | "excess" | "value";

export const SORT_LABELS: Record<SortKey, string> = {
  value: "Best overall value",
  cheapest: "Cheapest premium",
  coverage: "Best coverage",
  excess: "Lowest excess",
};

export function valueIndex(q: Quote, minPremium: number, maxPremium: number) {
  const spread = Math.max(1, maxPremium - minPremium);
  const priceScore = 100 - ((q.annualPremium - minPremium) / spread) * 100; // 100 = cheapest
  return priceScore * 0.55 + q.coverageScore * 0.45;
}

export function sortQuotes<T extends { quote: Quote }>(items: T[], key: SortKey): T[] {
  const premiums = items.map((i) => i.quote.annualPremium);
  const min = Math.min(...premiums);
  const max = Math.max(...premiums);
  const copy = [...items];
  switch (key) {
    case "cheapest":
      return copy.sort((a, b) => a.quote.annualPremium - b.quote.annualPremium);
    case "coverage":
      return copy.sort(
        (a, b) =>
          b.quote.coverageScore - a.quote.coverageScore || a.quote.annualPremium - b.quote.annualPremium,
      );
    case "excess":
      return copy.sort((a, b) => a.quote.excess - b.quote.excess || a.quote.annualPremium - b.quote.annualPremium);
    case "value":
    default:
      return copy.sort((a, b) => valueIndex(b.quote, min, max) - valueIndex(a.quote, min, max));
  }
}
