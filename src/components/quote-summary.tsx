import { type Quote, formatZMK, packageLabel } from "@/lib/pricing";
import { FREE_CANVAS_THRESHOLD } from "@/lib/data";
import { FreeCanvasBadge, cn } from "./ui";

/** Itemised price breakdown with total, 50% deposit and the free-canvas rule. */
export function QuoteSummary({ quote: q, dark = false }: { quote: Quote; dark?: boolean }) {
  const muted = dark ? "text-plum-200" : "text-gray-500";
  const strong = dark ? "text-white" : "text-charcoal";
  const divider = dark ? "border-white/15" : "border-gray-100";

  const deliverables = q.tier
    ? [`${q.tier.photos} edited soft copy photos`, ...(q.tier.extras ?? [])]
    : q.service.deliverables;

  return (
    <div>
      <p className={cn("text-xs font-semibold uppercase tracking-widest", muted)}>Your selection</p>
      <p className={cn("mt-1 font-serif text-xl leading-snug", strong)}>{packageLabel(q)}</p>
      <p className={cn("mt-1 text-xs", muted)}>{deliverables.join(" · ")}</p>

      <dl className={cn("mt-5 space-y-2.5 border-t pt-4 text-sm", divider)}>
        <Row
          label={q.service.hourly ? `${formatZMK(q.unitPrice)} × ${q.hours} hr${q.hours > 1 ? "s" : ""}` : "Package price"}
          value={formatZMK(q.base)}
          muted={muted}
          strong={strong}
        />
        {q.addOns.map((a) => (
          <Row key={a.id} label={a.label} value={`+ ${formatZMK(a.price)}`} muted={muted} strong={strong} />
        ))}
        {q.freeCanvas && !q.service.includesCanvas && (
          <Row label="Canvas print" value="FREE" muted={muted} strong={dark ? "text-white" : "text-plum-700"} />
        )}
      </dl>

      <div className={cn("mt-4 flex items-end justify-between border-t pt-4", divider)}>
        <span className={cn("text-sm font-medium", muted)}>Total</span>
        <span className={cn("font-serif text-3xl font-semibold", dark ? "text-white" : "text-plum-700")}>
          {formatZMK(q.total)}
        </span>
      </div>

      <div
        className={cn(
          "mt-4 rounded-2xl border p-4",
          dark ? "border-white/20 bg-white/10" : "border-plum-100 bg-plum-50",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className={cn("text-sm font-semibold", dark ? "text-white" : "text-plum-700")}>
            50% deposit due now
          </span>
          <span className={cn("font-serif text-xl font-semibold", dark ? "text-white" : "text-plum-700")}>
            {formatZMK(q.deposit)}
          </span>
        </div>
        <p className={cn("mt-1 text-xs", muted)}>
          Non-refundable · secures your slot. Balance of {formatZMK(q.balance)} due on the day.
        </p>
      </div>

      {q.freeCanvas ? (
        <FreeCanvasBadge className="mt-4" />
      ) : (
        <p className={cn("mt-4 text-center text-xs", muted)}>
          Add {formatZMK(FREE_CANVAS_THRESHOLD - q.total)} more to unlock a free canvas print.
        </p>
      )}
    </div>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted: string; strong: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={muted}>{label}</dt>
      <dd className={cn("font-medium", strong)}>{value}</dd>
    </div>
  );
}
