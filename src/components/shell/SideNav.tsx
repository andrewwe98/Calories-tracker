"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/shell/Logo";
import { NAV_ITEMS } from "@/components/shell/nav-items";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Feedback";
import { IconPlus } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { todayKey } from "@/lib/date";
import { clamp, formatKcal } from "@/lib/format";
import { dayTotals } from "@/lib/selectors";
import { useEatMore } from "@/lib/store";

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SideNav({ onAdd }: { onAdd: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="glass sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-hairline px-4 py-5 lg:flex">
      <Link href="/" className="mb-7 rounded-2xl px-1 py-1">
        <Logo />
      </Link>

      <nav aria-label="Main">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-linear-to-r from-mango-100 to-berry-100 text-mango-700 dark:from-mango-600/30 dark:to-berry-600/20 dark:text-mango-100"
                      : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Button onClick={onAdd} size="lg" fullWidth className="mt-6">
        <IconPlus className="size-5" />
        Log food
      </Button>

      <TodaySummary />
    </aside>
  );
}

function TodaySummary() {
  const { state, hydrated } = useEatMore();

  if (!hydrated) {
    return (
      <div className="mt-auto space-y-2 rounded-2xl border border-hairline bg-surface-2 p-3.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  const today = todayKey();
  const { kcal } = dayTotals(state.entries, today);
  const goal = state.goals.calories;
  const progress = clamp(goal > 0 ? kcal / goal : 0, 0, 1);
  const remaining = Math.max(0, goal - kcal);

  return (
    <div className="mt-auto rounded-2xl border border-hairline bg-surface-2 p-3.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Today</p>
      <p className="tabular mt-0.5 font-display text-lg font-bold text-ink">
        {formatKcal(kcal)}
        <span className="text-sm font-semibold text-ink-muted"> / {formatKcal(goal)}</span>
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full rounded-full bg-linear-to-r from-mango-300 to-berry-400 transition-[width] duration-700"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {remaining > 0 ? `${formatKcal(remaining)} kcal to go` : "Goal reached 🎉"}
      </p>
    </div>
  );
}
