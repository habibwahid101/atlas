import type { Listing, Review } from "./types";

const POOL: Omit<Review, "id">[] = [
  {
    author: "Ayesha R.",
    rating: 5,
    date: "Aug 2026",
    text: "Calm stay, clear communication, and the place matched the photos. Would book again.",
  },
  {
    author: "Karim H.",
    rating: 5,
    date: "Jul 2026",
    text: "Easy check-in and thoughtful details. Felt trustworthy from booking to checkout.",
  },
  {
    author: "Nusrat A.",
    rating: 4,
    date: "Jun 2026",
    text: "Good value for the dates we chose. Host notes were honest about what to expect.",
  },
  {
    author: "Farhan I.",
    rating: 5,
    date: "May 2026",
    text: "Family-friendly without the noise. Pricing was all-in as shown — no surprises.",
  },
  {
    author: "Lamia S.",
    rating: 4,
    date: "Apr 2026",
    text: "Clean, simple, and well located. The gallery photos were accurate.",
  },
];

/** Seeded guest reviews — count shown in UI matches this list (no inflated totals). */
export function reviewsForListing(listing: Listing): Review[] {
  const n = 2 + (Number(listing.id.replace(/\D/g, "") || "0") % 2); // 2 or 3
  const start = Number(listing.id.replace(/\D/g, "") || "0") % POOL.length;
  const out: Review[] = [];
  for (let i = 0; i < n; i++) {
    const base = POOL[(start + i) % POOL.length];
    out.push({ ...base, id: `${listing.id}-r${i}` });
  }
  return out;
}
