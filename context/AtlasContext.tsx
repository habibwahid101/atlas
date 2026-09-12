"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Audience, Booking, Category, Listing, SearchState } from "@/lib/types";
import { defaultDates } from "@/lib/dates";

type AtlasContextValue = {
  search: SearchState;
  setSearch: React.Dispatch<React.SetStateAction<SearchState>>;
  setAudience: (a: Audience) => void;
  setCategory: (c: Category) => void;
  compare: Listing[];
  addCompare: (l: Listing) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  cancelBooking: (id: string) => void;
  compareOpen: boolean;
  setCompareOpen: (v: boolean) => void;
};

const AtlasContext = createContext<AtlasContextValue | null>(null);

const defaults = defaultDates();

function audienceDefaults(a: Audience): Pick<SearchState, "adults" | "children"> {
  if (a === "Family") return { adults: 2, children: 1 };
  return { adults: 1, children: 0 };
}

const defaultSearch: SearchState = {
  location: "Cox's Bazar",
  from: defaults.from,
  to: defaults.to,
  audience: "Family",
  adults: 2,
  children: 1,
  category: "stays",
};

export function AtlasProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState<SearchState>(defaultSearch);
  const [compare, setCompare] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("atlas-search");
      const c = localStorage.getItem("atlas-compare");
      const b = localStorage.getItem("atlas-bookings");
      if (s) {
        const parsed = JSON.parse(s);
        setSearch({ ...defaultSearch, ...parsed, category: parsed.category || "stays" });
      }
      if (c) setCompare(JSON.parse(c));
      if (b) setBookings(JSON.parse(b));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("atlas-search", JSON.stringify(search));
  }, [search, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      "atlas-compare",
      JSON.stringify(compare.map(({ images, ...rest }) => ({ ...rest, images: images.slice(0, 2) })))
    );
  }, [compare, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("atlas-bookings", JSON.stringify(bookings));
  }, [bookings, hydrated]);

  const value = useMemo<AtlasContextValue>(
    () => ({
      search,
      setSearch,
      setAudience: (a) => setSearch((prev) => ({ ...prev, audience: a, ...audienceDefaults(a) })),
      setCategory: (c) => setSearch((prev) => ({ ...prev, category: c })),
      compare,
      addCompare: (l) =>
        setCompare((prev) => {
          if (prev.find((x) => x.id === l.id)) return prev;
          if (prev.length >= 3) return prev;
          setCompareOpen(true);
          return [...prev, l];
        }),
      removeCompare: (id) => setCompare((prev) => prev.filter((x) => x.id !== id)),
      clearCompare: () => setCompare([]),
      bookings,
      addBooking: (b) => setBookings((prev) => [b, ...prev]),
      cancelBooking: (id) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))),
      compareOpen,
      setCompareOpen,
    }),
    [search, compare, bookings, compareOpen]
  );

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error("useAtlas must be used within AtlasProvider");
  return ctx;
}
