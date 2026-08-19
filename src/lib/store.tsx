"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { buildDemoEntries } from "./demo";
import {
  DEFAULT_GOALS,
  MEAL_TYPES,
  type AppState,
  type Entry,
  type Goals,
  type MealType,
} from "./types";

const STORAGE_KEY = "eatmore:state:v1";
const STATE_VERSION = 1;

const INITIAL_STATE: AppState = {
  version: STATE_VERSION,
  name: "",
  goals: DEFAULT_GOALS,
  entries: [],
};

export interface NewEntryInput {
  dateKey: string;
  meal: MealType;
  name: string;
  emoji: string;
  serving: string;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

type Action =
  | { type: "replace"; state: AppState }
  | { type: "addEntry"; entry: Entry }
  | { type: "updateEntry"; id: string; patch: Partial<Entry> }
  | { type: "deleteEntry"; id: string }
  | { type: "setGoals"; goals: Partial<Goals> }
  | { type: "setName"; name: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "replace":
      return action.state;

    case "addEntry":
      return { ...state, entries: [...state.entries, action.entry] };

    case "updateEntry":
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.id ? { ...entry, ...action.patch } : entry,
        ),
      };

    case "deleteEntry":
      return { ...state, entries: state.entries.filter((entry) => entry.id !== action.id) };

    case "setGoals":
      return { ...state, goals: { ...state.goals, ...action.goals } };

    case "setName":
      return { ...state, name: action.name };
  }
}

/* -------------------------------------------------------------------------- */
/* Persistence                                                                */
/* -------------------------------------------------------------------------- */

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isMeal = (value: unknown): value is MealType =>
  typeof value === "string" && (MEAL_TYPES as readonly string[]).includes(value);

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Anything in `localStorage` is untrusted input: a half-written value or an
 * older shape must not take the whole app down, so each entry is validated and
 * bad ones are dropped.
 */
function parseEntry(value: unknown): Entry | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  if (typeof raw.id !== "string" || typeof raw.name !== "string") return null;
  if (typeof raw.dateKey !== "string" || !DATE_KEY_PATTERN.test(raw.dateKey)) return null;
  if (!isMeal(raw.meal)) return null;
  if (!isNumber(raw.kcal) || !isNumber(raw.servings) || raw.servings <= 0) return null;

  return {
    id: raw.id,
    dateKey: raw.dateKey,
    meal: raw.meal,
    name: raw.name,
    emoji: typeof raw.emoji === "string" ? raw.emoji : "🍽️",
    serving: typeof raw.serving === "string" ? raw.serving : "1 serving",
    servings: raw.servings,
    kcal: Math.max(0, raw.kcal),
    protein: isNumber(raw.protein) ? Math.max(0, raw.protein) : 0,
    carbs: isNumber(raw.carbs) ? Math.max(0, raw.carbs) : 0,
    fat: isNumber(raw.fat) ? Math.max(0, raw.fat) : 0,
    createdAt: isNumber(raw.createdAt) ? raw.createdAt : Date.now(),
  };
}

function parseGoals(value: unknown): Goals {
  if (typeof value !== "object" || value === null) return DEFAULT_GOALS;
  const raw = value as Record<string, unknown>;

  return {
    calories: isNumber(raw.calories) ? clampCalories(raw.calories) : DEFAULT_GOALS.calories,
    proteinPct: isNumber(raw.proteinPct) ? raw.proteinPct : DEFAULT_GOALS.proteinPct,
    carbsPct: isNumber(raw.carbsPct) ? raw.carbsPct : DEFAULT_GOALS.carbsPct,
    fatPct: isNumber(raw.fatPct) ? raw.fatPct : DEFAULT_GOALS.fatPct,
  };
}

function clampCalories(value: number): number {
  return Math.min(Math.max(Math.round(value), 800), 8000);
}

function readStoredState(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;

    const entries = Array.isArray(candidate.entries)
      ? candidate.entries.map(parseEntry).filter((entry): entry is Entry => entry !== null)
      : [];

    return {
      version: STATE_VERSION,
      name: typeof candidate.name === "string" ? candidate.name : "",
      goals: parseGoals(candidate.goals),
      entries,
    };
  } catch {
    return null;
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `entry-${Date.now().toString(36)}-${Math.round(Math.random() * 1e6).toString(36)}`;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

export interface EatMoreActions {
  addEntry: (input: NewEntryInput) => void;
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  setGoals: (goals: Partial<Goals>) => void;
  setName: (name: string) => void;
  loadSampleData: () => void;
  clearEverything: () => void;
}

interface EatMoreContextValue {
  state: AppState;
  /** False until `localStorage` has been read; UI shows placeholders until then. */
  hydrated: boolean;
  actions: EatMoreActions;
}

const EatMoreContext = createContext<EatMoreContextValue | null>(null);

export function EatMoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Reading storage during render would make the server and client markup
  // disagree, so the real state arrives after mount.
  useEffect(() => {
    const stored = readStoredState();
    if (stored) dispatch({ type: "replace", state: stored });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private browsing or a full quota: keep working from memory.
    }
  }, [state, hydrated]);

  const actions = useMemo<EatMoreActions>(
    () => ({
      addEntry: (input) =>
        dispatch({
          type: "addEntry",
          entry: { ...input, id: createId(), createdAt: Date.now() },
        }),
      updateEntry: (id, patch) => dispatch({ type: "updateEntry", id, patch }),
      deleteEntry: (id) => dispatch({ type: "deleteEntry", id }),
      setGoals: (goals) => dispatch({ type: "setGoals", goals }),
      setName: (name) => dispatch({ type: "setName", name }),
      loadSampleData: () =>
        dispatch({
          type: "replace",
          state: {
            version: STATE_VERSION,
            name: "Andrew",
            goals: DEFAULT_GOALS,
            entries: buildDemoEntries(),
          },
        }),
      clearEverything: () => dispatch({ type: "replace", state: INITIAL_STATE }),
    }),
    [],
  );

  const value = useMemo<EatMoreContextValue>(
    () => ({ state, hydrated, actions }),
    [state, hydrated, actions],
  );

  return <EatMoreContext.Provider value={value}>{children}</EatMoreContext.Provider>;
}

export function useEatMore(): EatMoreContextValue {
  const context = useContext(EatMoreContext);
  if (!context) {
    throw new Error("useEatMore must be used inside <EatMoreProvider>");
  }
  return context;
}

export { clampCalories };
