import type { MetadataRoute } from "next";

const basePath = process.env.PAGES_BASE_PATH ?? "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EatMore — a fruity calorie tracker",
    short_name: "EatMore",
    description:
      "Log every bite, watch your calorie ring fill, and spot your trends. Your data stays in your browser.",
    start_url: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8f0",
    theme_color: "#f97e0b",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
