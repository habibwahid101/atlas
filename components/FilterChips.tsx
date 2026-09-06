"use client";

import { cn } from "@/lib/utils";
import type { Audience, Category } from "@/lib/types";

export type Filters = {
  rating45: boolean;
  freeCancel: boolean;
  lensFit: boolean;
  beachfront: boolean;
  durationShort: boolean;
};

export function FilterChips({
  category,
  audience,
  filters,
  setFilters,
}: {
  category: Category;
  audience: Audience;
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const lensLabel =
    audience === "Family" ? "Family rooms" : audience === "Corporate" ? "Invoice ready" : "Solo-friendly";

  const chips: { key: keyof Filters; label: string; show?: boolean }[] = [
    { key: "rating45", label: "Rating 4.5+" },
    { key: "freeCancel", label: "Free cancellation" },
    { key: "lensFit", label: lensLabel },
    { key: "beachfront", label: "Beachfront", show: category === "stays" },
    { key: "durationShort", label: "Duration ≤ 4h", show: category !== "stays" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {chips
        .filter((c) => c.show !== false)
        .map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilters({ ...filters, [c.key]: !filters[c.key] })}
            className={cn(
              "min-h-10 rounded-pill border px-4 text-sm",
              filters[c.key]
                ? "border-coral bg-coral text-white"
                : "border-slate-200 bg-white text-slate-700"
            )}
          >
            {c.label}
          </button>
        ))}
    </div>
  );
}
