"use client";

import Image from "next/image";
import Link from "next/link";
import { useAtlas } from "@/context/AtlasContext";
import { formatMoney, formatShortRange } from "@/lib/dates";
import { guestSummary } from "@/lib/copy";
import { ShareSheet } from "@/components/ShareSheet";
import { useState } from "react";

export default function ConfirmClient({ id }: { id: string }) {
  const { bookings } = useAtlas();
  const [shareOpen, setShareOpen] = useState(false);
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-display text-2xl tracking-wide">ATLAS</p>
        <h1 className="mt-4 font-display text-2xl text-slate-900">This booking isn’t in this browser. Check out again, or open My trips.</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/trips" className="inline-flex rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
            My trips
          </Link>
          <Link href="/stays" className="inline-flex rounded-pill border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800">
            Browse stays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
        <div>
          <h1 className="font-display text-3xl text-slate-900">You’re confirmed.</h1>
          <p className="mt-1 text-slate-600">Demo booking — nothing was charged. Save this page or download your voucher.</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-card border border-slate-200 bg-white shadow-soft">
        <div className="grid sm:grid-cols-[180px_1fr]">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[160px]">
            <Image src={booking.image} alt={booking.title} fill className="object-cover" sizes="180px" />
          </div>
          <div className="p-5">
            <h2 className="font-display text-xl">{booking.title}</h2>
            <p className="text-sm text-slate-500">{booking.location}</p>
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-sm">
              <div>
                <p>{formatShortRange(booking.from, booking.to)}</p>
                <p className="text-slate-500">
                  {booking.audience} · {guestSummary(booking.adults, booking.children)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Total paid</p>
                <p className="text-lg font-semibold">{formatMoney(booking.total)}</p>
                <p className="font-mono text-xs text-slate-500">{booking.ref}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/bookings/${booking.id}/voucher`} className="min-h-11 rounded-pill border border-coral px-4 py-2 text-sm font-medium text-coral">
          Download voucher
        </Link>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`}
          target="_blank"
          rel="noreferrer"
          className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium"
        >
          Directions
        </a>
        <div className="flex flex-col gap-1">
          <a
            href={`data:text/calendar,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(booking.title)}%0ADTSTART:${booking.from.replace(/-/g, "")}%0ADTEND:${booking.to.replace(/-/g, "")}%0AEND:VEVENT%0AEND:VCALENDAR`}
            download={`${booking.ref}.ics`}
            className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium"
          >
            Add to calendar
          </a>
          <p className="px-1 text-xs text-slate-500">Basic calendar file — times may be all-day.</p>
        </div>
        <button
          type="button"
          className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium"
          onClick={() => setShareOpen(true)}
        >
          Share
        </button>
        <Link href="/trips" className="min-h-11 rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white">
          My trips
        </Link>
        {booking.audience === "Corporate" && (
          <Link href={`/bookings/${booking.id}/invoice`} className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium">
            Download invoice
          </Link>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        No confirmation email in demo — save this page or your voucher.
      </p>

      <p className="mt-4 text-sm text-slate-500">
        Free cancellation until {formatShortRange(booking.cancelUntil, booking.cancelUntil).split("–")[0]}. Manage this booking in{" "}
        <Link href="/trips" className="font-medium text-slate-800">My trips</Link>.
      </p>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={booking.title}
        url={typeof window !== "undefined" ? `${window.location.origin}/bookings/${booking.id}` : `/bookings/${booking.id}`}
      />
    </div>
  );
}
