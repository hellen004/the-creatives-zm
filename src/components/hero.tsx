"use client";

import Image from "next/image";
import { ChevronDown, MapPin } from "lucide-react";
import { BRAND } from "@/lib/data";
import { useBooking } from "./booking-context";
import { buttonStyles } from "./ui";

const HERO = {
  src: "/images/wedding-embrace.jpg",
  alt: "A groom in a white tuxedo tenderly kisses his bride's forehead",
};

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-charcoal">
      {/* Phones: full-bleed portrait. Desktop: the same photo, blurred, as a backdrop for the framed shot. */}
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[55%_20%] lg:scale-110 lg:blur-2xl"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-plum-950/70 via-plum-950/55 to-charcoal/90" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(13,13,15,0.65)_100%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-3xl">
          <p className="flex animate-fade-up items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-plum-200">
            <MapPin className="size-3.5" aria-hidden /> Lusaka, Zambia · Photography 2026
          </p>
          <h1 className="mt-6 animate-fade-up font-serif text-5xl leading-[1.05] text-white [animation-delay:120ms] sm:text-6xl md:text-7xl xl:text-8xl">
            Class <span className="text-plum-300">|</span> Style <span className="text-plum-300">|</span>{" "}
            <span className="italic">Elegance</span>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/85 [animation-delay:240ms] sm:text-xl">
            {BRAND.tagline}
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <a href="#services" className={buttonStyles.light}>
              Explore Packages
            </a>
            <button onClick={() => openBooking()} className={buttonStyles.ghostLight}>
              Book Now
            </button>
          </div>
        </div>

        <figure className="relative hidden animate-fade-up [animation-delay:200ms] lg:block">
          <div className="relative aspect-[2/3] h-[min(68vh,640px)] overflow-hidden rounded-3xl shadow-2xl shadow-black/50 ring-1 ring-white/15">
            <Image src={HERO.src} alt="" fill sizes="(min-width: 1024px) 430px, 0px" className="object-cover" />
          </div>
          <figcaption className="absolute -bottom-5 -left-6 rounded-2xl bg-white px-5 py-3 shadow-xl">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-plum-600">Creatives</span>
            <span className="block text-lg font-bold leading-tight text-charcoal">Since 2021</span>
          </figcaption>
        </figure>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70 transition-colors hover:text-white"
        aria-label="Scroll to About section"
      >
        <ChevronDown className="size-7" />
      </a>
    </section>
  );
}
