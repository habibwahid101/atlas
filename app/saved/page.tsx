"use client";

import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { useAtlas } from "@/context/AtlasContext";
import { getListingById } from "@/lib/data";

export default function SavedPage() {
  const { savedIds, search } = useAtlas();
  const listings = savedIds.map((id) => getListingById(id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">Saved</h1>
      <p className="mt-1 text-sm text-slate-500">{listings.length} saved</p>
      {listings.length === 0 ? (
        <div className="mt-12 space-y-4 text-slate-600">
          <p>Nothing saved yet. Tap the heart on a listing to keep it here.</p>
          <Link href="/stays" className="inline-flex min-h-11 items-center text-sm font-medium text-coral">
            Browse stays
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l!.id} listing={l!} audience={search.audience} />
          ))}
        </div>
      )}
    </div>
  );
}
