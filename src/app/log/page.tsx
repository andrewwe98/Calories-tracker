import type { Metadata } from "next";

import { DiaryView } from "@/components/log/DiaryView";

export const metadata: Metadata = {
  title: "Diary",
  description: "Log every meal and snack, and adjust servings as you go.",
};

export default function LogPage() {
  return <DiaryView />;
}
