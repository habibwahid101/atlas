"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAtlas } from "@/context/AtlasContext";
import { formatShortRange, parseISO } from "@/lib/dates";
import { guestSummary } from "@/lib/copy";
import type { Booking } from "@/lib/types";

type Tab = "upcoming" | "past" | "cancelled";

function effectiveStatus(b: Booking, today: Date): Tab {
  if (b.status === "cancelled") return "cancelled";
  if (b.status === "past") return "past";
  // upcoming in storage, but ended → past
  const end = parseISO(b.to);
  if (end < today) return "past";
  return "upcoming";
}

export default function TripsPage() {
  const { bookings, cancelBooking } = useAtlas();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const list = useMemo(
    () => bookings.filter((b) => effectiveStatus(b, today) === tab),
    [bookings, tab, today]
  );
  const pending = bookings.find((b) => b.id === confirmId);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!confirmId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmId]);

  function confirmCancel() {
    if (!confirmId) return;
    cancelBooking(confirmId);
    setConfirmId(null);
    setTab("cancelled");
    setToast("Booking cancelled");
  }

  const emptyCopy =
    tab === "upcoming"
      ? "No upcoming trips yet. Browse stays, day trips, or recreation."
      : tab === "past"
        ? "No past trips."
        : "No cancelled trips.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">My trips</h1>
      <p className="mt-1 text-sm text-slate-500">Saved on this device only</p>
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
          <p>{emptyCopy}</p>
          <Link href="/stays" className="mt-4 inline-flex rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
            Browse ATLAS
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((b) => {
            const status = effectiveStatus(b, today);
            return (
              <article key={b.id} className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft">
                <div className="grid sm:grid-cols-[160px_1fr]">
                  <div className="relative min-h-[140px]">
                    <Image src={b.image} alt={b.title} fill className="object-cover" sizes="160px" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-coral capitalize">
                      {status} · {formatShortRange(b.from, b.to)}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{b.title}</h2>
                    <p className="text-sm text-slate-500">{b.location}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {b.audience} · {guestSummary(b.adults, b.children)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Booking {b.ref} · Demo · BDT {b.total.toLocaleString("en-BD")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/bookings/${b.id}/voucher`} className="min-h-11 rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white">
                        View voucher
                      </Link>
                      {status === "upcoming" && (
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
            );
          })}
        </div>
      )}

      {confirmId && pending && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="w-full max-w-md rounded-card bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cancel-title" className="font-display text-xl text-slate-900">
              Cancel this booking?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {pending.title} · {formatShortRange(pending.from, pending.to)}
            </p>
            {pending.cancelUntil && (
              <p className="mt-2 text-sm text-emerald-700">
                Free cancellation until {formatShortRange(pending.cancelUntil, pending.cancelUntil).split("–")[0]}.
              </p>
            )}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="min-h-11 rounded-pill border border-slate-200 px-4 text-sm font-medium"
                onClick={() => setConfirmId(null)}
              >
                Keep it
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-slate-900 px-4 py-2 text-sm text-white shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}
