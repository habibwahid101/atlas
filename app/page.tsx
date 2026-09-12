"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchPill } from "@/components/SearchPill";
import { ListingCard } from "@/components/ListingCard";
import { featuredListings, categoryHasInventory, LISTINGS } from "@/lib/data";
import { useAtlas } from "@/context/AtlasContext";
import type { Category, Listing } from "@/lib/types";

function DestinationRow({ title, place, href }: { title: string; place: string; href: string }) {
  const { search } = useAtlas();
  const cards = LISTINGS.filter((l) => l.place === place).slice(0, 4);
  if (!cards.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-slate-900">{title}</h2>
        <Link href={href} className="shrink-0 text-sm font-medium text-coral">
          See all
        </Link>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
        {cards.map((l: Listing) => (
          <div key={l.id} className="w-[260px] shrink-0 sm:w-[280px]">
            <ListingCard listing={l} audience={search.audience} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { search } = useAtlas();
  const featured = featuredListings();
  const featuredCat: Category = featured[0]?.category || "stays";

  return (
    <div>
      <section className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card sm:aspect-[21/9]">
          <Image
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=80"
            alt="Coastal stay"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-4 flex justify-center px-3 sm:bottom-8">
            <SearchPill />
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl text-slate-900">Featured this week</h2>
            <Link href={`/${featuredCat}`} className="text-sm font-medium text-coral">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 3).map((l, i) => (
              <div key={l.id} className={i === 2 ? "hidden lg:block" : undefined}>
                <ListingCard listing={l} audience={search.audience} />
              </div>
            ))}
          </div>
        </section>
      )}

      <DestinationRow title="Popular in Cox’s Bazar" place="Cox's Bazar" href="/stays?location=Cox%27s%20Bazar" />
      <DestinationRow title="Sylhet" place="Sylhet" href="/stays?location=Sylhet" />
      <DestinationRow title="Bandarban" place="Bandarban" href="/stays?location=Bandarban" />
    </div>
  );
}
