export type Audience = "Single" | "Family" | "Corporate";
export type Category = "stays" | "day-trips" | "recreation";

export type Review = {
  id: string;
  name: string;
  date: string;
  text: string;
  rating: number;
};

export type Listing = {
  id: string;
  slug: string;
  category: Category;
  title: string;
  location: string;
  place: string;
  /** WGS84 latitude / longitude for static map */
  lat: number;
  lng: number;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  included: string[];
  beachfront?: boolean;
  familyRooms?: boolean;
  soloFriendly?: boolean;
  invoiceReady?: boolean;
  kidsAllowed?: boolean;
  freeCancellation: boolean;
  cancelUntilDays: number;
  distanceKm?: number;
  durationHours?: number;
  /** nightly for stays, per person for trips/recreation */
  baseUnit: number;
  featured?: boolean;
  familyNotes?: string[];
  corporateNotes?: string[];
  soloNotes?: string[];
  houseRules?: string[];
  soldOutDates?: string[];
  /** Minimum nights for stays; default 1 when omitted */
  minNights?: number;
  reviews?: Review[];
  hostName: string;
  hostPhone: string;
  hostEmail: string;
  hostWhatsApp?: string;
};

export type SearchState = {
  location: string;
  from: string;
  to: string;
  audience: Audience;
  adults: number;
  children: number;
  category: Category;
};

export type PriceBreakdown = {
  nights: number;
  base: number;
  service: number;
  tax: number;
  total: number;
};

export type Booking = {
  id: string;
  ref: string;
  listingId: string;
  slug: string;
  type: Category;
  title: string;
  location: string;
  image: string;
  from: string;
  to: string;
  audience: Audience;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestMobile: string;
  companyName?: string;
  billingEmail?: string;
  tin?: string;
  paymentMethod: string;
  breakdown: PriceBreakdown;
  total: number;
  createdAt: string;
  status: "upcoming" | "past" | "cancelled";
  cancelUntil: string;
};
