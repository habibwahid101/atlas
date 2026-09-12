"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchPill } from "@/components/SearchPill";
import { ListingCard } from "@/components/ListingCard";
import { featuredListings, categoryHasInventory } from "@/lib/data";
import { useAtlas } from "@/context/AtlasContext";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATS = [
  { href: "/stays", label: "Stays", cat: "stays" as Category },
  { href: "/day-trips", label: "Day trips", cat: "day-trips" as Category },
  { href: "/recreation", label: "Recreation", cat: "recreation" as Category },
] as const;

export default function HomePage() {
  const { search, setCategory } = useAtlas();
  const featured = featuredListings();

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

      <section className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-8 sm:px-6">
        {CATS.filter((c) => categoryHasInventory(c.cat)).map((c) => (
          <button
            key={c.href}
            type="button"
            onClick={() => setCategory(c.cat)}
            className={cn(
              "shrink-0 border-b-2 pb-2 text-sm font-medium",
              search.category === c.cat
                ? "border-coral text-coral"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            {c.label}
          </button>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl text-slate-900">Featured this week</h2>
            <Link href="/stays" className="text-sm font-medium text-coral">
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
    </div>
  );
}
