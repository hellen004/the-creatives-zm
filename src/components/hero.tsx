"use client";

import Image from "next/image";
import { ChevronDown, MapPin } from "lucide-react";
import { BRAND } from "@/lib/data";
import { useBooking } from "./booking-context";
import { buttonStyles } from "./ui";

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <Image
        src="/images/wedding-kiss.jpg"
        alt="A groom tenderly kisses his bride's hand on their wedding day"
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[60%_30%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-plum-950/70 via-plum-950/55 to-plum-950/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(23,5,24,0.6)_100%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="flex animate-fade-up items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            <MapPin className="size-3.5" aria-hidden /> Lusaka, Zambia · Photography 2026
          </p>
          <h1 className="mt-6 animate-fade-up font-serif text-5xl leading-[1.05] text-white [animation-delay:120ms] sm:text-6xl md:text-7xl lg:text-8xl">
            Class <span className="text-gold-500">|</span> Style <span className="text-gold-500">|</span>{" "}
            <span className="italic">Elegance</span>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-white/85 [animation-delay:240ms] sm:text-xl">
            {BRAND.tagline}
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <a href="#services" className={buttonStyles.gold}>
              Explore Packages
            </a>
            <button onClick={() => openBooking()} className={buttonStyles.ghostLight}>
              Book Now
            </button>
          </div>
        </div>
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
