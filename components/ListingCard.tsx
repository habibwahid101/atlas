"use client";

import Image from "next/image";
import Link from "next/link";
import type { Audience, Listing } from "@/lib/types";
import { fromPriceLabel } from "@/lib/pricing";
import { fitBadge } from "@/lib/utils";
import { useAtlas } from "@/context/AtlasContext";

export function ListingCard({
  listing,
  audience,
}: {
  listing: Listing;
  audience: Audience;
}) {
  const { isSaved, toggleSaved } = useAtlas();
  const badge = fitBadge(listing, audience);
  const href = `/${listing.category}/${listing.slug}`;
  const saved = isSaved(listing.id);
  return (
    <div className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-slate-100">
        <Link href={href} className="absolute inset-0">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </Link>
        <button
          type="button"
          aria-label={saved ? "Remove from Saved" : "Save"}
          aria-pressed={saved}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(listing.id);
          }}
        >
          {saved ? "♥" : "♡"}
        </button>
        {badge && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-pill bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-800 shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <Link href={href} className="mt-3 block space-y-1">
        <h3 className="text-[15px] font-semibold leading-snug text-slate-900">{listing.title}</h3>
        <p className="text-sm text-slate-500">{listing.location}</p>
        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <span className="text-sm font-medium text-coral">{fromPriceLabel(listing)}</span>
          <span className="text-xs text-slate-500">★ {listing.rating.toFixed(1)}</span>
        </div>
      </Link>
    </div>
  );
}
