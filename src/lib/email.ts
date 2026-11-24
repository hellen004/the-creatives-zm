// Server-only: imported by the /api/bookings route handler, never by client components.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { buildIcs, googleCalendarUrl, type CalendarEvent } from "./calendar";
import { BRAND, PAYMENT_ACCOUNTS } from "./data";
import {
  formatEventDate,
  formatZMK,
  packageLabel,
  toInternational,
  type BookingDetails,
  type Quote,
} from "./pricing";

/**
 * SMTP settings come from environment variables (see .env.example).
 * Gmail works with an App Password: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465.
 */
function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BOOKING_NOTIFY_EMAIL, BOOKING_FROM_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !BOOKING_NOTIFY_EMAIL) return null;
  const port = Number(SMTP_PORT) || 465;
  return {
    transport: { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
    to: BOOKING_NOTIFY_EMAIL,
    from: BOOKING_FROM_EMAIL || `"${BRAND.name} Bookings" <${SMTP_USER}>`,
  };
}

export type EmailResult = { status: "sent" | "saved-to-outbox" | "skipped"; detail?: string };

/** Emails the business owner a booking notification with a calendar invite attached. */
export async function sendOwnerBookingEmail(
  ref: string,
  d: BookingDetails,
  q: Quote,
  evt: CalendarEvent,
): Promise<EmailResult> {
  const ics = buildIcs(evt);
  const gcal = googleCalendarUrl(evt);
  const safeName = d.fullName.replace(/[\r\n]+/g, " ").trim();
  const when = formatEventDate(d.date, d.time);

  const message = {
    subject: `New booking ${ref}: ${packageLabel(q)} — ${safeName} (${when})`,
    replyTo: { name: safeName, address: d.email.trim() },
    text: [
      `New booking request — ${ref}`,
      "",
      evt.description,
      "",
      `Add to Google Calendar: ${gcal}`,
      `Or open the attached ${ref}.ics to add it to Outlook / Apple Calendar.`,
    ].join("\n"),
    html: renderHtml(ref, d, q, gcal),
    icalEvent: { method: "PUBLISH", filename: `${ref}.ics`, content: ics },
  };

  const cfg = smtpConfig();
  if (cfg) {
    const transporter = nodemailer.createTransport(cfg.transport);
    const info = await transporter.sendMail({ ...message, from: cfg.from, to: cfg.to });
    return { status: "sent", detail: info.messageId };
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(`[bookings] SMTP not configured — no owner email sent for ${ref}`);
    return { status: "skipped", detail: "SMTP not configured" };
  }

  // Development fallback: write the email + invite to .data/outbox so they can be previewed.
  const transporter = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "windows" });
  const info = await transporter.sendMail({
    ...message,
    from: `"${BRAND.name} Bookings" <bookings@localhost>`,
    to: "owner@localhost",
  });
  const dir = path.join(process.cwd(), ".data", "outbox");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${ref}.eml`), info.message as Buffer);
  await writeFile(path.join(dir, `${ref}.ics`), ics, "utf8");
  console.info(`[bookings] SMTP not configured — email saved to .data/outbox/${ref}.eml`);
  return { status: "saved-to-outbox", detail: `.data/outbox/${ref}.eml` };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function renderHtml(ref: string, d: BookingDetails, q: Quote, gcal: string) {
  const account = PAYMENT_ACCOUNTS.find((a) => a.id === d.paymentMethod) ?? PAYMENT_ACCOUNTS[0];
  const rows: [string, string][] = [
    ["Client", d.fullName],
    ["Phone", toInternational(d.phone)],
    ["Email", d.email],
    ["When", formatEventDate(d.date, d.time)],
    ["Where", d.location],
    ["Package", packageLabel(q)],
    ...(q.service.hourly ? [["Duration", `${q.hours} hour${q.hours > 1 ? "s" : ""} × ${formatZMK(q.unitPrice)}`] as [string, string]] : []),
    ...(q.addOns.length ? [["Add-ons", q.addOns.map((a) => a.label).join(", ")] as [string, string]] : []),
    ["Total", formatZMK(q.total)],
    ["50% deposit", `${formatZMK(q.deposit)} via ${account.provider}`],
    ["Balance on the day", formatZMK(q.balance)],
    ...(q.freeCanvas ? [["Bonus", "🎉 Free canvas print included"] as [string, string]] : []),
    ...(d.notes.trim() ? [["Notes", d.notes.trim()] as [string, string]] : []),
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:8px 12px;color:#1f2937;font-size:14px;font-weight:600">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f8f9fa;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee">
  <tr><td style="background:#581268;padding:24px 28px">
    <p style="margin:0;color:#e2c6e7;font-size:11px;letter-spacing:3px;text-transform:uppercase">${esc(BRAND.name)}</p>
    <h1 style="margin:6px 0 0;color:#ffffff;font-family:Metropolis,Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold">New booking request</h1>
    <p style="margin:6px 0 0;color:#e5cdea;font-size:13px">Ref ${esc(ref)} · awaiting 50% deposit</p>
  </td></tr>
  <tr><td style="padding:24px 28px 8px" align="center">
    <a href="${esc(gcal)}" style="display:inline-block;background:#0d0d0f;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 24px;border-radius:999px">📅 Add to Google Calendar</a>
    <p style="margin:10px 0 0;color:#6b7280;font-size:12px">Using Outlook or Apple Calendar? Open the attached <b>${esc(ref)}.ics</b> invite.</p>
  </td></tr>
  <tr><td style="padding:16px 16px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tableRows}</table></td></tr>
  <tr><td style="padding:8px 28px 24px">
    <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.5">Reply to this email to contact the client directly. Confirm the slot once the deposit reaches ${esc(account.provider)} (${esc(account.inline)}). Client provides transport to and from the location.</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
