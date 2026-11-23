import { AlertTriangle, Frame, Truck } from "lucide-react";
import { TERMS } from "@/lib/data";
import { SectionHeading } from "./ui";

const ICONS = { alert: AlertTriangle, truck: Truck, image: Frame };
const EMOJI = { alert: "⚠️", truck: "🚚", image: "🖼️" };

export function Terms() {
  return (
    <section id="terms" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Terms & Conditions" title="Before you book">
          Simple policies that keep every shoot running smoothly.
        </SectionHeading>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {TERMS.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <li
                key={t.title}
                className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-plum-900/10"
              >
                <span className="absolute -right-3 -top-4 text-7xl opacity-10" aria-hidden>
                  {EMOJI[t.icon]}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-plum-600 text-white shadow-lg shadow-plum-600/30">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-serif text-xl text-charcoal">
                  <span aria-hidden>{EMOJI[t.icon]} </span>
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
