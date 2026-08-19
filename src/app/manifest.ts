import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EatMore — a fruity calorie tracker",
    short_name: "EatMore",
    description:
      "Log every bite, watch your calorie ring fill, and spot your trends. Your data stays in your browser.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8f0",
    theme_color: "#f97e0b",
    icons: [
      {
        // The route Next.js generates for `app/icon.svg`.
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
