import type { Application } from "./schema";

/**
 * Anonymised demonstration profile.
 * This is the journey that inspired the product: a 31-year-old renewing
 * comprehensive cover on a 2024 Subaru Forester 2.5i Premium in Sydney's
 * inner south, paying roughly $1,000 a year with Suncorp.
 *
 * It contains no real personal identifiers.
 */
export const DEMO_PROFILE: Application = {
  vehicle: {
    registration: "",
    state: "NSW",
    make: "Subaru",
    model: "Forester",
    year: 2024,
    variant: "2.5i Premium",
    modifications: "none",
    modificationsDetail: undefined,
  },
  driver: {
    age: 31,
    licenceType: "full",
    yearsLicensed: "10+",
    claims: "none",
    claimsAtFault: undefined,
    infringements: "none",
    additionalDrivers: "none",
    youngestAdditionalDriverAge: undefined,
    currentlyInsured: true,
    currentInsurer: "Suncorp",
    currentPremium: 1000,
  },
  usage: {
    postcode: "2205",
    parking: "garage",
    annualKm: "<5000",
    use: "private",
    security: ["immobiliser"],
  },
  cover: {
    coverType: "comprehensive",
    valuation: "agreed",
    excess: 1000,
    extras: {
      choiceOfRepairer: true,
      hireCar: false,
      windscreen: true,
      roadside: false,
    },
  },
};
