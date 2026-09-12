"use client";

import Image from "next/image";
import Link from "next/link";
import { useAtlas } from "@/context/AtlasContext";
import { formatMoney, formatShortRange } from "@/lib/dates";
import { guestSummary } from "@/lib/copy";

export default function ConfirmClient({ id }: { id: string }) {
  const { bookings } = useAtlas();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-display text-2xl tracking-wide">ATLAS</p>
        <h1 className="mt-4 font-display text-2xl text-slate-900">We couldn’t find that booking</h1>
        <p className="mt-2 text-slate-600">It may be from another browser, or the demo session was cleared. Start from stays whenever you’re ready.</p>
        <Link href="/stays" className="mt-6 inline-flex rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
          Back to stays
        </Link>
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
                <p className="text-slate-500">Demo total</p>
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
          Get directions
        </a>
        <a
          href={`data:text/calendar,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(booking.title)}%0ADTSTART:${booking.from.replace(/-/g, "")}%0ADTEND:${booking.to.replace(/-/g, "")}%0AEND:VEVENT%0AEND:VCALENDAR`}
          download={`${booking.ref}.ics`}
          className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium"
        >
          Add to calendar
        </a>
        <Link href="/trips" className="min-h-11 rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white">
          View in My trips
        </Link>
        {booking.audience === "Corporate" && (
          <Link href={`/bookings/${booking.id}/invoice`} className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium">
            Download invoice PDF
          </Link>
        )}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Free cancellation until {formatShortRange(booking.cancelUntil, booking.cancelUntil).split("–")[0]}. Manage this booking in{" "}
        <Link href="/trips" className="font-medium text-slate-800">My trips</Link>.
      </p>
    </div>
  );
}
