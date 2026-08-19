"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AddEntryForm } from "@/components/log/AddEntryForm";
import { SideNav } from "@/components/shell/SideNav";
import { TabBar } from "@/components/shell/TabBar";
import { TopBar } from "@/components/shell/TopBar";
import { ShellProvider, type AddRequest, type ShellApi } from "@/components/shell/shell-context";
import { Sheet } from "@/components/ui/Sheet";
import { IconCheck } from "@/components/ui/icons";

const TOAST_MS = 2600;

export function AppShell({ children }: { children: ReactNode }) {
  const [addRequest, setAddRequest] = useState<AddRequest | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  const api = useMemo<ShellApi>(
    () => ({
      openAdd: (request) => setAddRequest(request ?? {}),
      notify: (message) => setToast({ id: Date.now(), message }),
    }),
    [],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const closeSheet = () => setAddRequest(null);

  return (
    <ShellProvider value={api}>
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <SideNav onAdd={() => api.openAdd()} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:pb-12 lg:pt-8">
            {children}
          </main>
        </div>
      </div>

      <TabBar onAdd={() => api.openAdd()} />

      <Sheet
        open={addRequest !== null}
        onClose={closeSheet}
        title="Log food"
        description="Search the library or enter your own numbers."
      >
        {addRequest ? (
          <AddEntryForm
            initialMeal={addRequest.meal}
            initialDateKey={addRequest.dateKey}
            onSubmitted={(message) => {
              closeSheet();
              api.notify(message);
            }}
          />
        ) : null}
      </Sheet>

      {toast ? (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="glass-strong fixed bottom-28 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 animate-rise items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-sm font-semibold text-ink lg:bottom-8"
        >
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-kiwi-400 text-white">
            <IconCheck className="size-3.5" />
          </span>
          <span className="truncate">{toast.message}</span>
        </div>
      ) : null}
    </ShellProvider>
  );
}
