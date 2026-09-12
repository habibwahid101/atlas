"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtlas } from "@/context/AtlasContext";
import type { Audience, Category } from "@/lib/types";
import { formatShortRange } from "@/lib/dates";

export function SearchPill({
  compact = false,
  category,
}: {
  compact?: boolean;
  category?: Category;
}) {
  const { search, setSearch, setAudience } = useAtlas();
  const router = useRouter();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const [whoOpen, setWhoOpen] = useState(false);
  const targetCategory = category || search.category || "stays";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setWhoOpen(false);
    const q = new URLSearchParams({
      location: search.location,
      from: search.from,
      to: search.to,
      who: search.audience,
      adults: String(search.adults),
      children: String(search.children),
    });
    router.push(`/${targetCategory}?${q.toString()}`);
  }

  function openDates() {
    fromRef.current?.showPicker?.();
    fromRef.current?.focus();
    fromRef.current?.click();
  }

  function whoLabel() {
    if (search.audience === "Family") {
      const childWord = search.children === 1 ? "child" : "children";
      return `Family · ${search.adults} adult${search.adults === 1 ? "" : "s"}, ${search.children} ${childWord}`;
    }
    if (search.audience === "Corporate") return "Work · 1 adult";
    return "Solo · 1 adult";
  }

  function bump(field: "adults" | "children", delta: number) {
    setSearch((s) => {
      if (s.audience !== "Family") return s;
      const next = { ...s };
      if (field === "adults") next.adults = Math.min(16, Math.max(1, s.adults + delta));
      else next.children = Math.min(10, Math.max(0, s.children + delta));
      return next;
    });
  }

  return (
    <form
      onSubmit={submit}
      className={`relative flex w-full flex-col gap-2 rounded-card bg-white p-2 shadow-soft sm:flex-row sm:items-center sm:rounded-pill sm:p-2 ${
        compact ? "" : "sm:max-w-3xl"
      }`}
    >
      <label className="flex flex-1 flex-col px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Where</span>
        <input
          className="bg-transparent text-sm outline-none"
          value={search.location}
          onChange={(e) => setSearch((s) => ({ ...s, location: e.target.value }))}
        />
      </label>
      <div className="hidden h-8 w-px bg-slate-200 sm:block" />
      <button type="button" onClick={openDates} className="relative flex flex-1 flex-col items-start px-3 py-2 text-left">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Dates</span>
        <span className="text-sm text-slate-800">{formatShortRange(search.from, search.to)}</span>
        <input
          ref={fromRef}
          type="date"
          aria-label="Check-in"
          className="pointer-events-none absolute inset-0 h-full w-1/2 opacity-0"
          value={search.from}
          onChange={(e) => {
            setSearch((s) => ({ ...s, from: e.target.value }));
            setTimeout(() => {
              toRef.current?.showPicker?.();
              toRef.current?.focus();
              toRef.current?.click();
            }, 0);
          }}
        />
        <input
          ref={toRef}
          type="date"
          aria-label="Check-out"
          className="pointer-events-none absolute inset-0 left-1/2 h-full w-1/2 opacity-0"
          value={search.to}
          onChange={(e) => setSearch((s) => ({ ...s, to: e.target.value }))}
        />
      </button>
      <div className="hidden h-8 w-px bg-slate-200 sm:block" />
      <div className="relative flex flex-1 flex-col px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Who</span>
        <button
          type="button"
          className="text-left text-sm text-slate-800 outline-none"
          aria-expanded={whoOpen}
          onClick={() => setWhoOpen((v) => !v)}
        >
          {whoLabel()}
        </button>
        {whoOpen && (
          <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-card border border-slate-200 bg-white p-3 shadow-soft">
            <label className="block text-xs font-semibold text-slate-500">Lens</label>
            <select
              className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-2 text-sm"
              value={search.audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
            >
              <option value="Single">Solo · 1 adult</option>
              <option value="Family">{`Family · ${search.adults} adult${search.adults === 1 ? "" : "s"}, ${search.children} ${search.children === 1 ? "child" : "children"}`}</option>
              <option value="Corporate">Work · 1 adult</option>
            </select>
            {search.audience === "Family" ? (
              <div className="mt-3 space-y-3">
                <Stepper label="Adults" value={search.adults} onDec={() => bump("adults", -1)} onInc={() => bump("adults", 1)} />
                <Stepper label="Children" value={search.children} onDec={() => bump("children", -1)} onInc={() => bump("children", 1)} />
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">Guest count is fixed at 1 adult for this lens.</p>
            )}
            <button
              type="button"
              className="mt-3 min-h-10 w-full rounded-pill bg-coral text-sm font-semibold text-white"
              onClick={() => setWhoOpen(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-pill bg-coral px-6 text-sm font-semibold text-white hover:bg-coral-700"
      >
        Search ATLAS
      </button>
    </form>
  );
}

function Stepper({
  label,
  value,
  onDec,
  onInc,
}: {
  label: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200" onClick={onDec} aria-label={`Fewer ${label}`}>
          −
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200" onClick={onInc} aria-label={`More ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}
