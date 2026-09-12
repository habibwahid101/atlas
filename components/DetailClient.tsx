"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { DatesGuestsSheet } from "@/components/DatesGuestsSheet";
import { LocationMap } from "@/components/LocationMap";
import { ShareSheet } from "@/components/ShareSheet";
import { IconClose } from "@/components/Icons";
import { BLUR_DATA_URL } from "@/lib/utils";
import { COMPARE_CAP_MESSAGE, emitCompareCapToast } from "@/lib/compare-cap-toast";
import { useAtlas } from "@/context/AtlasContext";
import { getListing } from "@/lib/data";
import { guestSummary } from "@/lib/copy";
import { priceForListing } from "@/lib/pricing";
import { addDays, formatMoney, formatShortRange, nightsBetween } from "@/lib/dates";
import { validateDateRange } from "@/lib/availability";
import type { Audience, Category } from "@/lib/types";
import { notFound } from "next/navigation";

export default function DetailClient({ category, slug }: { category: Category; slug: string }) {
  const listing = getListing(category, slug);
  const { search, setSearch, setAudience, addCompare, compare, setCompareOpen } = useAtlas();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxOpenerRef = useRef<HTMLElement | null>(null);
  const { panelRef: lightboxRef } = useDialogA11y(lightbox, () => setLightbox(false), {
    initialFocusRef: lightboxCloseRef,
    openerRef: lightboxOpenerRef,
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const datesOpenerRef = useRef<HTMLElement | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const shareOpenerRef = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (!listing) return;
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % listing.images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + listing.images.length) % listing.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, listing]);

  const dateBlock = useMemo(
    () =>
      listing
        ? validateDateRange({
            from: search.from,
            to: search.to,
            category,
            minNights: listing.minNights,
            soldOutDates: listing.soldOutDates,
          })
        : null,
    [listing, search.from, search.to, category]
  );

  if (!listing) return notFound();
  const item = listing;

  const price = priceForListing(listing, search.from, search.to, search.adults + search.children);
  const cancelUntil = listing.freeCancellation
    ? addDays(search.from, -listing.cancelUntilDays)
    : null;

  let blockReason: string | null = null;
  if (search.audience === "Family" && listing.kidsAllowed === false) {
    blockReason = "This listing doesn’t take children.";
  }
  if (search.audience === "Corporate" && !listing.invoiceReady) {
    blockReason = "This listing doesn’t issue invoices.";
  }
  if (!blockReason && dateBlock) {
    blockReason = dateBlock;
  }

  const bookLabel = category === "stays" ? "Reserve this stay" : "Reserve this trip";
  const notes =
    search.audience === "Family"
      ? listing.familyNotes
      : search.audience === "Corporate"
        ? listing.corporateNotes
        : listing.soloNotes;

  const extra = Math.max(0, listing.images.length - 5);
  const thumbs = listing.images.slice(0, 5);
  const lineLabel = category === "stays" ? "Stay" : category === "day-trips" ? "Day trip" : "Activity";
  const nights = nightsBetween(search.from, search.to);
  const stickyLine =
    category === "stays"
      ? `${formatMoney(price.total)} total · ${nights.toLocaleString("en-BD")} nights · all-in`
      : `${formatMoney(price.total)} total · all-in`;

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

  const wa = listing.hostWhatsApp || listing.hostPhone.replace(/\D/g, "");
  const inCompare = compare.some((x) => x.id === item.id);
  const compareFull = compare.length >= 3 && !inCompare;
  const hasReviews = Array.isArray(listing.reviews) && listing.reviews.length > 0;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${category}/${slug}`
      : `/${category}/${slug}`;

  function onCompareClick() {
    if (inCompare) {
      setCompareOpen(true);
      return;
    }
    if (compare.length >= 3) {
      emitCompareCapToast(COMPARE_CAP_MESSAGE);
      setCompareOpen(true);
      return;
    }
    addCompare(item);
  }

  const compareLabel = inCompare
    ? compare.length >= 3
      ? "Added · 3 of 3"
      : "In compare"
    : compareFull
      ? "Compare full (3/3)"
      : "Add to compare";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div>
        <button
          type="button"
          className="relative aspect-[16/10] w-full overflow-hidden rounded-card text-left sm:aspect-[21/9]"
          onClick={(e) => {
            lightboxOpenerRef.current = e.currentTarget;
            setLightbox(true);
          }}
          aria-label="Open photo gallery"
        >
          <Image
            src={listing.images[active] || listing.images[0]}
            alt={`${listing.title} — photo ${active + 1}`}
            fill
            className="object-cover"
            priority={active === 0}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="(max-width:1024px) 100vw, 1200px"
          />
        </button>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-1">
          {thumbs.map((src, i) => {
            const isLastOverlay = i === 4 && extra > 0;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28 ${
                  active === i && !isLastOverlay ? "ring-2 ring-coral ring-offset-2" : ""
                }`}
                onClick={(e) => {
                  if (isLastOverlay) {
                    setActive(i);
                    lightboxOpenerRef.current = e.currentTarget;
                    setLightbox(true);
                  } else setActive(i);
                }}
                aria-label={isLastOverlay ? `Open gallery, ${extra} more photos` : `Show ${listing.title} — photo ${i + 1}`}
                aria-pressed={active === i}
              >
                <Image src={src} alt={`${listing.title} — photo ${i + 1}`} fill className="object-cover" sizes="112px" loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
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

          {hasReviews && (
            <section className="mt-8" data-testid="guest-reviews">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Guest reviews</h2>
              <p className="mt-2 text-sm text-slate-700">
                ★ {listing.rating.toFixed(1)} · {listing.reviewCount} reviews
              </p>
              <ul className="mt-4 space-y-4">
                {listing.reviews!.map((r) => (
                  <li key={r.id} className="rounded-card border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <p className="font-medium text-slate-900">
                        {r.name} · {r.date} · ★ {r.rating}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">What&apos;s included</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {listing.included.map((inc) => (
              <span key={inc} className="rounded-pill border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
                {inc}
              </span>
            ))}
          </div>

          <section className="mt-8 rounded-card border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Operator</h2>
            <p className="mt-2 font-medium text-slate-900">{listing.hostName}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${listing.hostPhone}`} className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium">
                Call
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium"
              >
                WhatsApp
              </a>
              <a href={`mailto:${listing.hostEmail}`} className="min-h-11 rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium">
                Email
              </a>
            </div>
          </section>

          {typeof listing.lat === "number" && typeof listing.lng === "number" ? (
            <LocationMap lat={listing.lat} lng={listing.lng} place={listing.place} />
          ) : null}

          {notes && notes.length > 0 && (
            <div className="mt-6 rounded-card border border-slate-200 bg-white p-4">
              <p className="font-medium text-slate-900">
                {search.audience === "Family" ? "For families" : search.audience === "Corporate" ? "For work trips" : "For solo travelers"}
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
            className={`mt-6 min-h-11 w-full rounded-pill border text-sm font-medium lg:hidden ${
              compareFull || inCompare ? "border-slate-200 text-slate-600" : "border-slate-200 text-slate-800"
            }`}
            onClick={onCompareClick}
          >
            {compareLabel}
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
          <button type="button" className="w-full text-left" onClick={(e) => { datesOpenerRef.current = e.currentTarget; setSheetOpen(true); }}>
            <p className="text-sm text-slate-500">Dates</p>
            <p className="font-medium text-coral underline-offset-2 hover:underline">{formatShortRange(search.from, search.to)}</p>
            <p className="mt-3 text-sm text-slate-500">Guests</p>
            <p className="font-medium text-coral underline-offset-2 hover:underline">
              {search.audience === "Single" ? "Solo" : search.audience === "Corporate" ? "Work" : "Family"} · {guestSummary(search.adults, search.audience === "Corporate" ? 0 : search.children)}
            </p>
          </button>
          <p className="mt-4 text-sm text-slate-500">
            {category === "stays"
              ? `Total for ${nightsBetween(search.from, search.to)} nights · all-in`
              : "Total for this booking"}
          </p>
          <p className="font-display text-3xl text-slate-900">{formatMoney(price.total)}</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-500">
            <li className="flex justify-between"><span>{lineLabel}</span><span>{formatMoney(price.base)}</span></li>
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
            className={`mt-2 flex min-h-11 w-full items-center justify-center rounded-pill border text-sm font-medium ${
              compareFull || inCompare ? "border-slate-200 text-slate-600" : "border-slate-200 text-slate-800"
            }`}
            onClick={onCompareClick}
          >
            {compareLabel}
          </button>
          <button
            type="button"
            className="mt-2 flex min-h-11 w-full items-center justify-center rounded-pill border border-slate-200 text-sm font-medium text-slate-800"
            onClick={(e) => { shareOpenerRef.current = e.currentTarget; setShareOpen(true); }}
          >
            Share
          </button>
          {cancelUntil && (
            <p className="mt-3 text-sm text-emerald-700">Free cancellation until {formatShortRange(cancelUntil, cancelUntil).split("–")[0]}</p>
          )}
        </aside>
      </div>

      <div className="h-28 lg:hidden" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mb-2 flex gap-3 text-xs text-slate-600">
          <button type="button" className="min-h-11 flex-1 rounded-xl border border-slate-200 px-2 text-left" onClick={(e) => { datesOpenerRef.current = e.currentTarget; setSheetOpen(true); }}>
            <span className="block text-[10px] uppercase text-slate-400">Dates</span>
            {formatShortRange(search.from, search.to)}
          </button>
          <button type="button" className="min-h-11 flex-1 rounded-xl border border-slate-200 px-2 text-left" onClick={(e) => { datesOpenerRef.current = e.currentTarget; setSheetOpen(true); }}>
            <span className="block text-[10px] uppercase text-slate-400">Guests</span>
            {guestSummary(search.adults, search.audience === "Corporate" ? 0 : search.children)}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">{stickyLine}</p>
          </div>
          {!blockReason ? (
            <Link href={`/book/${category}/${slug}`} className="min-h-11 shrink-0 rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
              {bookLabel}
            </Link>
          ) : (
            <p className="max-w-[50%] text-right text-xs text-amber-800">{blockReason}</p>
          )}
        </div>
      </div>

      <DatesGuestsSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        openerRef={datesOpenerRef}
        from={search.from}
        to={search.to}
        audience={search.audience}
        adults={search.adults}
        childrenCount={search.children}
        onFrom={(v) => setSearch((s) => ({ ...s, from: v }))}
        onTo={(v) => setSearch((s) => ({ ...s, to: v }))}
        onAudience={(a: Audience) => setAudience(a)}
        onAdults={(n) => setSearch((s) => ({ ...s, adults: n }))}
        onChildren={(n) => setSearch((s) => ({ ...s, children: n }))}
        category={category}
        soldOutDates={listing.soldOutDates}
        minNights={listing.minNights}
      />

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} title={listing.title} url={shareUrl} openerRef={shareOpenerRef} />

      {lightbox && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          aria-describedby="lightbox-status"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <div>
              <h2 id="lightbox-title" className="sr-only">
                Photo gallery
              </h2>
              <p className="text-sm" aria-hidden="true">
                {active + 1} / {listing.images.length}
              </p>
              <p id="lightbox-status" className="sr-only" aria-live="polite">
                Photo {active + 1} of {listing.images.length}
              </p>
            </div>
            <button
              ref={lightboxCloseRef}
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-white"
              onClick={() => setLightbox(false)}
              aria-label="Close gallery"
            >
              <IconClose className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4">
            <button type="button" className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white" onClick={() => setActive((i) => (i - 1 + listing.images.length) % listing.images.length)} aria-label="Previous photo">
              ‹
            </button>
            <div className="relative h-full max-h-[70vh] w-full max-w-4xl">
              <Image src={listing.images[active]} alt={`${listing.title} — photo ${active + 1}`} fill className="object-contain" sizes="100vw" />
            </div>
            <button type="button" className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white" onClick={() => setActive((i) => (i + 1) % listing.images.length)} aria-label="Next photo">
              ›
            </button>
          </div>
          <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 py-4">
            {listing.images.map((src, i) => (
              <button key={`lb-${src}-${i}`} type="button" className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ${active === i ? "ring-2 ring-white" : "opacity-70"}`} onClick={() => setActive(i)}>
                <Image src={src} alt={`${listing.title} — photo ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
