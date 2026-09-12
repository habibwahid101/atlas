"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { FilterChips, type Filters } from "@/components/FilterChips";
import { byCategory } from "@/lib/data";
import { useAtlas } from "@/context/AtlasContext";
import type { Audience, Category } from "@/lib/types";

const TITLES: Record<Category, string> = {
  stays: "Stays",
  "day-trips": "Day trips",
  recreation: "Recreation",
};

export default function BrowsePage({ category }: { category: Category }) {
  const params = useSearchParams();
  const { search, setSearch, setAudience, setCategory } = useAtlas();
  const locationParam = params.get("location");
  const location = (locationParam ?? "").trim();
  const who = (params.get("who") as Audience) || search.audience;
  /** Only URL location counts — never silent-fallback to all inventory when a query misses. */
  const locationQueried = locationParam !== null && location.length > 0;

  const [filters, setFilters] = useState<Filters>({
    rating45: false,
    freeCancel: false,
    lensFit: false,
    beachfront: false,
    durationShort: false,
  });

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
    if (locationQueried && location.trim()) {
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
    return list;
  }, [category, location, locationQueried, filters, who]);

  const emptyCopy = locationQueried
    ? `No ${TITLES[category].toLowerCase()} match “${location.trim()}”. Clear location or try another place.`
    : category === "stays"
      ? "No stays for these dates. Clear filters or change dates."
      : "No trips for these dates. Clear filters or change dates.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">
        {locationQueried && location.trim()
          ? `${TITLES[category]} in ${location.trim()}`
          : TITLES[category]}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {matched.length} {TITLES[category].toLowerCase()} · {who}
      </p>
      <div className="mt-6">
        <FilterChips category={category} audience={who} filters={filters} setFilters={setFilters} />
      </div>
      {matched.length === 0 ? (
        <div className="mt-12 space-y-4 text-slate-600">
          <p>{emptyCopy}</p>
          <Link href={`/${category}`} className="inline-flex min-h-11 items-center text-sm font-medium text-coral">
            Clear search and show all {TITLES[category].toLowerCase()}
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
