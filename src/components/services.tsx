"use client";

import Image from "next/image";
import { Check, Clock, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { FREE_CANVAS_THRESHOLD, SERVICES, SERVICE_FILTERS, type CategoryId, type Service } from "@/lib/data";
import { formatZMK } from "@/lib/pricing";
import { useBooking } from "./booking-context";
import { FilterTabs, FreeCanvasBadge, SectionHeading, Stars, buttonStyles, cn } from "./ui";

export function Services() {
  const [filter, setFilter] = useState<"all" | CategoryId>("all");
  const visible = SERVICES.filter((s) => filter === "all" || s.category === filter);

  return (
    <section id="services" className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Services & Packages" title="Packages crafted for every moment">
          Transparent 2026 pricing in Zambian Kwacha. Pick a package to book instantly, or customise it in the
          pricing calculator.
        </SectionHeading>

        <div className="mt-10">
          <FilterTabs options={SERVICE_FILTERS} value={filter} onChange={setFilter} label="Filter services" />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((s, i) => (
            <ServiceCard key={`${filter}-${s.id}`} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { openBooking, customize } = useBooking();
  const fixedQualifies = service.price !== undefined && service.price >= FREE_CANVAS_THRESHOLD;

  return (
    <article
      className="group flex animate-pop-in flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-plum-900/10"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          style={{ objectPosition: service.imagePosition ?? "50% 30%" }}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-plum-950/10 to-transparent" />
        {service.hourly && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-plum-700 backdrop-blur">
            <Clock className="size-3.5" aria-hidden /> Hourly rate
          </span>
        )}
        {service.price !== undefined && (
          <span className="absolute right-4 top-4 rounded-full bg-charcoal px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Full package
          </span>
        )}
        <h3 className="absolute bottom-4 left-5 right-5 font-serif text-2xl leading-tight text-white">{service.title}</h3>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {service.subtitle && <p className="text-sm font-medium text-plum-600">{service.subtitle}</p>}

        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Coverage</p>
        <ul className="mt-2 space-y-1.5">
          {service.coverage.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="mt-0.5 size-4 shrink-0 text-plum-500" aria-hidden /> {c}
            </li>
          ))}
        </ul>

        {service.tiers ? (
          <>
            <ul className="mt-5 space-y-2">
              {service.tiers.map((t) => (
                <li
                  key={t.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors",
                    t.id === "gold" ? "border-plum-300 bg-plum-50" : "border-gray-100 bg-gray-50/60",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal">{t.name}</span>
                      <Stars count={t.stars} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {t.photos} edited soft copies{t.extras?.length ? ` + ${t.extras.join(", ").toLowerCase()}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-right">
                      <span className="block font-serif text-lg font-semibold text-plum-700">{formatZMK(t.price)}</span>
                      <span className="block text-[11px] text-gray-400">per hour</span>
                    </p>
                    <button
                      onClick={() => openBooking({ serviceId: service.id, tierId: t.id })}
                      className="rounded-full bg-plum-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-plum-700"
                      aria-label={`Book ${service.title} ${t.name}`}
                    >
                      Book
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <FreeCanvasBadge compact className="mt-3" />
            <p className="mt-2 text-center text-[11px] text-gray-500">on Gold tier and any booking from ZMK 1,000</p>
          </>
        ) : (
          <>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">Deliverables</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {service.deliverables.map((d) => (
                <li key={d} className="rounded-full bg-plum-50 px-3 py-1 text-xs font-medium text-plum-700">
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-end justify-between">
              <p>
                <span className="block text-xs text-gray-400">Package price</span>
                <span className="font-serif text-3xl font-semibold text-plum-700">{formatZMK(service.price!)}</span>
              </p>
            </div>
            {fixedQualifies && !service.includesCanvas && <FreeCanvasBadge compact className="mt-3" />}
          </>
        )}

        {service.note && <p className="mt-4 text-xs italic leading-relaxed text-gray-500">Note: {service.note}</p>}

        <div className="mt-auto flex gap-2 pt-6">
          <button
            onClick={() => openBooking({ serviceId: service.id })}
            className={cn(buttonStyles.primary, "flex-1 px-4")}
          >
            Book Now
          </button>
          <button
            onClick={() => customize({ serviceId: service.id })}
            className={cn(buttonStyles.secondary, "px-4")}
            aria-label={`Customise ${service.title} in the pricing calculator`}
          >
            <SlidersHorizontal className="size-4" aria-hidden /> Customise
          </button>
        </div>
      </div>
    </article>
  );
}
