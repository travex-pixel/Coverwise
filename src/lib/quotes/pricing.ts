import type { Application } from "@/lib/application/schema";
import { estimateVehicleValue } from "@/lib/vehicles/data";

/* ------------------------------------------------------------------
   Demonstration pricing engine.

   Produces a plausible base premium from the standardised application.
   It is deliberately simple and transparent. Real premiums come from
   insurers; this exists so the demonstration journey behaves like a
   real comparison without inventing insurer prices.
------------------------------------------------------------------- */

export interface PricingBreakdown {
  vehicleValue: number;
  base: number;
  factors: { label: string; multiplier: number }[];
  premium: number;
}

export function postcodeZoneFactor(postcode: string) {
  const n = Number(postcode);
  // Very coarse metro/regional banding by postcode range.
  if (n >= 2000 && n <= 2249) return 1.12; // Sydney metro
  if (n >= 3000 && n <= 3207) return 1.1; // Melbourne metro
  if (n >= 4000 && n <= 4179) return 1.04; // Brisbane
  if (n >= 5000 && n <= 5199) return 0.98; // Adelaide
  if (n >= 6000 && n <= 6199) return 1.0; // Perth
  if (n >= 7000 && n <= 7099) return 0.9; // Hobart
  if (n >= 2600 && n <= 2618) return 0.96; // Canberra
  if (n >= 800 && n <= 899) return 1.05; // Darwin
  return 0.9; // Regional
}

export function computeBasePremium(app: Application, asOfYear: number): PricingBreakdown {
  const { vehicle, driver, usage, cover } = app;
  const vehicleValue = estimateVehicleValue(vehicle.make, vehicle.model, vehicle.year, asOfYear);

  // Base: ~1.9% of vehicle value with a floor, lightly sub-linear for expensive cars.
  const base = Math.max(520, 0.019 * Math.pow(vehicleValue, 0.985));

  const factors: { label: string; multiplier: number }[] = [];
  const push = (label: string, multiplier: number) => {
    if (Math.abs(multiplier - 1) > 0.001) factors.push({ label, multiplier });
  };

  // Driver age
  const age = driver.age;
  push(
    "Driver age",
    age < 21 ? 1.85 : age < 25 ? 1.5 : age < 30 ? 1.18 : age < 50 ? 1.0 : age < 70 ? 0.94 : 1.08,
  );
  push(
    "Licence type",
    { full: 1, p2: 1.15, p1: 1.3, learner: 1.25, international: 1.12 }[driver.licenceType],
  );
  push(
    "Years licensed",
    { "<1": 1.25, "1-2": 1.15, "3-5": 1.05, "6-10": 1.0, "10+": 0.96 }[driver.yearsLicensed],
  );
  push(
    "Claims history",
    driver.claims === "none" ? 0.92 : driver.claims === "one" ? (driver.claimsAtFault ? 1.22 : 1.08) : 1.45,
  );
  push(
    "Infringements",
    { none: 1, one: 1.06, two_plus: 1.18 }[driver.infringements],
  );
  if (driver.additionalDrivers !== "none") {
    const y = driver.youngestAdditionalDriverAge ?? 30;
    push("Additional drivers", y < 25 ? 1.35 : 1.06);
  }

  // Usage
  push("Garaging postcode", postcodeZoneFactor(usage.postcode));
  push(
    "Overnight parking",
    { garage: 0.94, carport: 0.98, driveway: 1.0, street: 1.08 }[usage.parking],
  );
  push(
    "Annual kilometres",
    { "<5000": 0.9, "5000-10000": 0.96, "10000-15000": 1.0, "15000-20000": 1.06, "20000+": 1.14 }[
      usage.annualKm
    ],
  );
  push("Vehicle use", { private: 1, commute: 1.03, business: 1.18 }[usage.use]);
  if (usage.security.length) push("Security features", Math.max(0.9, 1 - usage.security.length * 0.025));

  // Vehicle
  push(
    "Modifications",
    { none: 1, cosmetic: 1.04, performance: 1.25 }[vehicle.modifications],
  );

  // Cover
  push("Valuation basis", cover.valuation === "agreed" ? 1.05 : 1);
  push(
    "Preferred excess",
    { 500: 1.12, 750: 1.05, 1000: 1, 1500: 0.93, 2000: 0.87 }[cover.excess] ?? 1,
  );

  const premium = factors.reduce((acc, f) => acc * f.multiplier, base);
  return { vehicleValue, base: round(base), factors, premium: round(premium) };
}

function round(n: number) {
  return Math.round(n);
}

/** Deterministic 32-bit hash for stable synthetic variation. */
export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic pseudo-random in [0, 1) from a seed string. */
export function seededUnit(seed: string) {
  const h = hashString(seed);
  return (h % 10000) / 10000;
}

export function applicationFingerprint(app: Application) {
  const { vehicle, driver, usage, cover } = app;
  return [
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.variant,
    vehicle.modifications,
    driver.age,
    driver.licenceType,
    driver.yearsLicensed,
    driver.claims,
    driver.infringements,
    driver.additionalDrivers,
    usage.postcode,
    usage.parking,
    usage.annualKm,
    usage.use,
    usage.security.join("+"),
    cover.valuation,
    cover.excess,
    Object.entries(cover.extras)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("+"),
  ].join("|");
}
