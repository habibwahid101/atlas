"use client";

import { useEffect } from "react";
import { GuestSteppers } from "@/components/GuestSteppers";
import type { Audience } from "@/lib/types";

export function DatesGuestsSheet({
  open,
  onClose,
  from,
  to,
  audience,
  adults,
  childrenCount,
  onFrom,
  onTo,
  onAudience,
  onAdults,
  onChildren,
}: {
  open: boolean;
  onClose: () => void;
  from: string;
  to: string;
  audience: Audience;
  adults: number;
  childrenCount: number;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onAudience: (a: Audience) => void;
  onAdults: (n: number) => void;
  onChildren: (n: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true" aria-label="Edit dates and guests" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-card bg-white p-5 shadow-soft sm:rounded-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl text-slate-900">Dates & guests</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            From
            <input type="date" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={from} onChange={(e) => onFrom(e.target.value)} />
          </label>
          <label className="text-sm font-medium">
            To
            <input type="date" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={to} onChange={(e) => onTo(e.target.value)} />
          </label>
        </div>
        <label className="mt-3 block text-sm font-medium">
          Who
          <select className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={audience} onChange={(e) => onAudience(e.target.value as Audience)}>
            <option value="Single">Solo · 1 adult</option>
            <option value="Family">{`Family · ${adults} adult${adults === 1 ? "" : "s"}, ${childrenCount} ${childrenCount === 1 ? "child" : "children"}`}</option>
            <option value="Corporate">Work · 1 adult</option>
          </select>
        </label>
        <div className="mt-4">
          <GuestSteppers audience={audience} adults={adults} childCount={childrenCount} onAdults={onAdults} onChildren={onChildren} />
        </div>
        <button type="button" className="mt-5 flex min-h-11 w-full items-center justify-center rounded-pill bg-coral text-sm font-semibold text-white" onClick={onClose}>
          Update
        </button>
      </div>
    </div>
  );
}
