"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAtlas } from "@/context/AtlasContext";
import { priceForListing } from "@/lib/pricing";
import { formatMoney } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { IconClose } from "@/components/Icons";

export function CompareTray() {
  const { compare, removeCompare, compareOpen, setCompareOpen, search } = useAtlas();
  const pathname = usePathname();
  const onBook = pathname.startsWith("/book");
  const onDetail =
    /^\/(stays|day-trips|recreation)\/[^/]+$/.test(pathname) && !onBook;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (onBook && compareOpen) setCompareOpen(false);
  }, [onBook, compareOpen, setCompareOpen]);

  useEffect(() => {
    if (compareOpen && !wasOpen.current) {
      openerRef.current = document.activeElement as HTMLElement | null;
      // Initial focus: close button
      queueMicrotask(() => closeRef.current?.focus());
    }
    if (!compareOpen && wasOpen.current) {
      const opener = openerRef.current;
      openerRef.current = null;
      queueMicrotask(() => {
        if (opener && typeof opener.focus === "function") opener.focus();
      });
    }
    wasOpen.current = compareOpen;
  }, [compareOpen]);

  useEffect(() => {
    if (!compareOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setCompareOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compareOpen, setCompareOpen]);

  if (!compare.length) return null;

  return (
    <>
      {!compareOpen && !onBook && (
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className={cn(
            "fixed left-1/2 z-[35] -translate-x-1/2 rounded-pill border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-medium text-slate-800 shadow-soft backdrop-blur",
            onDetail
              ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-6"
              : "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-8"
          )}
        >
          Compare ({compare.length}/3)
        </button>
      )}
      {compareOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
            onClick={() => setCompareOpen(false)}
          />
          <div
            ref={panelRef}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-auto rounded-t-card border border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-tray-title"
          >
            {compare.length === 3 && (
              <div
                data-testid="compare-cap-banner"
                role="status"
                className="mx-auto mb-3 max-w-6xl rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-950"
              >
                Compare is full (3). Remove one to add another.
              </div>
            )}
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <h2 id="compare-tray-title" className="text-lg font-semibold">
                Compare · {compare.length} of 3
              </h2>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-slate-500"
                onClick={() => setCompareOpen(false)}
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>
            <div className="mx-auto mt-4 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {compare.map((l) => {
                const price = priceForListing(
                  l,
                  search.from,
                  search.to,
                  search.adults + search.children
                );
                return (
                  <div key={l.id} className="rounded-card border border-slate-200 p-3">
                    <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
                      <Image src={l.images[0]} alt={l.title} fill className="object-cover" sizes="33vw" />
                    </div>
                    <h3 className="font-medium">{l.title}</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Total</span>
                        <strong>{formatMoney(price.total)}</strong>
                      </li>
                      <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Rating</span>
                        <span>★ {l.rating.toFixed(1)}</span>
                      </li>
                      <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Free cancellation</span>
                        <span>{l.freeCancellation ? "Yes" : "Non-refundable"}</span>
                      </li>
                      <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Best for</span>
                        <span>
                          {l.familyRooms
                            ? "Families"
                            : l.invoiceReady
                              ? "Invoices"
                              : l.soloFriendly
                                ? "Solo"
                                : "—"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>{l.durationHours ? "Duration" : "Distance"}</span>
                        <span>
                          {l.durationHours ? `${l.durationHours}h` : `${l.distanceKm ?? "—"} km`}
                        </span>
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="min-h-11 flex-1 rounded-pill border border-slate-200 text-sm"
                        onClick={() => removeCompare(l.id)}
                      >
                        Remove
                      </button>
                      <Link
                        href={`/book/${l.category}/${l.slug}`}
                        className="flex min-h-11 flex-1 items-center justify-center rounded-pill bg-coral text-sm font-semibold text-white"
                      >
                        Reserve
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
