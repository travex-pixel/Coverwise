/**
 * Coverwise runs in one of two modes:
 *  - "demo": fictional providers return synthetic, clearly labelled results.
 *  - "live": only adapters with configured credentials are connected.
 * Demo is the default until commercial, regulatory and privacy foundations
 * are in place for real distribution.
 */
export type CoverwiseMode = "demo" | "live";

export function getMode(): CoverwiseMode {
  return process.env.COVERWISE_MODE === "live" ? "live" : "demo";
}

export function isDemoMode() {
  return getMode() === "demo";
}
