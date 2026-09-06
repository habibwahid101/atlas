"use client";

import { useEffect, useMemo, useState } from "react";
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
  const { search, setSearch, setAudience } = useAtlas();
  const location = params.get("location") || search.location || "Cox's Bazar";
  const who = (params.get("who") as Audience) || search.audience;

  const [filters, setFilters] = useState<Filters>({
    rating45: false,
    freeCancel: false,
    lensFit: false,
    beachfront: false,
    durationShort: false,
  });

  useEffect(() => {
    if (params.get("who")) setAudience(who);
    if (params.get("location") || params.get("from")) {
      setSearch((s) => ({
        ...s,
        location: params.get("location") || s.location,
        from: params.get("from") || s.from,
        to: params.get("to") || s.to,
        adults: Number(params.get("adults") || s.adults),
        children: Number(params.get("children") || s.children),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = useMemo(() => {
    let list = byCategory(category).filter((l) =>
      location
        ? l.place.toLowerCase().includes(location.toLowerCase()) ||
          l.location.toLowerCase().includes(location.toLowerCase())
        : true
    );
    if (!list.length) list = byCategory(category);
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
  }, [category, location, filters, who]);

  const emptyCopy =
    category === "stays"
      ? "No stays for these dates. Clear filters or change dates."
      : "No trips for these dates. Clear filters or change dates.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">
        {TITLES[category]} in {location}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.length} {TITLES[category].toLowerCase()} · {who}
      </p>
      <div className="mt-6">
        <FilterChips category={category} audience={who} filters={filters} setFilters={setFilters} />
      </div>
      {items.length === 0 ? (
        <p className="mt-12 text-slate-600">{emptyCopy}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} audience={who} />
          ))}
        </div>
      )}
    </div>
  );
}
