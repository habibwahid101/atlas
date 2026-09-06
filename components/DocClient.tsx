"use client";

import { useAtlas } from "@/context/AtlasContext";
import { formatMoney, formatShortRange } from "@/lib/dates";

export default function DocClient({ id, kind }: { id: string; kind: "voucher" | "invoice" }) {
  const { bookings } = useAtlas();
  const b = bookings.find((x) => x.id === id);
  if (!b) return <div className="p-8">Document not found in this browser.</div>;

  return (
    <div className="mx-auto max-w-xl bg-white p-8 print:p-0">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">ATLAS</h1>
        <button type="button" onClick={() => window.print()} className="rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white print:hidden">
          Print / Save PDF
        </button>
      </div>
      <h2 className="mt-6 text-xl font-semibold">{kind === "voucher" ? "Travel voucher" : "Tax invoice"}</h2>
      <p className="text-sm text-slate-500">{b.ref}</p>
      <div className="mt-6 space-y-2 text-sm">
        <p><strong>{b.title}</strong></p>
        <p>{b.location}</p>
        <p>{formatShortRange(b.from, b.to)}</p>
        <p>
          {b.audience} · {b.guestName} · {b.guestEmail} · {b.guestMobile}
        </p>
        {kind === "invoice" && (
          <>
            <p>Company: {b.companyName}</p>
            <p>Billing email: {b.billingEmail}</p>
            {b.tin && <p>TIN / VAT: {b.tin}</p>}
          </>
        )}
        <p className="pt-4 text-lg font-semibold">Total {formatMoney(b.total)}</p>
        <ul className="text-slate-600">
          <li>Base: {formatMoney(b.breakdown.base)}</li>
          <li>Service: {formatMoney(b.breakdown.service)}</li>
          <li>Tax: {formatMoney(b.breakdown.tax)}</li>
        </ul>
        <p className="pt-4 text-xs text-slate-500">Host contact appears on this voucher only. No in-app chat in v1.</p>
      </div>
    </div>
  );
}
