"use client";

import Image from "next/image";
import { MapPin, MessageCircle, Phone, Smartphone } from "lucide-react";
import { BRAND, PAYMENT_ACCOUNTS } from "@/lib/data";
import { useBooking } from "./booking-context";
import { buttonStyles, cn } from "./ui";

export function Contact() {
  const { openBooking } = useBooking();

  return (
    <footer id="contact" className="relative overflow-hidden bg-plum-800 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-plum-500/30 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-magenta/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-plum-200">Contact Us</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Let&apos;s create something timeless.</h2>
            <p className="mt-3 max-w-lg text-plum-100">
              Slots fill quickly, especially on weekends and graduation season. Reserve yours with a 50% deposit.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button onClick={() => openBooking()} className={buttonStyles.light}>
              Book Now
            </button>
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles.ghostLight}
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp us
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="flex items-center gap-2.5 font-serif text-2xl">
              <Image src="/images/logo.jpg" alt="" width={44} height={44} className="size-11 rounded-xl ring-1 ring-white/20" />
              The Creatives <span className="italic text-plum-300">zm</span>
            </p>
            <p className="mt-4 text-sm tracking-widest text-white">{BRAND.pillars.toUpperCase()}</p>
            <p className="mt-2 text-sm italic text-plum-100">&ldquo;{BRAND.tagline}&rdquo;</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-plum-200">Visit</h3>
            <p className="mt-4 flex items-start gap-2.5 text-sm text-white/90">
              <MapPin className="mt-0.5 size-4 shrink-0 text-plum-300" aria-hidden />
              {BRAND.location}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-plum-200">Calls & Bookings</h3>
            <a
              href={`tel:${BRAND.phoneE164}`}
              className="mt-4 flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-plum-200"
            >
              <Phone className="size-4 text-plum-300" aria-hidden /> {BRAND.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-plum-200"
            >
              <MessageCircle className="size-4 text-plum-300" aria-hidden /> WhatsApp {BRAND.phoneDisplay}
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-plum-200">Mobile Money Payments</h3>
            <ul className="mt-4 space-y-3">
              {PAYMENT_ACCOUNTS.map((a) => (
                <li key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Smartphone className="size-4 text-plum-300" aria-hidden />
                    {a.provider}
                    <span
                      className={cn("ml-auto size-2 rounded-full", a.id === "airtel" ? "bg-red-500" : "bg-yellow-400")}
                      aria-hidden
                    />
                  </p>
                  <p className="mt-1 text-sm text-white">
                    <span className="text-xs text-plum-200">{a.numberLabel}: </span>
                    <span className="font-mono">{a.number}</span>
                  </p>
                  <p className="text-xs text-plum-200">Name: {a.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-plum-200 sm:flex-row">
          <p>© 2026 The Creatives zm. All rights reserved.</p>
          <p>Prices from the official 2026 Price Guide · All prices in Zambian Kwacha (ZMK)</p>
        </div>
      </div>
    </footer>
  );
}
