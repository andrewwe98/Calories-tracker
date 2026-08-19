"use client";

import Link from "next/link";

import { Logo } from "@/components/shell/Logo";
import { Skeleton } from "@/components/ui/Feedback";
import { IconFlame } from "@/components/ui/icons";
import { todayKey } from "@/lib/date";
import { loggingStreak } from "@/lib/selectors";
import { useEatMore } from "@/lib/store";

export function TopBar() {
  const { state, hydrated } = useEatMore();

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-hairline px-4 py-3 lg:hidden">
      <Link href="/" aria-label="EatMore home">
        <Logo />
      </Link>

      {hydrated ? (
        <span className="flex items-center gap-1.5 rounded-full border border-mango-200 bg-mango-50 px-3 py-1.5 text-sm font-bold text-mango-700 dark:border-mango-700/50 dark:bg-mango-800/30 dark:text-mango-100">
          <IconFlame className="size-4" />
          {loggingStreak(state.entries, todayKey())}
        </span>
      ) : (
        <Skeleton className="h-8 w-16" />
      )}
    </header>
  );
}
