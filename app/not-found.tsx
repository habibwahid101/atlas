import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-coral">404</p>
      <h1 className="mt-2 font-display text-3xl text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600">
        That link may be outdated, or the listing isn’t available. Try browsing stays or head home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="min-h-11 rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
          Home
        </Link>
        <Link href="/stays" className="min-h-11 rounded-pill border border-slate-200 px-5 py-3 text-sm font-medium">
          Browse stays
        </Link>
      </div>
    </div>
  );
}
