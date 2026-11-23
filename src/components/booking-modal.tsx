"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { bookingEvent, googleCalendarUrl } from "@/lib/calendar";
import { PAYMENT_ACCOUNTS } from "@/lib/data";
import {
  EMPTY_DETAILS,
  buildWhatsAppMessage,
  formatEventDate,
  formatLocal,
  formatZMK,
  makeReference,
  normalizeSelection,
  quote,
  toInternational,
  toLocalDigits,
  todayISO,
  validateContact,
  validateEvent,
  validateReview,
  whatsappUrl,
  type BookingDetails,
  type BookingErrors,
  type Selection,
} from "@/lib/pricing";
import { PackageOptions } from "./package-options";
import { QuoteSummary } from "./quote-summary";
import { buttonStyles, cn } from "./ui";

const STEPS = ["Your details", "Event & package", "Review & pay"] as const;

export function BookingModal({ initialSelection, onClose }: { initialSelection: Selection; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState(initialSelection);
  const [details, setDetails] = useState<BookingDetails>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sent, setSent] = useState<{ ref: string; url: string } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const q = useMemo(() => quote(selection), [selection]);
  const today = useMemo(() => todayISO(), []);

  // Escape to close, lock page scroll, focus the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input, select, button:not([data-close])")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step, sent]);

  const update = <K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validators = [validateContact, (d: BookingDetails) => validateEvent(d, today), validateReview];

  const next = () => {
    const errs = validators[step](details);
    setErrors(errs);
    if (Object.keys(errs).length) {
      dialogRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStep((s) => s + 1);
  };

  const submit = () => {
    const all = { ...validateContact(details), ...validateEvent(details, today), ...validateReview(details) };
    setErrors(all);
    if (Object.keys(all).length) {
      if (all.fullName || all.phone || all.email) setStep(0);
      else if (all.date || all.time || all.location) setStep(1);
      return;
    }
    const ref = makeReference();
    const sel = normalizeSelection(selection);
    const calendarUrl = googleCalendarUrl(bookingEvent(ref, details, q), { short: true });
    const url = whatsappUrl(buildWhatsAppMessage(ref, details, q, calendarUrl));

    // Record the request server-side (fire-and-forget) — WhatsApp must open synchronously
    // inside the click handler so pop-up blockers don't stop it.
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: ref, details, selection: sel }),
      keepalive: true,
    }).catch(() => {});

    window.open(url, "_blank", "noopener,noreferrer");
    setSent({ ref, url });
  };

  const account = PAYMENT_ACCOUNTS.find((a) => a.id === details.paymentMethod) ?? PAYMENT_ACCOUNTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-plum-950/50 backdrop-blur-md" onClick={onClose} aria-hidden />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative flex max-h-[95dvh] w-full max-w-2xl animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-5 pb-4 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-plum-600">The Creatives zm</p>
              <h2 id="booking-title" className="mt-1 font-serif text-2xl text-charcoal">
                {sent ? "Booking request sent" : "Book your session"}
              </h2>
            </div>
            <button
              data-close
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-charcoal"
              aria-label="Close booking form"
            >
              <X className="size-5" />
            </button>
          </div>

          {!sent && (
            <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Booking progress">
              {STEPS.map((label, i) => (
                <li key={label} aria-current={i === step ? "step" : undefined}>
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-300",
                      i <= step ? "bg-plum-600" : "bg-gray-200",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 text-[11px] font-medium sm:text-xs",
                      i === step ? "text-plum-700" : "text-gray-400",
                    )}
                  >
                    <span className="hidden sm:inline">{i + 1}. </span>
                    {label}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {sent ? (
            <Success refCode={sent.ref} url={sent.url} deposit={q.deposit} account={account} />
          ) : step === 0 ? (
            <div className="space-y-5">
              <Field label="Client full name" icon={<User />} error={errors.fullName} htmlFor="fullName">
                <input
                  id="fullName"
                  autoComplete="name"
                  value={details.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="e.g. Mwila Banda"
                  aria-invalid={!!errors.fullName}
                  className={inputCls(!!errors.fullName)}
                />
              </Field>
              <Field label="Phone number" icon={<Phone />} error={errors.phone} htmlFor="phone" hint="Zambian mobile (Airtel, MTN or Zamtel)">
                <div className="flex">
                  <span className="inline-flex items-center whitespace-nowrap rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600">
                    +260
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    value={formatLocal(details.phone)}
                    onChange={(e) => {
                      let digits = toLocalDigits(e.target.value);
                      // Backspacing over a formatting space should still delete a digit.
                      if (digits === details.phone && e.target.value.length < formatLocal(details.phone).length) {
                        digits = digits.slice(0, -1);
                      }
                      update("phone", digits);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      update("phone", toLocalDigits(e.clipboardData.getData("text")));
                    }}
                    placeholder="97 123 4567"
                    aria-invalid={!!errors.phone}
                    className={cn(inputCls(!!errors.phone), "rounded-l-none")}
                  />
                </div>
              </Field>
              <Field label="Email address" icon={<Mail />} error={errors.email} htmlFor="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={details.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>
          ) : step === 1 ? (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Date of event / shoot" icon={<CalendarDays />} error={errors.date} htmlFor="date">
                  <input
                    id="date"
                    type="date"
                    min={today}
                    value={details.date}
                    onChange={(e) => update("date", e.target.value)}
                    aria-invalid={!!errors.date}
                    className={inputCls(!!errors.date)}
                  />
                </Field>
                <Field label="Start time" icon={<Clock />} error={errors.time} htmlFor="time">
                  <input
                    id="time"
                    type="time"
                    value={details.time}
                    onChange={(e) => update("time", e.target.value)}
                    aria-invalid={!!errors.time}
                    className={inputCls(!!errors.time)}
                  />
                </Field>
              </div>
              <Field
                label="Shoot location / venue"
                icon={<MapPin />}
                error={errors.location}
                htmlFor="location"
                hint="Transport to and from the location is provided by the client."
              >
                <input
                  id="location"
                  value={details.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="e.g. Cathedral of the Holy Cross, Lusaka"
                  aria-invalid={!!errors.location}
                  className={inputCls(!!errors.location)}
                />
              </Field>

              <div className="rounded-2xl border border-gray-100 bg-cream/70 p-4 sm:p-5">
                <PackageOptions
                  value={selection}
                  onChange={(patch) => setSelection((s) => normalizeSelection({ ...s, ...patch }))}
                  compact
                />
                <p className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-sm">
                  <span className="text-gray-500">Running total</span>
                  <span className="font-serif text-lg font-semibold text-plum-700">{formatZMK(q.total)}</span>
                </p>
              </div>

              <Field label="Notes (optional)" htmlFor="notes">
                <textarea
                  id="notes"
                  rows={3}
                  value={details.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Theme, number of guests, special shots you'd love…"
                  className={cn(inputCls(false), "resize-none")}
                />
              </Field>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-3 rounded-2xl border border-gray-100 bg-cream/70 p-4 text-sm sm:grid-cols-2">
                <Info label="Client" value={details.fullName} />
                <Info label="Phone" value={toInternational(details.phone)} />
                <Info label="Email" value={details.email} />
                <Info label="When" value={formatEventDate(details.date, details.time)} />
                <Info label="Where" value={details.location} wide />
              </div>

              <QuoteSummary quote={q} />

              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Pay deposit with
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PAYMENT_ACCOUNTS.map((a) => {
                    const active = a.id === details.paymentMethod;
                    return (
                      <label
                        key={a.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                          active ? "border-plum-600 bg-plum-50 ring-2 ring-plum-600/20" : "border-gray-200 hover:border-plum-300",
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={a.id}
                          checked={active}
                          onChange={() => update("paymentMethod", a.id)}
                          className="mt-1 accent-plum-600"
                        />
                        <span>
                          <span className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                            <span
                              className={cn(
                                "size-2.5 rounded-full",
                                a.id === "airtel" ? "bg-red-600" : "bg-yellow-400",
                              )}
                              aria-hidden
                            />
                            {a.provider}
                          </span>
                          <span className="mt-0.5 block font-mono text-sm text-plum-700">{a.number}</span>
                          <span className="block text-xs text-gray-500">Name: {a.name}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={details.acceptedTerms}
                    onChange={(e) => update("acceptedTerms", e.target.checked)}
                    aria-invalid={!!errors.acceptedTerms}
                    className="mt-0.5 size-4 accent-plum-600"
                  />
                  <span>
                    I understand the <strong>50% deposit is non-refundable</strong> and secures my slot, and that I
                    will provide <strong>transport to and from</strong> the shoot location.
                  </span>
                </label>
                {errors.acceptedTerms && <p className="mt-1.5 text-xs text-red-600">{errors.acceptedTerms}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-8">
          {sent ? (
            <button onClick={onClose} className={cn(buttonStyles.primary, "ml-auto")}>
              Done
            </button>
          ) : (
            <>
              {step > 0 ? (
                <button onClick={() => setStep((s) => s - 1)} className={cn(buttonStyles.secondary, "px-4")}>
                  <ArrowLeft className="size-4" aria-hidden /> Back
                </button>
              ) : (
                <span className="hidden text-xs text-gray-500 sm:block">
                  Deposit due: <strong className="text-plum-700">{formatZMK(q.deposit)}</strong>
                </span>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={next} className={cn(buttonStyles.primary, "ml-auto")}>
                  Continue <ArrowRight className="size-4" aria-hidden />
                </button>
              ) : (
                <button onClick={submit} className={cn(buttonStyles.primary, "ml-auto bg-[#128C4A] shadow-green-700/25 hover:bg-[#0f7a40]")}>
                  <MessageCircle className="size-4" aria-hidden />
                  <span className="sm:hidden">Submit & pay deposit</span>
                  <span className="hidden sm:inline">Submit & Pay Deposit via Mobile Money</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Success({
  refCode,
  url,
  deposit,
  account,
}: {
  refCode: string;
  url: string;
  deposit: number;
  account: (typeof PAYMENT_ACCOUNTS)[number];
}) {
  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto size-14 text-plum-600" aria-hidden />
      <p className="mt-4 text-sm text-gray-600">
        Your booking details have been prepared in WhatsApp. Send the message to confirm your request.
      </p>
      <p className="mt-3 inline-block rounded-full bg-plum-50 px-4 py-1.5 font-mono text-sm font-semibold text-plum-700">
        Ref: {refCode}
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-gold-400/60 bg-gold-200/30 p-5 text-left">
        <p className="flex items-center gap-2 text-sm font-semibold text-plum-800">
          <ShieldCheck className="size-4" aria-hidden /> Next: pay your 50% deposit
        </p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Amount</dt>
            <dd className="font-semibold text-charcoal">{formatZMK(deposit)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">{account.provider}</dt>
            <dd className="font-mono font-semibold text-charcoal">{account.number}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Name</dt>
            <dd className="font-semibold text-charcoal">{account.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Reference</dt>
            <dd className="font-mono font-semibold text-charcoal">{refCode}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-gray-600">
          Your slot is secured once the deposit is received. Share the payment confirmation on WhatsApp.
        </p>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#128C4A] underline-offset-4 hover:underline"
      >
        <MessageCircle className="size-4" aria-hidden /> WhatsApp didn&apos;t open? Tap here
      </a>
    </div>
  );
}

const inputCls = (invalid: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-gray-400 focus:ring-4",
    invalid ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-plum-500 focus:ring-plum-100",
  );

function Field({
  label,
  icon,
  error,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-charcoal">
        {icon && <span className="text-plum-500 [&>svg]:size-4">{icon}</span>}
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}

function Info({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-0.5 break-words font-medium text-charcoal">{value}</p>
    </div>
  );
}
