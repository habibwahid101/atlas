import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · ATLAS",
  description: "Contact the ATLAS operator for stays, day trips, and recreation in Bangladesh.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-slate-900">Contact</h1>
      <p className="mt-4 leading-relaxed text-slate-600">
        Reach the ATLAS operator desk for booking questions. This is a product demo — responses may be delayed.
      </p>
      <div className="mt-8 space-y-4 rounded-card border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-900">Email</span>
          <br />
          <a className="text-coral" href="mailto:hello.habibwahid@gmail.com">
            hello.habibwahid@gmail.com
          </a>
        </p>
        <p>
          <span className="font-medium text-slate-900">Phone</span>
          <br />
          <a className="text-coral" href="tel:+8801711000000">
            +880 1711-000000
          </a>{" "}
          <span className="text-slate-500">(demo)</span>
        </p>
        <p>
          <span className="font-medium text-slate-900">Hours</span>
          <br />
          Sat–Thu · 10:00–18:00 Asia/Dhaka
        </p>
      </div>
    </div>
  );
}
