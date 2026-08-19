import type { Metadata } from "next";

import { InsightsView } from "@/components/insights/InsightsView";

export const metadata: Metadata = {
  title: "Insights",
  description: "Calorie trends, macro split and your most logged foods.",
};

export default function InsightsPage() {
  return <InsightsView />;
}
