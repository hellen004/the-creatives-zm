"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { PHOTOS, PORTFOLIO, PORTFOLIO_FILTERS, type PortfolioCategory } from "@/lib/data";
import { PhotoGrid } from "./photo-grid";
import { FilterTabs, SectionHeading, buttonStyles } from "./ui";

export function Portfolio() {
  const [filter, setFilter] = useState<"all" | PortfolioCategory>("all");
  const items = PORTFOLIO.filter((p) => filter === "all" || p.category === filter);

  return (
    <section id="portfolio" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Portfolio" title="Moments we've had the honour to capture" light>
          Weddings, engagements, bridal showers, graduations and studio portraits — a glimpse of recent work.
        </SectionHeading>

        <div className="mt-10">
          <FilterTabs options={PORTFOLIO_FILTERS} value={filter} onChange={setFilter} label="Filter portfolio" dark />
        </div>

        <PhotoGrid photos={items} keyPrefix={filter} className="mt-10" />

        <div className="mt-12 text-center">
          <Link href={filter === "all" ? "/gallery" : `/gallery#${filter}`} className={buttonStyles.light}>
            View the full gallery ({PHOTOS.length} photos) <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
