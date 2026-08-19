import type { ComponentType, CSSProperties } from "react";

import {
  Banana,
  Blueberries,
  Cherries,
  GrapeBunch,
  KiwiSlice,
  Lemon,
  OrangeSlice,
  Pineapple,
  Strawberry,
  WatermelonWedge,
} from "./Fruits";

type Glow = {
  className: string;
  color: string;
};

const GLOWS: Glow[] = [
  { className: "-left-[18%] -top-[14%] size-[48vmax]", color: "var(--glow-mango)" },
  { className: "-right-[16%] -top-[8%] size-[42vmax]", color: "var(--glow-citrus)" },
  { className: "-right-[14%] top-[42%] size-[46vmax]", color: "var(--glow-berry)" },
  { className: "-left-[12%] bottom-[-16%] size-[44vmax]", color: "var(--glow-kiwi)" },
  { className: "left-[38%] bottom-[-22%] size-[38vmax]", color: "var(--glow-grape)" },
];

type FruitPlacement = {
  Fruit: ComponentType<{ className?: string }>;
  position: string;
  animation: string;
  rotate: number;
  delay: string;
};

/**
 * Fruit are pushed toward the edges so they frame the content instead of
 * competing with it, and the denser ones only appear once there is room.
 */
const FRUIT: FruitPlacement[] = [
  { Fruit: OrangeSlice, position: "-left-10 top-[6%] w-32 sm:w-40", animation: "animate-float-a", rotate: -14, delay: "0s" },
  { Fruit: Strawberry, position: "right-2 top-[9%] w-20 sm:w-24", animation: "animate-float-b", rotate: 12, delay: "-4s" },
  { Fruit: KiwiSlice, position: "left-[6%] bottom-[10%] w-24 sm:w-32", animation: "animate-float-c", rotate: 8, delay: "-9s" },
  { Fruit: WatermelonWedge, position: "-right-8 bottom-[16%] w-32 sm:w-40", animation: "animate-float-a", rotate: -10, delay: "-6s" },
  { Fruit: Banana, position: "left-[26%] -top-16 hidden w-28 lg:block", animation: "animate-float-b", rotate: 20, delay: "-12s" },
  { Fruit: Blueberries, position: "right-[20%] -bottom-6 hidden w-24 md:block", animation: "animate-float-c", rotate: -6, delay: "-3s" },
  { Fruit: Cherries, position: "-left-6 top-[46%] hidden w-24 md:block", animation: "animate-float-b", rotate: 6, delay: "-15s" },
  { Fruit: GrapeBunch, position: "right-[7%] top-[38%] hidden w-24 lg:block", animation: "animate-float-a", rotate: -12, delay: "-8s" },
  { Fruit: Lemon, position: "left-[42%] bottom-[3%] hidden w-20 lg:block", animation: "animate-float-c", rotate: 24, delay: "-18s" },
  { Fruit: Pineapple, position: "right-[30%] -top-10 hidden w-24 xl:block", animation: "animate-float-b", rotate: -8, delay: "-11s" },
];

export function FruitBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-page" />

      {GLOWS.map((glow) => (
        <div
          key={glow.className}
          className={`absolute rounded-full blur-3xl ${glow.className}`}
          style={{
            background: `radial-gradient(circle at center, ${glow.color} 0%, transparent 68%)`,
            opacity: 0.5,
          }}
        />
      ))}

      {FRUIT.map(({ Fruit, position, animation, rotate, delay }, i) => (
        <div
          key={i}
          className={`absolute ${position} ${animation}`}
          style={
            {
              "--fruit-rotate": `${rotate}deg`,
              animationDelay: delay,
              opacity: "var(--fruit-opacity)",
              transform: `rotate(${rotate}deg)`,
            } as CSSProperties
          }
        >
          <Fruit className="size-full drop-shadow-sm" />
        </div>
      ))}

      {/* Softens the artwork so text keeps its contrast over busy areas. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--page) 62%, transparent) 0%, color-mix(in srgb, var(--page) 22%, transparent) 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
