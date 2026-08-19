/**
 * Decorative fruit artwork for the app background, drawn inline so it inherits
 * theme colours and needs no network requests. Every shape is authored in a
 * 100x100 viewBox so instances are interchangeable at any size.
 *
 * All geometry is precomputed at module scope: nothing here may be random, or
 * the server and client renders would disagree.
 */

type FruitProps = {
  className?: string;
};

const TAU = Math.PI * 2;

const polar = (angle: number, radius: number, cx = 50, cy = 50) => ({
  x: cx + Math.cos(angle) * radius,
  y: cy + Math.sin(angle) * radius,
});

const ORANGE_WEDGE = "M50 50 L38.26 13.86 A38 38 0 0 1 61.74 13.86 Z";
const ORANGE_ROTATIONS = Array.from({ length: 8 }, (_, i) => i * 45);

const KIWI_SEEDS = Array.from({ length: 11 }, (_, i) => {
  const angle = (i / 11) * TAU - Math.PI / 2;
  const { x, y } = polar(angle, 23);
  return { x, y, rotate: (angle * 180) / Math.PI + 90 };
});

const KIWI_STREAKS = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * TAU;
  const inner = polar(angle, 14);
  const outer = polar(angle, 39);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
});

const STRAWBERRY_SEEDS = [
  [39, 33],
  [50, 30],
  [61, 33],
  [33, 43],
  [45, 42],
  [56, 42],
  [67, 43],
  [38, 53],
  [50, 52],
  [62, 53],
  [43, 63],
  [57, 63],
  [50, 73],
] as const;

const WATERMELON_SEEDS = [
  [34, 62],
  [50, 58],
  [66, 62],
  [42, 71],
  [58, 71],
] as const;

const GRAPES = [
  [50, 30],
  [38, 45],
  [62, 45],
  [50, 48],
  [28, 61],
  [50, 64],
  [72, 61],
  [39, 76],
  [61, 76],
  [50, 88],
] as const;

export function OrangeSlice({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="var(--color-mango-500)" />
      <circle cx="50" cy="50" r="43" fill="var(--color-mango-100)" />
      {ORANGE_ROTATIONS.map((deg) => (
        <path
          key={deg}
          d={ORANGE_WEDGE}
          fill="var(--color-mango-300)"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill="var(--color-mango-100)" />
    </svg>
  );
}

export function Lemon({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 5 C53 5 55 8 56 12 C73 17 88 31 88 50 C88 73 70 95 50 95 C30 95 12 73 12 50 C12 31 27 17 44 12 C45 8 47 5 50 5 Z"
        fill="var(--color-citrus-300)"
      />
      <path
        d="M50 12 C62 16 78 30 78 50 C78 70 65 86 50 88 C56 74 60 62 60 50 C60 34 56 22 50 12 Z"
        fill="var(--color-citrus-200)"
      />
      <ellipse cx="37" cy="34" rx="8" ry="12" fill="var(--color-citrus-100)" opacity="0.7" transform="rotate(-25 37 34)" />
    </svg>
  );
}

export function KiwiSlice({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#8a6b3f" />
      <circle cx="50" cy="50" r="43" fill="var(--color-kiwi-400)" />
      <g stroke="var(--color-kiwi-100)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        {KIWI_STREAKS.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
        ))}
      </g>
      {KIWI_SEEDS.map((seed, i) => (
        <ellipse
          key={i}
          cx={seed.x}
          cy={seed.y}
          rx="1.7"
          ry="3"
          fill="#2f2114"
          transform={`rotate(${seed.rotate} ${seed.x} ${seed.y})`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill="var(--color-kiwi-50)" />
    </svg>
  );
}

export function Strawberry({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 96 C30 83 15 63 15 45 C15 30 30 20 50 20 C70 20 85 30 85 45 C85 63 70 83 50 96 Z"
        fill="var(--color-berry-400)"
      />
      <path
        d="M50 20 C70 20 85 30 85 45 C85 55 81 65 74 74 C74 55 66 34 50 20 Z"
        fill="var(--color-berry-300)"
        opacity="0.75"
      />
      {STRAWBERRY_SEEDS.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.6" fill="var(--color-citrus-200)" />
      ))}
      <path
        d="M50 22 C40 22 30 18 26 10 C36 8 44 10 50 15 C56 10 64 8 74 10 C70 18 60 22 50 22 Z"
        fill="var(--color-kiwi-500)"
      />
      <path d="M50 16 C50 10 51 5 53 2 C49 4 47 9 47 16 Z" fill="var(--color-kiwi-600)" />
    </svg>
  );
}

export function WatermelonWedge({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M4 80 A46 46 0 0 1 96 80 Z" fill="var(--color-kiwi-600)" />
      <path d="M12 80 A38 38 0 0 1 88 80 Z" fill="var(--color-kiwi-100)" />
      <path d="M17 80 A33 33 0 0 1 83 80 Z" fill="var(--color-berry-400)" />
      {WATERMELON_SEEDS.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2" ry="3.2" fill="#2f2114" />
      ))}
    </svg>
  );
}

export function Banana({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M22 22 C22 56 44 80 78 80 C86 80 91 75 91 68 C91 62 86 57 78 57 C56 57 43 44 43 22 C43 15 38 10 32.5 10 C27 10 22 15 22 22 Z"
        fill="var(--color-citrus-300)"
      />
      <path
        d="M30 24 C30 54 48 72 78 72 C82 72 85 70 87 67 C84 74 82 76 78 76 C46 76 26 54 26 24 C26 19 28 15 31 13 C30 16 30 20 30 24 Z"
        fill="var(--color-citrus-400)"
      />
      <path d="M22 22 C22 16 27 10 32.5 10 C35 10 37 11 38 13 C33 13 28 17 27 24 Z" fill="var(--color-kiwi-600)" />
      <path d="M84 79 C88 78 91 74 91 68 C93 72 91 79 86 80 Z" fill="#7a5a2a" />
    </svg>
  );
}

export function Cherries({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M52 14 C44 30 34 44 30 62"
        stroke="var(--color-kiwi-600)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 14 C60 28 68 42 70 58"
        stroke="var(--color-kiwi-600)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M52 14 C60 6 74 4 84 8 C76 18 62 20 52 14 Z" fill="var(--color-kiwi-500)" />
      <circle cx="28" cy="76" r="17" fill="var(--color-berry-500)" />
      <circle cx="71" cy="72" r="15" fill="var(--color-berry-400)" />
      <ellipse cx="23" cy="70" rx="4.5" ry="3" fill="var(--color-berry-200)" opacity="0.8" />
      <ellipse cx="66" cy="67" rx="4" ry="2.6" fill="var(--color-berry-200)" opacity="0.8" />
    </svg>
  );
}

export function GrapeBunch({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M50 26 C50 18 52 10 56 5" stroke="var(--color-kiwi-600)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M56 8 C66 2 80 4 86 12 C76 20 62 18 56 8 Z" fill="var(--color-kiwi-500)" />
      {GRAPES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="11" fill={i % 3 === 0 ? "var(--color-grape-400)" : "var(--color-grape-500)"} />
      ))}
      <circle cx="46" cy="42" r="3" fill="var(--color-grape-200)" opacity="0.75" />
      <circle cx="34" cy="58" r="2.6" fill="var(--color-grape-200)" opacity="0.7" />
    </svg>
  );
}

export function Blueberries({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="32" cy="42" r="20" fill="var(--color-grape-600)" />
      <circle cx="70" cy="36" r="16" fill="var(--color-grape-500)" />
      <circle cx="55" cy="72" r="22" fill="var(--color-grape-700)" />
      <g fill="var(--color-grape-300)" opacity="0.8">
        <circle cx="32" cy="42" r="5" />
        <circle cx="70" cy="36" r="4" />
        <circle cx="55" cy="72" r="5.5" />
      </g>
      <g fill="var(--color-grape-200)" opacity="0.55">
        <circle cx="24" cy="34" r="4" />
        <circle cx="64" cy="29" r="3.2" />
        <circle cx="45" cy="62" r="4.4" />
      </g>
    </svg>
  );
}

export function Pineapple({ className }: FruitProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M50 30 C40 22 36 12 37 2 C46 6 50 14 50 22 Z" fill="var(--color-kiwi-500)" />
      <path d="M50 30 C60 22 64 12 63 2 C54 6 50 14 50 22 Z" fill="var(--color-kiwi-600)" />
      <path d="M50 28 C44 18 44 8 47 0 C53 6 55 16 53 28 Z" fill="var(--color-kiwi-400)" />
      <ellipse cx="50" cy="63" rx="27" ry="35" fill="var(--color-citrus-300)" />
      <g stroke="var(--color-mango-400)" strokeWidth="1.8" opacity="0.85">
        <path d="M26 45 L74 78" />
        <path d="M26 60 L74 93" />
        <path d="M26 78 L60 97" />
        <path d="M34 33 L74 62" />
        <path d="M74 45 L26 78" />
        <path d="M74 60 L26 93" />
        <path d="M74 78 L40 97" />
        <path d="M66 33 L26 62" />
      </g>
    </svg>
  );
}
