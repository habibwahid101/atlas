"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { SearchPill } from "@/components/SearchPill";
import { ListingCard } from "@/components/ListingCard";
import { featuredListings, LISTINGS } from "@/lib/data";
import { useAtlas } from "@/context/AtlasContext";
import type { Category, Listing } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/utils";

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

function featuredSeeAllLabel(cat: Category) {
  if (cat === "stays") return "See all stays";
  if (cat === "day-trips") return "See all day trips";
  return "See all recreation";
}

export default function HomePage() {
  const { search } = useAtlas();
  const featured = featuredListings();
  const featuredCat: Category = featured[0]?.category || "stays";

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("focus") !== "search") return;
    const el = document.getElementById("search-pill");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const input = el?.querySelector<HTMLInputElement>("input");
    input?.focus();
  }, []);

  return (
    <div>
      <section className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card sm:aspect-[21/9]">
          <Image
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=80"
            alt="Coastal stay"
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-start px-4 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="max-w-[20ch] font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl sm:max-w-[28ch] lg:text-5xl">
                Book Bangladesh with the full price up front
              </h1>
              <p className="mt-3 max-w-xl text-base leading-snug text-white/90 sm:text-lg">
                Stays, day trips, and recreation — all-in BDT, no surprise fees.
              </p>
              <div className="mt-6">
                <SearchPill />
              </div>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl text-slate-900">Worth booking this week</h2>
            <Link href={`/${featuredCat}`} className="text-sm font-medium text-coral">
              {featuredSeeAllLabel(featuredCat)}
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
