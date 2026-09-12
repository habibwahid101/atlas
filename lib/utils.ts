import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function fitBadge(listing: { familyRooms?: boolean; invoiceReady?: boolean; soloFriendly?: boolean }, audience: string) {
  if (audience === "Family" && listing.familyRooms) return "Family rooms";
  if (audience === "Corporate" && listing.invoiceReady) return "Invoice ready";
  if (audience === "Single" && listing.soloFriendly) return "Solo-friendly";
  return null;
}

/** Simple stone placeholder for next/image blur */
export const BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'%3E%3Crect fill='%23e7e5e4' width='8' height='5'/%3E%3C/svg%3E";
