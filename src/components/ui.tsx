import { Star } from "lucide-react";
import type { ReactNode } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.3em]",
          light ? "text-gold-300" : "text-plum-600",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl",
          light ? "text-white" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      <div className="mx-auto mt-5 h-px w-16 bg-gold-500" />
      {children && (
        <p className={cn("mt-5 text-base leading-relaxed", light ? "text-plum-100" : "text-gray-600")}>
          {children}
        </p>
      )}
    </div>
  );
}

export function Stars({ count, max = 3, className }: { count: number; max?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${count} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn("size-3.5", i < count ? "fill-gold-500 text-gold-500" : "fill-transparent text-gray-300")}
        />
      ))}
    </span>
  );
}

export function FreeCanvasBadge({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-gold-400/60 bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200 font-semibold text-plum-900 shadow-sm",
        compact ? "px-2.5 py-1 text-xs" : "px-4 py-2.5 text-sm",
        className,
      )}
      role="status"
    >
      <span aria-hidden>🎉</span> Free Canvas Print Included!
    </div>
  );
}

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  dark = false,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "shrink-0 snap-start rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200",
              dark
                ? active
                  ? "border-gold-500 bg-gold-500 text-plum-950 shadow-md shadow-gold-500/25"
                  : "border-white/15 bg-white/5 text-plum-100 hover:border-gold-400 hover:text-white"
                : active
                  ? "border-plum-600 bg-plum-600 text-white shadow-md shadow-plum-600/25"
                  : "border-gray-200 bg-white text-gray-700 hover:border-plum-300 hover:text-plum-700",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-plum-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-plum-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-plum-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-600 disabled:pointer-events-none disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-plum-200 bg-white px-6 py-3 text-sm font-semibold text-plum-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-plum-400 hover:bg-plum-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-600",
  gold:
    "inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-plum-950 shadow-lg shadow-gold-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
  ghostLight:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
};
