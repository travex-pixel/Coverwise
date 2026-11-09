"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useIsClient } from "@/lib/hooks/use-media-query";
import { DEMO_PROFILE } from "./demo-profile";
import {
  STEP_ORDER,
  applicationSchema,
  coverSchema,
  driverSchema,
  usageSchema,
  vehicleSchema,
  type Application,
  type CoverInput,
  type DriverInput,
  type StepId,
  type UsageInput,
  type VehicleInput,
} from "./schema";

/* ------------------------------------------------------------------
   Client-side application draft.

   Lives in React state and mirrors to sessionStorage so a refresh or an
   accidental back-swipe never loses what the customer typed. Nothing is
   sent anywhere until the customer consents on the review step.
------------------------------------------------------------------- */

export interface ApplicationDraft {
  vehicle: Partial<VehicleInput>;
  driver: Partial<DriverInput>;
  usage: Partial<UsageInput>;
  cover: Partial<CoverInput>;
  /** Steps the customer has completed with valid data. */
  completed: StepId[];
  /** True when the draft was pre-filled from the demonstration profile. */
  demo: boolean;
}

const STORAGE_KEY = "coverwise.draft.v1";

const EMPTY: ApplicationDraft = {
  vehicle: { registration: "", modifications: undefined },
  driver: {},
  usage: { security: [] },
  cover: { coverType: "comprehensive", excess: 1000, extras: { choiceOfRepairer: false, hireCar: false, windscreen: false, roadside: false } },
  completed: [],
  demo: false,
};

type Action =
  | { type: "hydrate"; draft: ApplicationDraft }
  | { type: "set"; step: Exclude<StepId, "review">; data: Partial<VehicleInput | DriverInput | UsageInput | CoverInput> }
  | { type: "complete"; step: Exclude<StepId, "review"> }
  | { type: "loadDemo" }
  | { type: "reset" };

function reducer(state: ApplicationDraft, action: Action): ApplicationDraft {
  switch (action.type) {
    case "hydrate":
      return action.draft;
    case "set":
      return { ...state, [action.step]: { ...state[action.step], ...action.data } };
    case "complete":
      return state.completed.includes(action.step)
        ? state
        : { ...state, completed: [...state.completed, action.step] };
    case "loadDemo":
      return {
        vehicle: { ...DEMO_PROFILE.vehicle },
        driver: { ...DEMO_PROFILE.driver },
        usage: { ...DEMO_PROFILE.usage },
        cover: { ...DEMO_PROFILE.cover },
        completed: ["vehicle", "driver", "usage", "cover"],
        demo: true,
      };
    case "reset":
      return EMPTY;
  }
}

interface ApplicationContextValue {
  draft: ApplicationDraft;
  hydrated: boolean;
  setStep: <S extends Exclude<StepId, "review">>(step: S, data: ApplicationDraft[S]) => void;
  completeStep: (step: Exclude<StepId, "review">) => void;
  loadDemo: () => void;
  reset: () => void;
  /** Validated application if every step is complete, else null. */
  application: Application | null;
  stepValidity: Record<Exclude<StepId, "review">, boolean>;
  nextIncompleteStep: StepId;
}

const ApplicationContext = React.createContext<ApplicationContextValue | null>(null);

function readStorage(): ApplicationDraft | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApplicationDraft;
    return { ...EMPTY, ...parsed, cover: { ...EMPTY.cover, ...parsed.cover } };
  } catch {
    return null;
  }
}

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [draft, dispatch] = React.useReducer(reducer, EMPTY);
  const hydrated = useIsClient();
  const loaded = React.useRef(false);

  React.useEffect(() => {
    const stored = readStorage();
    if (stored) dispatch({ type: "hydrate", draft: stored });
    loaded.current = true;
  }, []);

  React.useEffect(() => {
    if (!hydrated || !loaded.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable: the draft still lives in memory */
    }
  }, [draft, hydrated]);

  const stepValidity = React.useMemo(
    () => ({
      vehicle: vehicleSchema.safeParse(draft.vehicle).success,
      driver: driverSchema.safeParse(draft.driver).success,
      usage: usageSchema.safeParse(draft.usage).success,
      cover: coverSchema.safeParse(draft.cover).success,
    }),
    [draft],
  );

  const application = React.useMemo(() => {
    const parsed = applicationSchema.safeParse({
      vehicle: draft.vehicle,
      driver: draft.driver,
      usage: draft.usage,
      cover: draft.cover,
    });
    return parsed.success ? parsed.data : null;
  }, [draft]);

  const nextIncompleteStep = React.useMemo<StepId>(() => {
    for (const step of STEP_ORDER) {
      if (step === "review") return "review";
      if (!stepValidity[step]) return step;
    }
    return "review";
  }, [stepValidity]);

  const value = React.useMemo<ApplicationContextValue>(
    () => ({
      draft,
      hydrated,
      setStep: (step, data) => dispatch({ type: "set", step, data }),
      completeStep: (step) => dispatch({ type: "complete", step }),
      loadDemo: () => dispatch({ type: "loadDemo" }),
      reset: () => {
        dispatch({ type: "reset" });
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      },
      application,
      stepValidity,
      nextIncompleteStep,
    }),
    [draft, hydrated, application, stepValidity, nextIncompleteStep],
  );

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplication() {
  const ctx = React.useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplication must be used within ApplicationProvider");
  return ctx;
}

/** Navigate to the next step in order. */
export function useStepNavigation(current: StepId) {
  const router = useRouter();
  const index = STEP_ORDER.indexOf(current);
  const prev = index > 0 ? STEP_ORDER[index - 1] : null;
  const next = index < STEP_ORDER.length - 1 ? STEP_ORDER[index + 1] : null;
  return {
    index,
    prev,
    next,
    goNext: () => next && router.push(`/compare/${next}`),
    goPrev: () => (prev ? router.push(`/compare/${prev}`) : router.push("/")),
    goTo: (step: StepId) => router.push(`/compare/${step}`),
  };
}
