"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categoryHasInventory } from "@/lib/data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/stays", label: "Stays", cat: "stays" },
  { href: "/day-trips", label: "Day trips", cat: "day-trips" },
  { href: "/recreation", label: "Recreation", cat: "recreation" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInNote, setSignInNote] = useState(false);
  const items = NAV.filter((n) => categoryHasInventory(n.cat));

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-wide text-slate-900">
          ATLAS
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm font-medium text-slate-600 hover:text-slate-900",
                  active && "border-b-2 border-coral pb-1 text-coral"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/saved" className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline">
            Saved
          </Link>
          <Link href="/trips" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            My trips
          </Link>
          <button
            type="button"
            className="rounded-pill border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 sm:px-4"
            onClick={() => setSignInNote((v) => !v)}
            aria-expanded={signInNote}
          >
            Sign in
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill border border-slate-200 text-slate-800 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {signInNote && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 text-sm text-slate-600 sm:px-6">
          Guest checkout is available now. Account sign-in lands in a later release.
        </div>
      )}
      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/saved"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-3 text-sm font-medium",
                  pathname.startsWith("/saved") ? "bg-coral/10 text-coral" : "text-slate-700"
                )}
              >
                Saved
              </Link>
            </li>
            {items.map((n) => {
              const active = pathname.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 text-sm font-medium",
                      active ? "bg-coral/10 text-coral" : "text-slate-700"
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
