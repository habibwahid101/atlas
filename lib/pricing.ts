import type { Listing, PriceBreakdown } from "./types";
import { nightsBetween } from "./dates";

/** Demo catalog rates: service 10% of base, tax ~8.334% of base (seeded inventory, not a live rate engine). */
const SERVICE_RATE = 0.1;
const TAX_RATE = 0.08334;

export function priceForListing(
  listing: Listing,
  from: string,
  to: string,
  guests = 1
): PriceBreakdown {
  if (listing.category === "stays") {
    const nights = nightsBetween(from, to);
    const base = listing.baseUnit * nights;
    const service = Math.round(base * SERVICE_RATE);
    const tax = Math.round(base * TAX_RATE);
    return { nights, base, service, tax, total: base + service + tax };
  }
  const units = Math.max(1, guests);
  const base = listing.baseUnit * units;
  const service = Math.round(base * 0.08);
  const tax = Math.round(base * 0.05);
  return { nights: 1, base, service, tax, total: base + service + tax };
}

export function fromPriceLabel(listing: Listing) {
  if (listing.category === "stays") {
    return `From BDT ${listing.baseUnit.toLocaleString("en-BD")} / night`;
  }
  return `From BDT ${listing.baseUnit.toLocaleString("en-BD")} / person`;
}
