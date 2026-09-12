"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { FilterChips, type Filters } from "@/components/FilterChips";
import { byCategory } from "@/lib/data";
import { priceForListing } from "@/lib/pricing";
import { useAtlas } from "@/context/AtlasContext";
import type { Audience, Category } from "@/lib/types";

const TITLES: Record<Category, string> = {
  stays: "Stays",
  "day-trips": "Day trips",
  recreation: "Recreation",
};

const EMPTY_HEAD: Record<Category, (loc: string) => string> = {
  stays: (loc) => `No stays match ${loc || "your search"}.`,
  "day-trips": (loc) => `No day trips match ${loc || "your search"}.`,
  recreation: (loc) => `No recreation match ${loc || "your search"}.`,
};

const emptyFilters: Filters = {
  rating45: false,
  freeCancel: false,
  lensFit: false,
  beachfront: false,
  durationShort: false,
  breakfast: false,
  kidsWelcome: false,
};

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export default function BrowsePage({ category }: { category: Category }) {
  const params = useSearchParams();
  const router = useRouter();
  const { search, setSearch, setAudience, setCategory } = useAtlas();
  const locationParam = params.get("location");
  const location = (locationParam ?? "").trim();
  const who = (params.get("who") as Audience) || search.audience;
  const locationQueried = locationParam !== null && location.length > 0;

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [priceOpen, setPriceOpen] = useState(false);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  useEffect(() => {
    setCategory(category);
    if (params.get("who")) setAudience(who);
    if (params.get("location") || params.get("from")) {
      setSearch((s) => ({
        ...s,
        location: params.get("location") || s.location,
        from: params.get("from") || s.from,
        to: params.get("to") || s.to,
        adults: Number(params.get("adults") || s.adults),
        children: Number(params.get("children") || s.children),
        category,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matched = useMemo(() => {
    let list = byCategory(category);
    if (locationQueried) {
      const q = location.toLowerCase();
      list = list.filter(
        (l) => l.place.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
      );
    }
    if (filters.rating45) list = list.filter((l) => l.rating >= 4.5);
    if (filters.freeCancel) list = list.filter((l) => l.freeCancellation);
    if (filters.lensFit) {
      if (who === "Family") list = list.filter((l) => l.familyRooms);
      if (who === "Corporate") list = list.filter((l) => l.invoiceReady);
      if (who === "Single") list = list.filter((l) => l.soloFriendly);
    }
    if (filters.beachfront) list = list.filter((l) => l.beachfront);
    if (filters.breakfast) {
      list = list.filter((l) =>
        l.included.some((inc) => inc.toLowerCase().includes("breakfast"))
      );
    }
    if (filters.kidsWelcome) list = list.filter((l) => l.kidsAllowed !== false);
    if (filters.durationShort) list = list.filter((l) => (l.durationHours ?? 99) <= 4);

    const guests = search.adults + search.children;
    let priced = list.map((l) => ({
      l,
      total: priceForListing(l, search.from, search.to, guests).total,
    }));
    if (minPrice != null) priced = priced.filter((x) => x.total >= minPrice);
    if (maxPrice != null) priced = priced.filter((x) => x.total <= maxPrice);

    if (sort === "price-asc") priced = [...priced].sort((a, b) => a.total - b.total);
    else if (sort === "price-desc") priced = [...priced].sort((a, b) => b.total - a.total);
    else if (sort === "rating") priced = [...priced].sort((a, b) => b.l.rating - a.l.rating);

    return priced.map((x) => x.l);
  }, [category, location, locationQueried, filters, who, sort, minPrice, maxPrice, search]);

  function clearFilters() {
    setFilters(emptyFilters);
    setSort("recommended");
    setMinPrice(null);
    setMaxPrice(null);
    setMinInput("");
    setMaxInput("");
    setSearch((s) => ({ ...s, location: "" }));
    router.push(`/${category}`);
  }

  function applyPrice() {
    const min = minInput.trim() === "" ? null : Number(minInput);
    const max = maxInput.trim() === "" ? null : Number(maxInput);
    setMinPrice(min != null && !Number.isNaN(min) ? min : null);
    setMaxPrice(max != null && !Number.isNaN(max) ? max : null);
    setPriceOpen(false);
  }

  function clearPrice() {
    setMinInput("");
    setMaxInput("");
    setMinPrice(null);
    setMaxPrice(null);
    setPriceOpen(false);
  }

  const priceActive = minPrice != null || maxPrice != null;
  const priceCloseRef = useRef<HTMLButtonElement>(null);
  const { panelRef: pricePanelRef } = useDialogA11y(priceOpen, () => setPriceOpen(false), {
    initialFocusRef: priceCloseRef,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">
        {locationQueried ? `${TITLES[category]} in ${location}` : TITLES[category]}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {matched.length} {TITLES[category].toLowerCase()} · {who}
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChips category={category} audience={who} filters={filters} setFilters={setFilters} />
          <button
            type="button"
            onClick={() => setPriceOpen(true)}
            className={`min-h-10 rounded-pill border px-4 text-sm ${
              priceActive ? "border-coral bg-coral text-white" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            Price
          </button>
          <label className="flex min-h-10 items-center gap-2 rounded-pill border border-slate-200 bg-white px-3 text-sm">
            <span className="text-slate-500">Sort</span>
            <select className="bg-transparent outline-none" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>

      {matched.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-100 text-2xl" aria-hidden>
            ⌕
          </div>
          <h2 className="mt-4 font-display text-2xl text-slate-900">{EMPTY_HEAD[category](location)}</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">Widen the place, dates, or Who — or clear filters.</p>
          <button type="button" onClick={clearFilters} className="mt-6 min-h-11 rounded-pill bg-coral px-5 text-sm font-semibold text-white hover:bg-coral-700">
            Clear filters
          </button>
          <Link href="/" className="mt-3 min-h-11 text-sm font-medium text-slate-600 hover:text-slate-900">
            Edit search
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matched.map((l) => (
            <ListingCard key={l.id} listing={l} audience={who} />
          ))}
        </div>
      )}

      {priceOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="presentation" onClick={() => setPriceOpen(false)}>
          <div
            ref={pricePanelRef}
            className="w-full max-w-md rounded-t-card bg-white p-5 shadow-soft sm:rounded-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="price-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="price-sheet-title" className="font-display text-xl">Price (BDT)</h2>
              <button ref={priceCloseRef} type="button" className="min-h-11 min-w-11 text-2xl leading-none text-slate-500" onClick={() => setPriceOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">
                Min BDT
                <input type="number" min={0} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={minInput} onChange={(e) => setMinInput(e.target.value)} placeholder="0" />
              </label>
              <label className="text-sm font-medium">
                Max BDT
                <input type="number" min={0} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} placeholder="Any" />
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" className="min-h-11 flex-1 rounded-pill border border-slate-200 text-sm font-medium" onClick={clearPrice}>
                Clear
              </button>
              <button type="button" className="min-h-11 flex-1 rounded-pill bg-coral text-sm font-semibold text-white" onClick={applyPrice}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
