"use client";

import Link from "next/link";
import { ArrowLeft, CalendarCheck, Images } from "lucide-react";
import { useEffect, useState } from "react";
import { GALLERY_SECTIONS, PHOTOS, PORTFOLIO_FILTERS, type PortfolioCategory } from "@/lib/data";
import { useBooking } from "./booking-context";
import { PhotoGrid } from "./photo-grid";
import { buttonStyles, cn } from "./ui";

const sections = GALLERY_SECTIONS.map((s) => ({
  ...s,
  short: PORTFOLIO_FILTERS.find((f) => f.id === s.id)?.label ?? s.title,
  photos: PHOTOS.filter((p) => p.category === s.id),
})).filter((s) => s.photos.length > 0);
const SECTION_IDS = sections.map((s) => s.id);

export function Gallery() {
  const { openBooking } = useBooking();
  const active = useActiveSection(SECTION_IDS);

  return (
    <div className="bg-plum-950 text-white">
      {/* Header */}
      <header className="relative overflow-hidden px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-24 size-[32rem] rounded-full bg-plum-600/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 top-10 size-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-plum-200 transition-colors hover:text-gold-300"
          >
            <ArrowLeft className="size-4" aria-hidden /> Back to home
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Gallery</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            Every story, <span className="italic text-gold-400">beautifully told.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-plum-100 sm:text-lg">
            Browse our work by type of shoot — weddings, engagements, bridal showers and traditional ceremonies,
            graduations, birthdays and our mobile studio. Tap any photo to view it full screen.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-plum-100">
            <Images className="size-4 text-gold-400" aria-hidden />
            {PHOTOS.length} photos · {sections.length} types of shoot
          </p>
        </div>
      </header>

      {/* Section jump bar */}
      <nav
        aria-label="Gallery sections"
        className="sticky top-16 z-30 border-y border-white/10 bg-plum-950/85 backdrop-blur-md lg:top-20"
      >
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-8">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active === s.id
                    ? "border-gold-500 bg-gold-500 text-plum-950"
                    : "border-white/15 bg-white/5 text-plum-100 hover:border-gold-400 hover:text-white",
                )}
              >
                {s.short}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] font-semibold",
                    active === s.id ? "bg-plum-950/15" : "bg-white/10",
                  )}
                >
                  {s.photos.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className="scroll-mt-16 border-b border-white/10 py-16 last:border-b-0 sm:py-20"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="font-serif text-sm italic text-gold-400">
                  {String(i + 1).padStart(2, "0")} — {s.photos.length} photo{s.photos.length > 1 ? "s" : ""}
                </p>
                <h2 id={`${s.id}-title`} className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-plum-100">{s.blurb}</p>
              </div>
              <button
                onClick={() => openBooking({ serviceId: s.serviceId })}
                className={cn(buttonStyles.ghostLight, "shrink-0 self-start md:self-auto")}
              >
                <CalendarCheck className="size-4" aria-hidden /> {s.bookLabel}
              </button>
            </div>
            <PhotoGrid photos={s.photos} keyPrefix={s.id} showCategory={false} className="mt-10" />
          </section>
        ))}
      </div>

      {/* Closing CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-plum-700 to-plum-600 px-6 py-12 text-center shadow-2xl shadow-black/30">
          <h2 className="font-serif text-3xl sm:text-4xl">Love what you see?</h2>
          <p className="max-w-xl text-plum-100">
            Reserve your date with a 50% deposit. Packages from ZMK 1,000 include a free canvas print.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => openBooking()} className={buttonStyles.gold}>
              Book Now
            </button>
            <Link href="/#services" className={buttonStyles.ghostLight}>
              View packages & prices
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Tracks which gallery section is currently in view, for the jump bar. */
function useActiveSection(ids: PortfolioCategory[]) {
  const [active, setActive] = useState<PortfolioCategory>(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as PortfolioCategory);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
