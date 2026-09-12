import { addDays, nightsBetween, parseISO } from "@/lib/dates";
import type { Category } from "@/lib/types";

/** ISO dates for each night in [from, to) */
export function nightsTouched(from: string, to: string): string[] {
  if (!from || !to) return [];
  const out: string[] = [];
  let cur = from;
  const end = parseISO(to).getTime();
  // Guard runaway loops
  for (let i = 0; i < 366; i++) {
    if (parseISO(cur).getTime() >= end) break;
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

export function isSoldOutDate(iso: string, soldOutDates?: string[]): boolean {
  if (!iso || !soldOutDates?.length) return false;
  return soldOutDates.includes(iso);
}

export function rangeIncludesSoldOut(
  from: string,
  to: string,
  soldOutDates?: string[],
  category: Category = "stays"
): boolean {
  if (!soldOutDates?.length || !from || !to) return false;
  if (category === "stays") {
    return nightsTouched(from, to).some((d) => soldOutDates.includes(d));
  }
  // Trips/recreation: the start date (and any spanned day) must be free
  const days = nightsTouched(from, addDays(to, 1));
  return days.some((d) => soldOutDates.includes(d));
}

export function dateFieldLabels(category: Category): { from: string; to: string } {
  if (category === "stays") return { from: "Check-in", to: "Check-out" };
  return { from: "Start", to: "End" };
}

/**
 * Shared date-range validation for SearchPill, DatesGuestsSheet, Detail, Book.
 * Returns an inline error message or null when valid.
 */
export function validateDateRange(opts: {
  from: string;
  to: string;
  category?: Category;
  minNights?: number;
  soldOutDates?: string[];
}): string | null {
  const { from, to, soldOutDates } = opts;
  const category = opts.category ?? "stays";
  if (!from || !to) return "Pick your dates.";
  const fromT = parseISO(from).getTime();
  const toT = parseISO(to).getTime();
  if (Number.isNaN(fromT) || Number.isNaN(toT)) return "Pick your dates.";
  if (toT <= fromT) {
    return category === "stays" ? "Check-out must be after check-in." : "End must be after start.";
  }
  if (category === "stays") {
    const min = opts.minNights && opts.minNights > 0 ? opts.minNights : 1;
    const nights = nightsBetween(from, to);
    if (nights < min) {
      return min === 1 ? "Stay at least 1 night." : `Stay at least ${min} nights.`;
    }
  }
  if (rangeIncludesSoldOut(from, to, soldOutDates, category)) {
    return "Those dates aren’t available";
  }
  return null;
}

/** Reject selecting a single sold-out ISO date (for native inputs). */
export function clampAwaySoldOut(
  iso: string,
  soldOutDates: string[] | undefined,
  fallback: string
): string {
  if (!iso) return fallback;
  if (isSoldOutDate(iso, soldOutDates)) return fallback;
  return iso;
}
