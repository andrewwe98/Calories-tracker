"use client";

import { createContext, useContext } from "react";

import type { MealType } from "@/lib/types";

export interface AddRequest {
  meal?: MealType;
  dateKey?: string;
}

export interface ShellApi {
  /** Opens the global log-food sheet, optionally prefilled. */
  openAdd: (request?: AddRequest) => void;
  notify: (message: string) => void;
}

const ShellContext = createContext<ShellApi | null>(null);

export const ShellProvider = ShellContext.Provider;

export function useShell(): ShellApi {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used inside <AppShell>");
  }
  return context;
}
