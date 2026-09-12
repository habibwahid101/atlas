"use client";

import { useEffect, useMemo, useState } from "react";
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
  stays: (loc) => (loc ? `No stays in ${loc}` : "No results"),
  "day-trips": (loc) => (loc ? `No day trips in ${loc}` : "No results"),
  recreation: (loc) => (loc ? `No recreation in ${loc}` : "No results"),
};

const emptyFilters: Filters = {
  rating45: false,
  freeCancel: false,
  lensFit: false,
  beachfront: false,
  durationShort: false,
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
  const [priceBand, setPriceBand] = useState<"any" | "under8k" | "8to20k" | "over20k">("any");

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
    if (filters.durationShort) list = list.filter((l) => (l.durationHours ?? 99) <= 4);

    const guests = search.adults + search.children;
    const withPrice = list.map((l) => ({
      l,
      total: priceForListing(l, search.from, search.to, guests).total,
    }));

    let priced = withPrice;
    if (priceBand === "under8k") priced = priced.filter((x) => x.total < 8000);
    if (priceBand === "8to20k") priced = priced.filter((x) => x.total >= 8000 && x.total <= 20000);
    if (priceBand === "over20k") priced = priced.filter((x) => x.total > 20000);

    if (sort === "price-asc") priced = [...priced].sort((a, b) => a.total - b.total);
    else if (sort === "price-desc") priced = [...priced].sort((a, b) => b.total - a.total);
    else if (sort === "rating") priced = [...priced].sort((a, b) => b.l.rating - a.l.rating);

    return priced.map((x) => x.l);
  }, [category, location, locationQueried, filters, who, sort, priceBand, search]);

  function clearFilters() {
    setFilters(emptyFilters);
    setPriceBand("any");
    setSort("recommended");
    setSearch((s) => ({ ...s, location: "" }));
    router.push(`/${category}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">
        {locationQueried ? `${TITLES[category]} in ${location}` : TITLES[category]}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {matched.length} {TITLES[category].toLowerCase()} · {who}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <FilterChips category={category} audience={who} filters={filters} setFilters={setFilters} />
        <div className="flex flex-wrap gap-2">
          <label className="flex min-h-10 items-center gap-2 rounded-pill border border-slate-200 bg-white px-3 text-sm">
            <span className="text-slate-500">Sort</span>
            <select
              className="bg-transparent outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
              <option value="rating">Rating</option>
            </select>
          </label>
          <label className="flex min-h-10 items-center gap-2 rounded-pill border border-slate-200 bg-white px-3 text-sm">
            <span className="text-slate-500">Price</span>
            <select
              className="bg-transparent outline-none"
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value as typeof priceBand)}
            >
              <option value="any">Any</option>
              <option value="under8k">Under BDT 8,000</option>
              <option value="8to20k">BDT 8,000–20,000</option>
              <option value="over20k">Over BDT 20,000</option>
            </select>
          </label>
        </div>
      </div>
      {matched.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <h2 className="font-display text-2xl text-slate-900">{EMPTY_HEAD[category](location)}</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">Try another place or clear filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 min-h-11 rounded-pill bg-coral px-5 text-sm font-semibold text-white hover:bg-coral-700"
          >
            Clear filters
          </button>
          <Link href="/" className="mt-3 min-h-11 text-sm font-medium text-slate-600 hover:text-slate-900">
            Change search
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matched.map((l) => (
            <ListingCard key={l.id} listing={l} audience={who} />
          ))}
        </div>
      )}
    </div>
  );
}
