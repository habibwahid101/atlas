"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryHasInventory } from "@/lib/data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/stays", label: "Stays", cat: "stays" },
  { href: "/day-trips", label: "Day trips", cat: "day-trips" },
  { href: "/recreation", label: "Recreation", cat: "recreation" },
] as const;

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-wide text-slate-900">
          ATLAS
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.filter((n) => categoryHasInventory(n.cat)).map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm font-medium text-slate-600 hover:text-slate-900",
                  active && "text-coral border-b-2 border-coral pb-1"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/trips" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            My trips
          </Link>
          <button
            type="button"
            className="hidden rounded-pill border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 sm:inline-flex"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
