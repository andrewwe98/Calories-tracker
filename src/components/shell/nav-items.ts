import type { ComponentType } from "react";

import {
  IconDiary,
  IconInsights,
  IconSettings,
  IconToday,
} from "@/components/ui/icons";

export type Route = "/" | "/log" | "/insights" | "/settings";

export interface NavItem {
  href: Route;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Today", Icon: IconToday },
  { href: "/log", label: "Diary", Icon: IconDiary },
  { href: "/insights", label: "Insights", Icon: IconInsights },
  { href: "/settings", label: "Settings", Icon: IconSettings },
];
