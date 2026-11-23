import {
  ADD_ONS,
  BRAND,
  DEPOSIT_RATE,
  FREE_CANVAS_THRESHOLD,
  MAX_HOURS,
  PAYMENT_ACCOUNTS,
  SERVICES,
  type AddOn,
  type PaymentMethodId,
  type Service,
  type Tier,
  type TierId,
} from "./data";

export interface Selection {
  serviceId: string;
  tierId?: TierId;
  hours: number;
  addOns: string[];
}

export const DEFAULT_SELECTION: Selection = {
  serviceId: "wedding",
  tierId: "gold",
  hours: 1,
  addOns: [],
};

export interface Quote {
  service: Service;
  tier?: Tier;
  hours: number;
  unitPrice: number;
  base: number;
  addOns: AddOn[];
  addOnsTotal: number;
  total: number;
  deposit: number;
  balance: number;
  freeCanvas: boolean;
}

export const formatZMK = (n: number) => `ZMK ${n.toLocaleString("en-US")}`;

export function getService(id: string): Service {
  return SERVICES.find((s) => s.id === id) ?? SERVICES[0];
}

export function availableAddOns(service: Service): AddOn[] {
  return ADD_ONS.filter((a) => !a.excludes?.includes(service.id));
}

/** Normalises a selection so it is always valid for the chosen service. */
export function normalizeSelection(sel: Partial<Selection>): Selection {
  const service = getService(sel.serviceId ?? DEFAULT_SELECTION.serviceId);
  const tier = service.tiers
    ? (service.tiers.find((t) => t.id === sel.tierId) ?? service.tiers[service.tiers.length - 1])
    : undefined;
  const hours = service.hourly
    ? Math.min(MAX_HOURS, Math.max(1, Math.round(Number(sel.hours) || 1)))
    : 1;
  const allowed = new Set(availableAddOns(service).map((a) => a.id));
  const addOns = Array.from(new Set(sel.addOns ?? [])).filter((id) => allowed.has(id));
  return { serviceId: service.id, tierId: tier?.id, hours, addOns };
}

export function quote(input: Partial<Selection>): Quote {
  const sel = normalizeSelection(input);
  const service = getService(sel.serviceId);
  const tier = service.tiers?.find((t) => t.id === sel.tierId);
  const unitPrice = tier ? tier.price : (service.price ?? 0);
  const base = unitPrice * sel.hours;
  const addOns = ADD_ONS.filter((a) => sel.addOns.includes(a.id));
  const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
  const total = base + addOnsTotal;
  const deposit = Math.ceil(total * DEPOSIT_RATE);
  return {
    service,
    tier,
    hours: sel.hours,
    unitPrice,
    base,
    addOns,
    addOnsTotal,
    total,
    deposit,
    balance: total - deposit,
    freeCanvas: total >= FREE_CANVAS_THRESHOLD,
  };
}

export function packageLabel(q: Pick<Quote, "service" | "tier">) {
  return q.tier ? `${q.service.title} — ${q.tier.name}` : q.service.title;
}

/* ---------------------------- Zambian phone numbers ---------------------------- */

/** Reduces user input to the 9 local digits that follow +260 (e.g. "975939390"). */
export function toLocalDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("260")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 9);
}

/** "975939390" -> "97 593 9390" */
export function formatLocal(digits: string): string {
  const d = digits.slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5)].filter(Boolean).join(" ");
}

export const isValidZambianMobile = (digits: string) => /^[79]\d{8}$/.test(digits);

export const toInternational = (digits: string) => `+260 ${formatLocal(digits)}`;

/* ---------------------------------- Bookings ---------------------------------- */

export interface BookingDetails {
  fullName: string;
  phone: string; // 9 local digits
  email: string;
  date: string; // yyyy-mm-dd
  time: string; // hh:mm
  location: string;
  notes: string;
  paymentMethod: PaymentMethodId;
  acceptedTerms: boolean;
}

export const EMPTY_DETAILS: BookingDetails = {
  fullName: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  location: "",
  notes: "",
  paymentMethod: "airtel",
  acceptedTerms: false,
};

export type BookingErrors = Partial<Record<keyof BookingDetails, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function todayISO(now = new Date()) {
  const tz = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
}

export function validateContact(d: BookingDetails): BookingErrors {
  const e: BookingErrors = {};
  if (d.fullName.trim().length < 3) e.fullName = "Please enter your full name.";
  if (!isValidZambianMobile(d.phone)) e.phone = "Enter a valid Zambian mobile number, e.g. 97 593 9390.";
  if (!EMAIL_RE.test(d.email.trim())) e.email = "Please enter a valid email address.";
  return e;
}

export function validateEvent(d: BookingDetails, today = todayISO()): BookingErrors {
  const e: BookingErrors = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) e.date = "Choose the date of your event or shoot.";
  else if (d.date < today) e.date = "The date can't be in the past.";
  if (!/^\d{2}:\d{2}$/.test(d.time)) e.time = "Choose a start time.";
  if (d.location.trim().length < 3) e.location = "Tell us where the shoot will take place.";
  return e;
}

export function validateReview(d: BookingDetails): BookingErrors {
  const e: BookingErrors = {};
  if (!PAYMENT_ACCOUNTS.some((a) => a.id === d.paymentMethod)) e.paymentMethod = "Choose a payment method.";
  if (!d.acceptedTerms) e.acceptedTerms = "Please accept the booking terms to continue.";
  return e;
}

export function validateBooking(d: BookingDetails, today?: string): BookingErrors {
  return { ...validateContact(d), ...validateEvent(d, today), ...validateReview(d) };
}

export function makeReference(now = new Date()) {
  const ymd = todayISO(now).slice(2).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TCZ-${ymd}-${rand}`;
}

export function formatEventDate(date: string, time: string) {
  if (!date) return "";
  const d = new Date(`${date}T${time || "00:00"}`);
  const day = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  return time ? `${day} at ${time}` : day;
}

export function buildWhatsAppMessage(ref: string, d: BookingDetails, q: Quote, calendarUrl?: string) {
  const account = PAYMENT_ACCOUNTS.find((a) => a.id === d.paymentMethod) ?? PAYMENT_ACCOUNTS[0];
  const lines = [
    `*NEW BOOKING REQUEST — ${BRAND.name}*`,
    `Ref: ${ref}`,
    ``,
    `👤 *Name:* ${d.fullName.trim()}`,
    `📞 *Phone:* ${toInternational(d.phone)}`,
    `✉️ *Email:* ${d.email.trim()}`,
    ``,
    `📅 *Date:* ${formatEventDate(d.date, d.time)}`,
    `📍 *Location:* ${d.location.trim()}`,
    `📸 *Package:* ${packageLabel(q)}`,
    ...(q.service.hourly ? [`⏱️ *Duration:* ${q.hours} hour${q.hours > 1 ? "s" : ""} × ${formatZMK(q.unitPrice)}`] : []),
    ...(q.addOns.length ? [`➕ *Add-ons:* ${q.addOns.map((a) => a.label).join(", ")}`] : []),
    ``,
    `💰 *Total:* ${formatZMK(q.total)}`,
    `✅ *50% Deposit (non-refundable):* ${formatZMK(q.deposit)}`,
    `💳 *Paying via:* ${account.provider} (${account.number} — ${account.name})`,
    ...(q.freeCanvas ? [`🎉 Free canvas print included!`] : []),
    ...(d.notes.trim() ? [``, `📝 *Notes:* ${d.notes.trim()}`] : []),
    ...(calendarUrl ? [``, `🗓️ *Add to calendar:* ${calendarUrl}`] : []),
    ``,
    `I agree to the booking terms (50% non-refundable deposit; client provides transport to and from the location).`,
  ];
  return lines.join("\n");
}

export const whatsappUrl = (message: string) =>
  `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
