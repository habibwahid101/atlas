"use client";

import { cn } from "@/lib/utils";
import type { Audience, Category } from "@/lib/types";

export type Filters = {
  rating45: boolean;
  freeCancel: boolean;
  lensFit: boolean;
  beachfront: boolean;
  durationShort: boolean;
  breakfast: boolean;
  kidsWelcome: boolean;
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
    audience === "Family" ? "Family rooms" : audience === "Corporate" ? "Invoice on request" : "Solo-friendly";

  const chips: { key: keyof Filters; label: string; show?: boolean }[] = [
    { key: "rating45", label: "4.5+ rating" },
    { key: "freeCancel", label: "Free cancellation" },
    { key: "lensFit", label: lensLabel },
    { key: "beachfront", label: "Beachfront", show: category === "stays" },
    { key: "breakfast", label: "Breakfast included", show: category === "stays" },
    { key: "kidsWelcome", label: "Kids welcome", show: category === "stays" },
    { key: "durationShort", label: "Under 4 hours", show: category !== "stays" },
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
