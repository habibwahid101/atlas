import type { Booking } from "./types";
import { parseISO } from "./dates";

export type TripTab = "upcoming" | "past" | "cancelled";

/** Checkout/end date before local today → Past (cancelled stays cancelled). */
export function effectiveBookingStatus(b: Booking, today: Date = startOfLocalToday()): TripTab {
  if (b.status === "cancelled") return "cancelled";
  if (b.status === "past") return "past";
  const end = parseISO(b.to);
  if (end < today) return "past";
  return "upcoming";
}

export function startOfLocalToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function migrateBookingStatuses(bookings: Booking[], today: Date = startOfLocalToday()): Booking[] {
  return bookings.map((bk) => {
    if (bk.status === "upcoming" && effectiveBookingStatus(bk, today) === "past") {
      return { ...bk, status: "past" as const };
    }
    return bk;
  });
}
