import { cn } from "@/lib/cn";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-mango-300 via-mango-400 to-berry-400 shadow-float">
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <path
            d="M12 6.5c1.6-2.3 4.2-3.2 6.3-2.4 2.3.9 3.2 3.6 2.4 6.6-1 3.8-4.4 7.6-8.7 10-4.3-2.4-7.7-6.2-8.7-10C2.5 7.7 3.4 5 5.7 4.1c2.1-.8 4.7.1 6.3 2.4Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path d="M12 6.5V4c0-1 .7-1.8 1.7-2" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      </span>
      {showWordmark ? (
        <span className="font-display text-xl font-extrabold tracking-tight text-ink">
          Eat
          <span className="bg-linear-to-r from-mango-500 to-berry-500 bg-clip-text text-transparent">
            More
          </span>
        </span>
      ) : null}
    </span>
  );
}
