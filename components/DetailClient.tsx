"use client";

import Image from "next/image";
import Link from "next/link";
import { useAtlas } from "@/context/AtlasContext";
import { getListing } from "@/lib/data";
import { priceForListing } from "@/lib/pricing";
import { addDays, formatMoney, formatShortRange, nightsBetween } from "@/lib/dates";
import type { Category } from "@/lib/types";
import { notFound } from "next/navigation";

export default function DetailClient({ category, slug }: { category: Category; slug: string }) {
  const listing = getListing(category, slug);
  const { search, addCompare } = useAtlas();
  if (!listing) return notFound();

  const guests = search.adults + search.children;
  const price = priceForListing(listing, search.from, search.to, guests);
  const cancelUntil = listing.freeCancellation
    ? addDays(search.from, -listing.cancelUntilDays)
    : null;

  let blockReason: string | null = null;
  if (search.audience === "Family" && listing.kidsAllowed === false) {
    blockReason = "Kids are not allowed at this listing.";
  }
  if (search.audience === "Corporate" && !listing.invoiceReady) {
    blockReason = "Corporate invoice is unavailable for this listing.";
  }

  const bookLabel = category === "stays" ? "Book this stay" : "Book this trip";
  const notes =
    search.audience === "Family"
      ? listing.familyNotes
      : search.audience === "Corporate"
        ? listing.corporateNotes
        : listing.soloNotes;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card md:col-span-4 md:aspect-[21/9]">
          <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" priority sizes="100vw" />
        </div>
        {listing.images.slice(1, 5).map((src, i) => (
          <div key={src} className="relative hidden aspect-[4/3] overflow-hidden rounded-xl md:block">
            <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
            {i === 3 && listing.images.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white">
                +{listing.images.length - 5}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-3xl text-slate-900">{listing.title}</h1>
          <p className="mt-1 text-slate-500">
            {listing.location} · ★ {listing.rating.toFixed(1)} · {listing.reviewCount} reviews
          </p>
          <p className="mt-4 max-w-2xl text-slate-700">{listing.description}</p>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">What&apos;s included</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {listing.included.map((item) => (
              <span key={item} className="rounded-pill border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
                {item}
              </span>
            ))}
          </div>

          {notes && notes.length > 0 && (
            <div className="mt-6 rounded-card border border-slate-200 bg-white p-4">
              <p className="font-medium text-slate-900">
                {search.audience === "Family" ? "Family notes" : search.audience === "Corporate" ? "Corporate notes" : "Solo notes"}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="mt-6 min-h-11 w-full rounded-pill border border-slate-200 text-sm font-medium lg:hidden"
            onClick={() => addCompare(listing)}
          >
            Add to compare
          </button>

          {listing.houseRules && (
            <>
              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">House rules</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {listing.houseRules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="h-fit rounded-card border border-slate-200 bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <p className="text-sm text-slate-500">Dates</p>
          <p className="font-medium">{formatShortRange(search.from, search.to)}</p>
          <p className="mt-3 text-sm text-slate-500">Guests</p>
          <p className="font-medium">
            {search.audience} · {search.adults} adult{search.adults > 1 ? "s" : ""}
            {search.children ? `, ${search.children} child` : ""}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Total for {category === "stays" ? `${nightsBetween(search.from, search.to)} nights` : "your dates"} (all-in)
          </p>
          <p className="font-display text-3xl text-slate-900">{formatMoney(price.total)}</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-500">
            <li className="flex justify-between"><span>Room / ticket</span><span>{formatMoney(price.base)}</span></li>
            <li className="flex justify-between"><span>Service</span><span>{formatMoney(price.service)}</span></li>
            <li className="flex justify-between"><span>Tax</span><span>{formatMoney(price.tax)}</span></li>
          </ul>
          {blockReason ? (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{blockReason}</p>
          ) : (
            <Link
              href={`/book/${category}/${slug}`}
              className="mt-4 flex min-h-11 items-center justify-center rounded-pill bg-coral text-sm font-semibold text-white hover:bg-coral-700"
            >
              {bookLabel}
            </Link>
          )}
          <button
            type="button"
            className="mt-2 flex min-h-11 w-full items-center justify-center rounded-pill border border-slate-200 text-sm font-medium"
            onClick={() => addCompare(listing)}
          >
            Add to compare
          </button>
          {cancelUntil && (
            <p className="mt-3 text-sm text-emerald-700">Free cancellation until {formatShortRange(cancelUntil, cancelUntil).split("–")[0]}</p>
          )}
        </aside>
      </div>

      {/* Spacer so content clears sticky bar + compare dock */}
      <div className="h-28 lg:hidden" />

      {/* Mobile sticky CTA — all-in total + Book only */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">{formatMoney(price.total)}</p>
            <p className="text-xs text-slate-500">
              total · {nightsBetween(search.from, search.to)} nights · all-in
            </p>
          </div>
          {!blockReason ? (
            <Link
              href={`/book/${category}/${slug}`}
              className="min-h-11 shrink-0 rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white"
            >
              {bookLabel}
            </Link>
          ) : (
            <p className="max-w-[50%] text-right text-xs text-amber-800">{blockReason}</p>
          )}
        </div>
      </div>
    </div>
  );
}
