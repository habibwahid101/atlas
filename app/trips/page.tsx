"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAtlas } from "@/context/AtlasContext";
import { formatMoney, formatShortRange } from "@/lib/dates";

type Tab = "upcoming" | "past" | "cancelled";

export default function TripsPage() {
  const { bookings, cancelBooking } = useAtlas();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const list = useMemo(() => bookings.filter((b) => b.status === tab), [bookings, tab]);
  const pending = bookings.find((b) => b.id === confirmId);

  function confirmCancel() {
    if (!confirmId) return;
    cancelBooking(confirmId);
    setConfirmId(null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">My trips</h1>
      <div className="mt-4 flex gap-4 border-b border-slate-200">
        {(["upcoming", "past", "cancelled"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-11 border-b-2 px-1 text-sm font-medium capitalize ${
              tab === t ? "border-coral text-coral" : "border-transparent text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="mt-12 text-center text-slate-600">
          <p>{tab === "upcoming" ? "No upcoming trips. Explore stays." : "No " + tab + " trips."}</p>
          <Link href="/stays" className="mt-4 inline-flex rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
            Explore stays
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((b) => (
            <article key={b.id} className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft">
              <div className="grid sm:grid-cols-[160px_1fr]">
                <div className="relative min-h-[140px]">
                  <Image src={b.image} alt={b.title} fill className="object-cover" sizes="160px" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-coral capitalize">
                    {b.status} · {formatShortRange(b.from, b.to)}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{b.title}</h2>
                  <p className="text-sm text-slate-500">{b.location}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {b.audience} · {b.adults} adult{b.adults > 1 ? "s" : ""}
                    {b.children ? ` ${b.children} child` : ""}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Booking {b.ref} · Paid {formatMoney(b.total)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/bookings/${b.id}/voucher`} className="min-h-11 rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white">
                      View voucher
                    </Link>
                    {b.status === "upcoming" && (
                      <button
                        type="button"
                        className="min-h-11 px-3 text-sm text-coral"
                        onClick={() => setConfirmId(b.id)}
                      >
                        Cancel booking
                      </button>
                    )}
                    {b.audience === "Corporate" && (
                      <Link href={`/bookings/${b.id}/invoice`} className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm">
                        Invoice PDF
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {confirmId && pending && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
          <div className="w-full max-w-md rounded-card bg-white p-5 shadow-soft">
            <h2 id="cancel-title" className="font-display text-xl text-slate-900">
              Cancel this booking?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {pending.title} · {formatShortRange(pending.from, pending.to)}. This demo cancel is immediate and cannot be undone here.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="min-h-11 rounded-pill border border-slate-200 px-4 text-sm font-medium"
                onClick={() => setConfirmId(null)}
              >
                Keep booking
              </button>
              <button
                type="button"
                className="min-h-11 rounded-pill bg-coral px-4 text-sm font-semibold text-white hover:bg-coral-700"
                onClick={confirmCancel}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
