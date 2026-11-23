"use client";

import { CalendarCheck, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { DEFAULT_SELECTION, quote } from "@/lib/pricing";
import { useBooking } from "./booking-context";
import { PackageOptions } from "./package-options";
import { QuoteSummary } from "./quote-summary";
import { SectionHeading, buttonStyles, cn } from "./ui";

export function Calculator() {
  const { calculator, setCalculator, openBooking } = useBooking();
  const q = useMemo(() => quote(calculator), [calculator]);

  return (
    <section id="pricing" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[28rem] rounded-full bg-plum-100/60 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Pricing Calculator" title="Build your perfect package">
          Choose a service, pick your tier and hours, and add extras. Your total and 50% deposit update instantly.
        </SectionHeading>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          <div className="rounded-3xl border border-gray-100 bg-cream/60 p-5 sm:p-8">
            <PackageOptions value={calculator} onChange={setCalculator} />
            <button
              type="button"
              onClick={() => setCalculator(DEFAULT_SELECTION)}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-plum-700"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Reset
            </button>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-plum-700 p-6 text-white shadow-2xl shadow-plum-900/30 sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold-500/20 blur-2xl"
              />
              <div className="relative" aria-live="polite">
                <QuoteSummary quote={q} dark />
              </div>
              <button
                onClick={() => openBooking(calculator)}
                className={cn(buttonStyles.gold, "relative mt-6 w-full")}
              >
                <CalendarCheck className="size-4" aria-hidden /> Book this package
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
