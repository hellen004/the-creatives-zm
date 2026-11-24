"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, ChevronDown, Images } from "lucide-react";
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
    <div className="bg-charcoal text-white">
      {/* Hero — same treatment as the home page hero */}
      <header className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src="/images/bridal-shower-sofa-smile.jpg"
          alt="Smiling bride-to-be in a beaded pink gown seated beside white flowers"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover object-[40%_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-plum-950/70 via-plum-950/55 to-plum-950/85" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(23,5,24,0.6)_100%)]" />

        <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex animate-fade-up items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-plum-200"
            >
              <ArrowLeft className="size-4" aria-hidden /> Back to home
            </Link>
            <p className="mt-6 flex animate-fade-up items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-plum-200 [animation-delay:60ms]">
              <Images className="size-3.5" aria-hidden /> Gallery · {PHOTOS.length} photos · {sections.length} types of shoot
            </p>
            <h1 className="mt-6 animate-fade-up font-serif text-5xl leading-[1.05] text-white [animation-delay:120ms] sm:text-6xl md:text-7xl">
              Every story, <span className="italic text-plum-300">beautifully told.</span>
            </h1>
            <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/85 [animation-delay:240ms] sm:text-xl">
              Browse our work by type of shoot — weddings, engagements, bridal showers, traditional ceremonies,
              graduations, birthdays and studio portraits.
            </p>
            <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row">
              <a href={`#${SECTION_IDS[0]}`} className={buttonStyles.light}>
                Browse the Gallery
              </a>
              <button onClick={() => openBooking()} className={buttonStyles.ghostLight}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        <a
          href={`#${SECTION_IDS[0]}`}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70 transition-colors hover:text-white"
          aria-label="Scroll to the gallery"
        >
          <ChevronDown className="size-7" />
        </a>
      </header>

      {/* Section jump bar */}
      <nav
        aria-label="Gallery sections"
        className="sticky top-16 z-30 border-y border-white/10 bg-charcoal/85 backdrop-blur-md lg:top-20"
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
                    ? "border-white bg-white text-charcoal"
                    : "border-white/15 bg-white/5 text-white/80 hover:border-plum-300 hover:text-white",
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
                <p className="font-serif text-sm italic text-plum-300">
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
            <button onClick={() => openBooking()} className={buttonStyles.light}>
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
