import type { Metadata } from "next";

import { SettingsView } from "@/components/settings/SettingsView";

export const metadata: Metadata = {
  title: "Settings",
  description: "Set your calorie goal, macro split and manage your saved data.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
