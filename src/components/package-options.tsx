"use client";

import { Check, Minus, Plus } from "lucide-react";
import { MAX_HOURS, SERVICES } from "@/lib/data";
import { availableAddOns, formatZMK, getService, type Selection } from "@/lib/pricing";
import { Stars, cn } from "./ui";

/** Service / tier / hours / add-on controls shared by the calculator and the booking modal. */
export function PackageOptions({
  value,
  onChange,
  compact = false,
}: {
  value: Selection;
  onChange: (patch: Partial<Selection>) => void;
  compact?: boolean;
}) {
  const service = getService(value.serviceId);
  const addOns = availableAddOns(service);

  const toggleAddOn = (id: string) =>
    onChange({
      addOns: value.addOns.includes(id) ? value.addOns.filter((a) => a !== id) : [...value.addOns, id],
    });

  return (
    <div className={cn("space-y-7", compact && "space-y-5")}>
      <fieldset>
        <Legend step={1} compact={compact}>
          Choose a service
        </Legend>
        {compact ? (
          <select
            value={value.serviceId}
            onChange={(e) => onChange({ serviceId: e.target.value })}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-plum-500 focus:ring-4 focus:ring-plum-100"
            aria-label="Service"
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
                {s.price !== undefined ? ` — ${formatZMK(s.price)}` : " — hourly"}
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {SERVICES.map((s) => {
              const active = s.id === value.serviceId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ serviceId: s.id })}
                  aria-pressed={active}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-plum-600 bg-plum-50 ring-2 ring-plum-600/20"
                      : "border-gray-200 bg-white hover:border-plum-300 hover:bg-plum-50/40",
                  )}
                >
                  <span>
                    <span className="block text-sm font-semibold text-charcoal">{s.title}</span>
                    <span className="mt-0.5 block text-xs text-gray-500">
                      {s.price !== undefined
                        ? `Full package · ${formatZMK(s.price)}`
                        : `From ${formatZMK(s.tiers![0].price)} / hour`}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                      active ? "border-plum-600 bg-plum-600 text-white" : "border-gray-300",
                    )}
                  >
                    {active && <Check className="size-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      {service.tiers && (
        <fieldset>
          <Legend step={2} compact={compact}>
            Select your tier
          </Legend>
          <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tier">
            {service.tiers.map((t) => {
              const active = t.id === value.tierId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ tierId: t.id })}
                  className={cn(
                    "relative rounded-2xl border px-2 py-3 text-center transition-all",
                    active
                      ? t.id === "gold"
                        ? "border-gold-500 bg-gold-200/40 ring-2 ring-gold-500/30"
                        : "border-plum-600 bg-plum-50 ring-2 ring-plum-600/20"
                      : "border-gray-200 bg-white hover:border-plum-300",
                  )}
                >
                  <Stars count={t.stars} className="justify-center" />
                  <span className="mt-1 block text-sm font-semibold text-charcoal">{t.name}</span>
                  <span className="block font-serif text-base font-semibold text-plum-700">K{t.price.toLocaleString()}</span>
                  <span className="block text-[11px] text-gray-500">{t.photos} edited photos</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {service.hourly && (
        <fieldset>
          <Legend step={3} compact={compact}>
            How many hours?
          </Legend>
          <div className="mt-3 flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1">
              <StepButton
                label="Remove an hour"
                disabled={value.hours <= 1}
                onClick={() => onChange({ hours: value.hours - 1 })}
              >
                <Minus className="size-4" />
              </StepButton>
              <output className="w-16 text-center text-sm font-semibold text-charcoal" aria-live="polite">
                {value.hours} hr{value.hours > 1 ? "s" : ""}
              </output>
              <StepButton
                label="Add an hour"
                disabled={value.hours >= MAX_HOURS}
                onClick={() => onChange({ hours: value.hours + 1 })}
              >
                <Plus className="size-4" />
              </StepButton>
            </div>
            <p className="text-xs text-gray-500">Shoots are billed strictly per hour.</p>
          </div>
        </fieldset>
      )}

      <fieldset>
        <Legend step={service.tiers ? 4 : 2} compact={compact}>
          Additional services <span className="font-normal normal-case tracking-normal text-gray-400">(optional)</span>
        </Legend>
        <div className="mt-3 space-y-2">
          {addOns.map((a) => {
            const on = value.addOns.includes(a.id);
            return (
              <label
                key={a.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-colors",
                  on ? "border-plum-300 bg-plum-50/60" : "border-gray-200 bg-white hover:border-plum-200",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-charcoal">{a.label}</span>
                  {!compact && <span className="block text-xs text-gray-500">{a.description}</span>}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-plum-700">+K{a.price.toLocaleString()}</span>
                  <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggleAddOn(a.id)} />
                  <span
                    aria-hidden
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-plum-200",
                      on ? "bg-plum-600" : "bg-gray-200",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
                        on ? "left-[1.375rem]" : "left-0.5",
                      )}
                    />
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function Legend({ step, children, compact }: { step: number; children: React.ReactNode; compact: boolean }) {
  return (
    <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
      {!compact && (
        <span className="grid size-6 place-items-center rounded-full bg-plum-600 text-[11px] text-white">{step}</span>
      )}
      {children}
    </legend>
  );
}

function StepButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full text-plum-700 transition-colors hover:bg-plum-50 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
