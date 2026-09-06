"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtlas } from "@/context/AtlasContext";
import type { Audience } from "@/lib/types";
import { formatShortRange } from "@/lib/dates";

export function SearchPill({ compact = false }: { compact?: boolean }) {
  const { search, setSearch, setAudience } = useAtlas();
  const router = useRouter();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({
      location: search.location,
      from: search.from,
      to: search.to,
      who: search.audience,
      adults: String(search.adults),
      children: String(search.children),
    });
    router.push(`/stays?${q.toString()}`);
  }

  function openDates() {
    // Prefer opening the from picker; browsers show native UI
    fromRef.current?.showPicker?.();
    fromRef.current?.focus();
    fromRef.current?.click();
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full flex-col gap-2 rounded-card bg-white p-2 shadow-soft sm:flex-row sm:items-center sm:rounded-pill sm:p-2 ${
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
      <button
        type="button"
        onClick={openDates}
        className="relative flex flex-1 flex-col items-start px-3 py-2 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Dates</span>
        <span className="text-sm text-slate-800">{formatShortRange(search.from, search.to)}</span>
        {/* Hidden native inputs — keep accessible, no visible chrome */}
        <input
          ref={fromRef}
          type="date"
          aria-label="Check-in"
          className="pointer-events-none absolute inset-0 h-full w-1/2 opacity-0"
          value={search.from}
          onChange={(e) => {
            setSearch((s) => ({ ...s, from: e.target.value }));
            // after picking from, open to
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
      <label className="flex flex-1 flex-col px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Who</span>
        <select
          className="bg-transparent text-sm outline-none"
          value={search.audience}
          onChange={(e) => setAudience(e.target.value as Audience)}
        >
          <option value="Single">Single · 1 adult</option>
          <option value="Family">
            Family · {search.adults} adults, {search.children} child
          </option>
          <option value="Corporate">Corporate · 1 adult</option>
        </select>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-pill bg-coral px-6 text-sm font-semibold text-white hover:bg-coral-700"
      >
        Search
      </button>
    </form>
  );
}
