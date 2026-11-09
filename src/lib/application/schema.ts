import { z } from "zod";

/* ------------------------------------------------------------------
   The standardised customer application. Every provider adapter
   receives exactly this shape, so the customer enters it once.
------------------------------------------------------------------- */

export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
export type AuState = (typeof AU_STATES)[number];

export function currentYear() {
  return new Date().getFullYear();
}

export const vehicleSchema = z.object({
  registration: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{0,7}$/, "Letters and numbers only (up to 7)")
    .default(""),
  state: z.enum(AU_STATES, { error: "Choose the state of registration" }),
  make: z.string().trim().min(1, "Choose a make"),
  model: z.string().trim().min(1, "Choose a model"),
  year: z.coerce
    .number({ error: "Choose a year" })
    .int()
    .min(1990, "We cover vehicles from 1990 onwards")
    .refine((y) => y <= currentYear() + 1, "That year is in the future"),
  variant: z.string().trim().min(1, "Choose or enter a variant").max(60),
  modifications: z.enum(["none", "cosmetic", "performance"], {
    error: "Tell us about modifications",
  }),
  modificationsDetail: z.string().trim().max(160).optional(),
});

export const LICENCE_TYPES = ["full", "p2", "p1", "learner", "international"] as const;
export const YEARS_LICENSED = ["<1", "1-2", "3-5", "6-10", "10+"] as const;
export const COUNT_BANDS = ["none", "one", "two_plus"] as const;

export const driverSchema = z
  .object({
    age: z.coerce
      .number({ error: "Enter the driver's age" })
      .int("Whole years only")
      .min(16, "Drivers must be at least 16")
      .max(99, "Please check the age"),
    licenceType: z.enum(LICENCE_TYPES, { error: "Choose a licence type" }),
    yearsLicensed: z.enum(YEARS_LICENSED, { error: "Choose how long you've held a licence" }),
    claims: z.enum(COUNT_BANDS, { error: "Tell us about claims in the last 5 years" }),
    claimsAtFault: z.boolean().optional(),
    infringements: z.enum(COUNT_BANDS, { error: "Tell us about infringements in the last 3 years" }),
    additionalDrivers: z.enum(COUNT_BANDS, { error: "Tell us about additional drivers" }),
    youngestAdditionalDriverAge: z.coerce.number().int().min(16).max(99).optional(),
    currentlyInsured: z.boolean({ error: "Tell us if the car is currently insured" }),
    currentInsurer: z.string().trim().max(60).optional(),
    currentPremium: z.coerce.number().min(0).max(20000).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.claims !== "none" && d.claimsAtFault === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["claimsAtFault"],
        message: "Was any claim at fault?",
      });
    }
    if (d.additionalDrivers !== "none" && d.youngestAdditionalDriverAge === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["youngestAdditionalDriverAge"],
        message: "Enter the youngest additional driver's age",
      });
    }
  });

export const PARKING = ["garage", "carport", "driveway", "street"] as const;
export const KM_BANDS = ["<5000", "5000-10000", "10000-15000", "15000-20000", "20000+"] as const;
export const USE_TYPES = ["private", "commute", "business"] as const;
export const SECURITY = ["immobiliser", "alarm", "tracker", "dashcam"] as const;

export const usageSchema = z.object({
  postcode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a 4-digit postcode")
    .refine((p) => {
      const n = Number(p);
      return n >= 200 && n <= 9999;
    }, "That doesn't look like an Australian postcode"),
  parking: z.enum(PARKING, { error: "Where is the car parked overnight?" }),
  annualKm: z.enum(KM_BANDS, { error: "Roughly how far do you drive each year?" }),
  use: z.enum(USE_TYPES, { error: "How is the car used?" }),
  security: z.array(z.enum(SECURITY)).default([]),
});

export const EXCESS_OPTIONS = [500, 750, 1000, 1500, 2000] as const;
export type ExcessOption = (typeof EXCESS_OPTIONS)[number];

export const coverSchema = z.object({
  coverType: z.literal("comprehensive"),
  valuation: z.enum(["agreed", "market"], { error: "Choose agreed or market value" }),
  excess: z.coerce
    .number()
    .refine((n): n is ExcessOption => (EXCESS_OPTIONS as readonly number[]).includes(n), {
      message: "Choose a preferred excess",
    }),
  extras: z.object({
    choiceOfRepairer: z.boolean().default(false),
    hireCar: z.boolean().default(false),
    windscreen: z.boolean().default(false),
    roadside: z.boolean().default(false),
  }),
});

export const applicationSchema = z.object({
  vehicle: vehicleSchema,
  driver: driverSchema,
  usage: usageSchema,
  cover: coverSchema,
});

export const consentSchema = z.object({
  shareWithProviders: z.literal(true, {
    error: "Consent is required before we share your details",
  }),
  acknowledgeDemonstration: z.literal(true, {
    error: "Please acknowledge that demonstration results are illustrative",
  }),
  consentedAt: z.string().datetime(),
});

export const submissionSchema = z.object({
  application: applicationSchema,
  consent: consentSchema,
});

export type VehicleInput = z.input<typeof vehicleSchema>;
export type Vehicle = z.output<typeof vehicleSchema>;
export type DriverInput = z.input<typeof driverSchema>;
export type Driver = z.output<typeof driverSchema>;
export type UsageInput = z.input<typeof usageSchema>;
export type Usage = z.output<typeof usageSchema>;
export type CoverInput = z.input<typeof coverSchema>;
export type Cover = z.output<typeof coverSchema>;
export type Application = z.output<typeof applicationSchema>;
export type Consent = z.output<typeof consentSchema>;
export type Submission = z.output<typeof submissionSchema>;

export const STEP_ORDER = ["vehicle", "driver", "usage", "cover", "review"] as const;
export type StepId = (typeof STEP_ORDER)[number];

export const STEP_META: Record<StepId, { label: string; title: string; path: string }> = {
  vehicle: { label: "Vehicle", title: "Let's start with your car.", path: "/compare/vehicle" },
  driver: { label: "Driver", title: "Who's behind the wheel?", path: "/compare/driver" },
  usage: { label: "Usage", title: "Where it lives, how it's driven.", path: "/compare/usage" },
  cover: { label: "Cover", title: "What matters most in your cover?", path: "/compare/cover" },
  review: { label: "Review", title: "Check, consent, compare.", path: "/compare/review" },
};
