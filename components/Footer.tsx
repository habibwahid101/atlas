import Link from "next/link";

const EXPLORE = [
  { href: "/stays", label: "Stays" },
  { href: "/day-trips", label: "Day trips" },
  { href: "/recreation", label: "Recreation" },
] as const;

const SUPPORT = [
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

function Col({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="min-h-11 text-sm text-slate-600 hover:text-slate-900">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg tracking-wide text-slate-900">ATLAS</p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Bangladesh stays, day trips, and recreation — clear prices, guest checkout.
          </p>
        </div>
        <Col title="Explore" links={EXPLORE} />
        <Col title="Support" links={SUPPORT} />
        <Col title="Legal" links={LEGAL} />
      </div>
    </footer>
  );
}
