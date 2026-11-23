import { BRAND, PAYMENT_ACCOUNTS } from "./data";
import {
  formatEventDate,
  formatZMK,
  packageLabel,
  toInternational,
  type BookingDetails,
  type Quote,
} from "./pricing";

/** Lusaka is on Central Africa Time: UTC+2 all year, no daylight saving. */
export const BUSINESS_TIMEZONE = "Africa/Lusaka";
const UTC_OFFSET_HOURS = 2;
const DEFAULT_DURATION_HOURS = 4;

export interface CalendarEvent {
  uid: string;
  title: string;
  /** Full details (email / .ics). */
  description: string;
  /** Shorter details that keep links compact (WhatsApp). */
  shortDescription: string;
  location: string;
  start: Date;
  end: Date;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function bookingEvent(ref: string, d: BookingDetails, q: Quote): CalendarEvent {
  const [y, m, day] = d.date.split("-").map(Number);
  const [hh, mm] = d.time.split(":").map(Number);
  const start = new Date(Date.UTC(y, m - 1, day, hh - UTC_OFFSET_HOURS, mm));
  const hours = q.service.hourly ? q.hours : (q.service.durationHours ?? DEFAULT_DURATION_HOURS);
  const end = new Date(start.getTime() + hours * 3_600_000);

  const account = PAYMENT_ACCOUNTS.find((a) => a.id === d.paymentMethod) ?? PAYMENT_ACCOUNTS[0];
  const name = oneLine(d.fullName);

  const core = [
    `Ref: ${ref}`,
    `Client: ${name}`,
    `Phone: ${toInternational(d.phone)}`,
    `Package: ${packageLabel(q)}${q.service.hourly ? ` (${q.hours} hr${q.hours > 1 ? "s" : ""})` : ""}`,
    `Total: ${formatZMK(q.total)} | 50% deposit: ${formatZMK(q.deposit)}`,
  ];

  const description = [
    `Booking request via ${BRAND.name} website`,
    "",
    ...core,
    `Email: ${oneLine(d.email)}`,
    `When: ${formatEventDate(d.date, d.time)} (${hours} hr${hours > 1 ? "s" : ""})`,
    ...(q.addOns.length ? [`Add-ons: ${q.addOns.map((a) => a.label).join(", ")}`] : []),
    `Balance on the day: ${formatZMK(q.balance)}`,
    `Deposit via: ${account.provider} (${account.number})`,
    ...(q.freeCanvas ? ["Free canvas print included"] : []),
    ...(d.notes.trim() ? ["", `Notes: ${d.notes.trim()}`] : []),
    "",
    "Status: awaiting 50% deposit — confirm the slot once it is received.",
    "Client provides transport to and from the location.",
  ].join("\n");

  return {
    uid: `${ref}@thecreativeszm`,
    title: `${packageLabel(q)} — ${name}`,
    description,
    shortDescription: core.join("\n"),
    location: oneLine(d.location),
    start,
    end,
  };
}

/** 2026-12-19T12:30:00.000Z -> 20261219T123000Z */
const toICalUTC = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** "Add to Google Calendar" link — opens a pre-filled event the owner saves with one tap. */
export function googleCalendarUrl(evt: CalendarEvent, { short = false } = {}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: evt.title,
    dates: `${toICalUTC(evt.start)}/${toICalUTC(evt.end)}`,
    ctz: BUSINESS_TIMEZONE,
    details: short ? evt.shortDescription : evt.description,
    location: evt.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeICalText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Folds content lines to 75 octets as required by RFC 5545 (UTF-8 safe). */
function foldLine(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

/** Standard .ics invite — works with Google Calendar, Outlook and Apple Calendar. */
export function buildIcs(evt: CalendarEvent, now = new Date()) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${BRAND.name}//Bookings//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${evt.uid}`,
    `DTSTAMP:${toICalUTC(now)}`,
    `DTSTART:${toICalUTC(evt.start)}`,
    `DTEND:${toICalUTC(evt.end)}`,
    `SUMMARY:${escapeICalText(evt.title)}`,
    `DESCRIPTION:${escapeICalText(evt.description)}`,
    `LOCATION:${escapeICalText(evt.location)}`,
    "STATUS:TENTATIVE",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICalText(`Tomorrow: ${evt.title}`)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICalText(`In 2 hours: ${evt.title}`)}`,
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
