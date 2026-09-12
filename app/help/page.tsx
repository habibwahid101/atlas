import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help · ATLAS",
  description: "Help for ATLAS stays, day trips, and recreation bookings in Bangladesh.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">Help</h1>
      <p className="mt-4 leading-relaxed text-slate-600">
        How ATLAS works — Search stays, day trips, or recreation. Compare up to three. Book with the full (all-in) price shown. Guest checkout works now. To change or cancel, open My trips.
      </p>
      <div className="mt-8 rounded-card border border-slate-200 bg-white p-5">
        <h2 className="font-medium text-slate-900">Operator support</h2>
        <p className="mt-2 text-sm text-slate-600">ATLAS demo operator desk (Bangladesh).</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>
            Email:{" "}
            <a className="font-medium text-coral" href="mailto:hello.habibwahid@gmail.com">
              hello.habibwahid@gmail.com
            </a>
          </li>
          <li>
            Phone:{" "}
            <a className="font-medium text-coral" href="tel:+8801711000000">
              +880 1711-000000
            </a>{" "}
            <span className="text-slate-500">(demo line)</span>
          </li>
        </ul>
        <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-coral">
          Contact form notes
        </Link>
      </div>
    </div>
  );
}
