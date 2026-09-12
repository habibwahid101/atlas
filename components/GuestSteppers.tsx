"use client";

import type { Audience } from "@/lib/types";
import { pluralize } from "@/lib/copy";

export function GuestSteppers({
  audience,
  adults,
  childCount,
  onAdults,
  onChildren,
}: {
  audience: Audience;
  adults: number;
  childCount: number;
  onAdults: (n: number) => void;
  onChildren: (n: number) => void;
}) {
  return (
    <div className="space-y-3">
      <Stepper
        label="Adults"
        value={adults}
        hint={`${adults} ${pluralize(adults, "adult")}`}
        onDec={() => onAdults(Math.max(1, adults - 1))}
        onInc={() => onAdults(Math.min(16, adults + 1))}
      />
      {audience !== "Corporate" && (
        <Stepper
          label="Children"
          value={childCount}
          hint={`${childCount} ${pluralize(childCount, "child", "children")}`}
          onDec={() => onChildren(Math.max(0, childCount - 1))}
          onInc={() => onChildren(Math.min(10, childCount + 1))}
        />
      )}
    </div>
  );
}

function Stepper({
  label,
  value,
  hint,
  onDec,
  onInc,
}: {
  label: string;
  value: number;
  hint: string;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200" onClick={onDec} aria-label={`Fewer ${label}`}>
          −
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200" onClick={onInc} aria-label={`More ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}
