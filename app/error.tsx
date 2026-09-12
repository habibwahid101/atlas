"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display text-2xl tracking-wide text-slate-900">ATLAS</p>
      <h1 className="mt-4 font-display text-3xl text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-sm text-slate-600">Try again or go home.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="min-h-11 rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white hover:bg-coral-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="min-h-11 rounded-pill border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
