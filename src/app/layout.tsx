import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

import { FruitBackground } from "@/components/background/FruitBackground";
import { AppShell } from "@/components/shell/AppShell";
import { EatMoreProvider } from "@/lib/store";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EatMore — a fruity calorie tracker",
    template: "%s · EatMore",
  },
  description:
    "EatMore is a calorie and macro tracker with a fruity dashboard. Log every bite, watch your rings fill, and spot your trends.",
  applicationName: "EatMore",
  appleWebApp: {
    capable: true,
    title: "EatMore",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8f0" },
    { media: "(prefers-color-scheme: dark)", color: "#150e0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <FruitBackground />
        <EatMoreProvider>
          <AppShell>{children}</AppShell>
        </EatMoreProvider>
      </body>
    </html>
  );
}
