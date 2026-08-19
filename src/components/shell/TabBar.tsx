"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/shell/nav-items";
import { isActive } from "@/components/shell/SideNav";
import { IconPlus } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Native-app style bottom bar: two tabs, the raised log button, two more tabs.
 */
export function TabBar({ onAdd }: { onAdd: () => void }) {
  const pathname = usePathname();
  const [first, second, third, fourth] = NAV_ITEMS;

  return (
    <nav
      aria-label="Main"
      className="glass-strong fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 items-center border-t border-hairline px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <Tab item={first} pathname={pathname} />
      <Tab item={second} pathname={pathname} />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onAdd}
          aria-label="Log food"
          className="-mt-8 grid size-14 place-items-center rounded-full bg-linear-to-br from-mango-400 to-berry-400 text-white shadow-float ring-4 ring-page transition-transform active:scale-95"
        >
          <IconPlus className="size-7" />
        </button>
      </div>

      <Tab item={third} pathname={pathname} />
      <Tab item={fourth} pathname={pathname} />
    </nav>
  );
}

function Tab({
  item,
  pathname,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
}) {
  const active = isActive(pathname, item.href);
  const { Icon, href, label } = item;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-xl py-1 text-[0.68rem] font-semibold transition-colors",
        active ? "text-mango-600 dark:text-mango-200" : "text-ink-muted hover:text-ink-soft",
      )}
    >
      <Icon className="size-6" />
      {label}
    </Link>
  );
}
