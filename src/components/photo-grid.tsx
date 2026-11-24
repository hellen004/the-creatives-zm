"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PORTFOLIO_FILTERS, type Photo } from "@/lib/data";
import { cn } from "./ui";

const categoryLabel = (id: Photo["category"]) => PORTFOLIO_FILTERS.find((f) => f.id === id)?.label ?? id;

/** Masonry photo grid with a keyboard-friendly lightbox. */
export function PhotoGrid({
  photos,
  keyPrefix = "",
  showCategory = true,
  className,
}: {
  photos: Photo[];
  keyPrefix?: string;
  showCategory?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  const current = active !== null ? photos[active] : null;

  return (
    <>
      <div className={cn("columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4", className)}>
        {photos.map((p, i) => (
          <button
            key={`${keyPrefix}-${p.src}`}
            onClick={() => setActive(i)}
            className="group relative mb-3 block w-full animate-pop-in break-inside-avoid overflow-hidden rounded-2xl bg-plum-900/40 sm:mb-4"
            style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
            aria-label={`View photo: ${p.alt}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.w}
              height={p.h}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-plum-950/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex w-full items-center justify-between text-left text-xs font-medium text-white">
                {showCategory ? categoryLabel(p.category) : <span />}
                <Expand className="size-4" aria-hidden />
              </span>
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-plum-950/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <figure className="relative flex max-h-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.w}
              height={current.h}
              sizes="90vw"
              className="max-h-[80dvh] w-auto animate-pop-in rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-plum-100">
              {current.alt} <span className="text-plum-300">· {active! + 1} / {photos.length}</span>
            </figcaption>
          </figure>
          <LightboxButton className="right-4 top-4" label="Close" onClick={close}>
            <X className="size-5" />
          </LightboxButton>
          {photos.length > 1 && (
            <>
              <LightboxButton className="left-2 top-1/2 -translate-y-1/2 sm:left-6" label="Previous photo" onClick={() => step(-1)}>
                <ChevronLeft className="size-6" />
              </LightboxButton>
              <LightboxButton className="right-2 top-1/2 -translate-y-1/2 sm:right-6" label="Next photo" onClick={() => step(1)}>
                <ChevronRight className="size-6" />
              </LightboxButton>
            </>
          )}
        </div>
      )}
    </>
  );
}

function LightboxButton({
  className,
  label,
  onClick,
  children,
}: {
  className: string;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={`absolute grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 ${className}`}
    >
      {children}
    </button>
  );
}
