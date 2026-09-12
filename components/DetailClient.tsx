"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAtlas } from "@/context/AtlasContext";
import { getListing } from "@/lib/data";
import { priceForListing } from "@/lib/pricing";
import { addDays, formatMoney, formatShortRange, nightsBetween } from "@/lib/dates";
import type { Category } from "@/lib/types";
import { notFound } from "next/navigation";

export default function DetailClient({ category, slug }: { category: Category; slug: string }) {
  const listing = getListing(category, slug);
  const { search, addCompare } = useAtlas();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (!listing) return;
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % listing.images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + listing.images.length) % listing.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, listing]);

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

  const extra = Math.max(0, listing.images.length - 5);
  const thumbs = listing.images.slice(0, 5);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null) return;
    const x = e.changedTouches[0]?.clientX ?? touchX.current;
    const dx = x - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setActive((i) => (i + 1) % listing!.images.length);
    else setActive((i) => (i - 1 + listing!.images.length) % listing!.images.length);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div>
        <button
          type="button"
          className="relative aspect-[16/10] w-full overflow-hidden rounded-card text-left sm:aspect-[21/9]"
          onClick={() => setLightbox(true)}
          aria-label="Open photo gallery"
        >
          <Image
            src={listing.images[active] || listing.images[0]}
            alt={`${listing.title} — photo ${active + 1}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </button>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {thumbs.map((src, i) => {
            const isLastOverlay = i === 4 && extra > 0;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28 ${
                  active === i && !isLastOverlay ? "ring-2 ring-coral ring-offset-2" : ""
                }`}
                onClick={() => {
                  if (isLastOverlay) {
                    setActive(i);
                    setLightbox(true);
                  } else {
                    setActive(i);
                  }
                }}
                aria-label={
                  isLastOverlay
                    ? `Open gallery, ${extra} more photos`
                    : `Show ${listing.title} — photo ${i + 1}`
                }
                aria-pressed={active === i}
              >
                <Image
                  src={src}
                  alt={`${listing.title} — photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
                {isLastOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white">
                    +{extra}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-3xl text-slate-900">{listing.title}</h1>
          <p className="mt-1 text-slate-500">
            {listing.location} · ★ {listing.rating.toFixed(1)}
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

      <div className="h-28 lg:hidden" />

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

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm">
              {active + 1} / {listing.images.length}
            </p>
            <button
              type="button"
              className="min-h-11 min-w-11 rounded-full text-lg"
              onClick={() => setLightbox(false)}
              aria-label="Close gallery"
            >
              ✕
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4">
            <button
              type="button"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
              onClick={() => setActive((i) => (i - 1 + listing.images.length) % listing.images.length)}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <div className="relative h-full max-h-[70vh] w-full max-w-4xl">
              <Image
                src={listing.images[active]}
                alt={`${listing.title} — photo ${active + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <button
              type="button"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
              onClick={() => setActive((i) => (i + 1) % listing.images.length)}
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
            {listing.images.map((src, i) => (
              <button
                key={`lb-${src}-${i}`}
                type="button"
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ${
                  active === i ? "ring-2 ring-white" : "opacity-70"
                }`}
                onClick={() => setActive(i)}
                aria-label={`${listing.title} — photo ${i + 1}`}
              >
                <Image src={src} alt={`${listing.title} — photo ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
