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
