"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categoryHasInventory } from "@/lib/data";
import { cn } from "@/lib/utils";
import { IconClose, IconMenu } from "@/components/Icons";

const NAV = [
  { href: "/stays", label: "Stays", cat: "stays" },
  { href: "/day-trips", label: "Day trips", cat: "day-trips" },
  { href: "/recreation", label: "Recreation", cat: "recreation" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const items = NAV.filter((n) => categoryHasInventory(n.cat));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!signInOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSignInOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [signInOpen, menuOpen]);

  function goSearch() {
    setMenuOpen(false);
    if (pathname === "/") {
      queueMicrotask(() => {
        const el = document.getElementById("search-pill");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = el?.querySelector<HTMLInputElement>("input");
        input?.focus();
      });
    } else {
      router.push("/?focus=search");
    }
  }

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
          <Link href="/trips" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            My trips
          </Link>
          <button
            type="button"
            className="rounded-pill border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 sm:px-4"
            onClick={() => setSignInOpen(true)}
            aria-haspopup="dialog"
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
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
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
            <li>
              <Link
                href="/trips"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-3 text-sm font-medium",
                  pathname.startsWith("/trips") ? "bg-coral/10 text-coral" : "text-slate-700"
                )}
              >
                My trips
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-slate-700"
                onClick={() => {
                  setMenuOpen(false);
                  setSignInOpen(true);
                }}
              >
                Sign in
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-medium text-slate-700"
                onClick={goSearch}
              >
                Search
              </button>
            </li>
          </ul>
        </nav>
      )}

      {signInOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accounts-soon-title"
          onClick={() => setSignInOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-card bg-white p-5 shadow-soft sm:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="accounts-soon-title" className="font-display text-xl text-slate-900">
              Accounts coming soon
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Book as a guest for now — trips save on this device.
            </p>
            <button
              type="button"
              className="mt-5 flex min-h-11 w-full items-center justify-center rounded-pill bg-coral text-sm font-semibold text-white hover:bg-coral-700"
              onClick={() => setSignInOpen(false)}
            >
              Continue as guest
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
