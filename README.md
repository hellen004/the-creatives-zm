# The Creatives zm — Portfolio & Booking

Next.js 16 (App Router, TypeScript) + Tailwind CSS 4 + Lucide icons. Built from the official 2026 Price Guide.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
| --- | --- |
| Prices, packages, add-ons, payment accounts, portfolio list | `src/lib/data.ts` |
| Quote maths, 50% deposit, free-canvas rule, phone formatting, WhatsApp message | `src/lib/pricing.ts` |
| Booking API (validates + recomputes price server-side, logs to `.data/bookings.jsonl`) | `src/app/api/bookings/route.ts` |
| Page sections | `src/components/*` |
| Photos (extracted from the price guide) | `public/images/` |

## Owner email + calendar

Every booking emails the owner with an **Add to Google Calendar** button and an `.ics` invite
(Outlook / Apple Calendar). The WhatsApp booking message also contains an "Add to calendar" link.

1. Copy `.env.example` to `.env.local` and fill in the SMTP details and `BOOKING_NOTIFY_EMAIL` (owner's inbox).
   For Gmail, create an App Password at https://myaccount.google.com/apppasswords.
2. Restart `npm run dev`.

Without SMTP settings, development saves each email to `.data/outbox/<ref>.eml` (open it in Outlook or
Windows Mail to preview) and production skips sending. Calendar times use Lusaka time (UTC+2). Hourly
shoots block the booked hours; weddings block 10 hours and traditional events 5 (`durationHours` in
`src/lib/data.ts`).

## Before going live

- **Add-on prices are placeholders** (`ADD_ONS` in `src/lib/data.ts`): extra canvas K350, photo magazine K1,000, express editing K300. The price guide does not list them — confirm or remove.
- Bookings are stored in a local file. On serverless hosting (e.g. Vercel) the file system is not persistent — swap `persist()` in the API route for a database, Google Sheet or email notification.
- The free canvas badge applies to totals **≥ ZMK 1,000** (`FREE_CANVAS_THRESHOLD`).
