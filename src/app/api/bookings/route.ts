import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { bookingEvent } from "@/lib/calendar";
import { sendOwnerBookingEmail, type EmailResult } from "@/lib/email";
import {
  EMPTY_DETAILS,
  normalizeSelection,
  packageLabel,
  quote,
  validateBooking,
  type BookingDetails,
  type Selection,
} from "@/lib/pricing";

/**
 * Records a booking request. The authoritative price is recomputed on the server from the
 * price list, so a tampered client total is never trusted.
 *
 * Storage is a local JSON-lines file (`.data/bookings.jsonl`), which is fine for a single
 * server. On serverless hosting swap `persist()` for a database, Google Sheet or email.
 */
export async function POST(request: Request) {
  let body: { reference?: unknown; details?: Partial<BookingDetails>; selection?: Partial<Selection> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const details: BookingDetails = { ...EMPTY_DETAILS };
  for (const key of Object.keys(EMPTY_DETAILS) as (keyof BookingDetails)[]) {
    const v = body.details?.[key];
    if (typeof v === typeof EMPTY_DETAILS[key]) (details as unknown as Record<string, unknown>)[key] = v;
  }
  for (const key of ["fullName", "email", "location", "notes"] as const) {
    details[key] = details[key].slice(0, key === "notes" ? 1000 : 200);
  }

  // Allow a one-day tolerance for client/server timezone differences.
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const errors = validateBooking(details, yesterday);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const reference =
    typeof body.reference === "string" && /^TCZ-\d{6}-[A-Z0-9]{4}$/.test(body.reference)
      ? body.reference
      : `TCZ-${Date.now().toString(36).toUpperCase()}`;

  const q = quote(normalizeSelection(body.selection ?? {}));
  const record = {
    reference,
    receivedAt: new Date().toISOString(),
    client: { name: details.fullName, phone: `+260${details.phone}`, email: details.email },
    event: { date: details.date, time: details.time, location: details.location, notes: details.notes },
    package: packageLabel(q),
    hours: q.hours,
    addOns: q.addOns.map((a) => a.label),
    total: q.total,
    deposit: q.deposit,
    freeCanvas: q.freeCanvas,
    paymentMethod: details.paymentMethod,
    status: "awaiting-deposit",
  };

  try {
    await persist(record);
  } catch (err) {
    console.error("[bookings] failed to persist booking", reference, err);
  }

  // Notify the owner by email with an "Add to calendar" link and an .ics invite.
  let email: EmailResult;
  try {
    email = await sendOwnerBookingEmail(reference, details, q, bookingEvent(reference, details, q));
  } catch (err) {
    console.error("[bookings] failed to send owner email", reference, err);
    email = { status: "skipped", detail: "send failed" };
  }

  return NextResponse.json(
    { ok: true, reference, total: q.total, deposit: q.deposit, ownerEmail: email.status },
    { status: 201 },
  );
}

async function persist(record: object) {
  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "bookings.jsonl"), JSON.stringify(record) + "\n", "utf8");
}
