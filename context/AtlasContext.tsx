"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  compareToast: string | null;
  clearCompareToast: () => void;
};

const AtlasContext = createContext<AtlasContextValue | null>(null);

const defaults = defaultDates();
const CAP_TOAST = "Compare up to 3 — remove one first.";

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
  const [compareToast, setCompareToast] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const compareRef = useRef(compare);
  compareRef.current = compare;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!compareToast) return;
    const t = setTimeout(() => setCompareToast(null), 4000);
    return () => clearTimeout(t);
  }, [compareToast, toastKey]);

  const showCapToast = useCallback(() => {
    setCompareToast(CAP_TOAST);
    setToastKey((k) => k + 1);
  }, []);

  const addCompare = useCallback(
    (l: Listing) => {
      const prev = compareRef.current;
      if (prev.find((x) => x.id === l.id)) return;
      if (prev.length >= 3) {
        showCapToast();
        return;
      }
      setCompare([...prev, l]);
      setCompareOpen(true);
    },
    [showCapToast]
  );

  const value = useMemo<AtlasContextValue>(
    () => ({
      search,
      setSearch,
      setAudience: (a) => setSearch((prev) => ({ ...prev, audience: a, ...audienceDefaults(a) })),
      setCategory: (c) => setSearch((prev) => ({ ...prev, category: c })),
      compare,
      addCompare,
      removeCompare: (id) => setCompare((prev) => prev.filter((x) => x.id !== id)),
      clearCompare: () => setCompare([]),
      bookings,
      addBooking: (b) => setBookings((prev) => [b, ...prev]),
      cancelBooking: (id) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))),
      compareOpen,
      setCompareOpen,
      compareToast,
      clearCompareToast: () => setCompareToast(null),
    }),
    [search, compare, bookings, compareOpen, compareToast, addCompare]
  );

  const toast =
    mounted && compareToast
      ? createPortal(
          <div
            key={toastKey}
            role="status"
            aria-live="assertive"
            data-testid="compare-cap-toast"
            className="fixed inset-x-0 top-4 z-[200] flex justify-center px-4 pointer-events-none"
          >
            <div className="max-w-md rounded-pill bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
              {compareToast}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <AtlasContext.Provider value={value}>
      {children}
      {toast}
    </AtlasContext.Provider>
  );
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error("useAtlas must be used within AtlasProvider");
  return ctx;
}
