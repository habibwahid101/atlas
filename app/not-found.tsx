import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display text-2xl tracking-wide text-slate-900">ATLAS</p>
      <h1 className="mt-4 font-display text-3xl text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600">That link doesn’t exist on ATLAS.</p>
      <Link href="/" className="mt-8 min-h-11 rounded-pill bg-coral px-5 py-3 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}
