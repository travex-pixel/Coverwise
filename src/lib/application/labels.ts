import type {
  Application,
} from "./schema";

/* Human-readable labels for enum values, shared by forms, review and results. */

export const LICENCE_LABELS: Record<Application["driver"]["licenceType"], string> = {
  full: "Full (open)",
  p2: "Provisional P2",
  p1: "Provisional P1",
  learner: "Learner",
  international: "International",
};

export const YEARS_LICENSED_LABELS: Record<Application["driver"]["yearsLicensed"], string> = {
  "<1": "Under 1 year",
  "1-2": "1–2 years",
  "3-5": "3–5 years",
  "6-10": "6–10 years",
  "10+": "10+ years",
};

export const COUNT_LABELS: Record<Application["driver"]["claims"], string> = {
  none: "None",
  one: "One",
  two_plus: "Two or more",
};

export const PARKING_LABELS: Record<Application["usage"]["parking"], string> = {
  garage: "Garage",
  carport: "Carport",
  driveway: "Driveway",
  street: "Street",
};

export const KM_LABELS: Record<Application["usage"]["annualKm"], string> = {
  "<5000": "Under 5,000 km",
  "5000-10000": "5,000–10,000 km",
  "10000-15000": "10,000–15,000 km",
  "15000-20000": "15,000–20,000 km",
  "20000+": "Over 20,000 km",
};

export const USE_LABELS: Record<Application["usage"]["use"], string> = {
  private: "Private only",
  commute: "Private and commuting",
  business: "Business use",
};

export const SECURITY_LABELS: Record<Application["usage"]["security"][number], string> = {
  immobiliser: "Immobiliser",
  alarm: "Alarm",
  tracker: "GPS tracker",
  dashcam: "Dash cam",
};

export const MODIFICATION_LABELS: Record<Application["vehicle"]["modifications"], string> = {
  none: "No modifications",
  cosmetic: "Cosmetic only",
  performance: "Performance",
};

export const VALUATION_LABELS: Record<Application["cover"]["valuation"], string> = {
  agreed: "Agreed value",
  market: "Market value",
};

export const EXTRA_LABELS: Record<keyof Application["cover"]["extras"], string> = {
  choiceOfRepairer: "Choice of repairer",
  hireCar: "Hire car after any incident",
  windscreen: "Windscreen excess waiver",
  roadside: "Roadside assistance",
};

export const CURRENT_INSURERS = [
  "AAMI",
  "Allianz",
  "Bingle",
  "Budget Direct",
  "GIO",
  "NRMA Insurance",
  "QBE",
  "RACQ",
  "RACV",
  "Suncorp",
  "Youi",
  "Other",
] as const;

export function vehicleTitle(v: Application["vehicle"]) {
  return `${v.year} ${v.make} ${v.model} ${v.variant}`.replace(/\s+/g, " ").trim();
}
