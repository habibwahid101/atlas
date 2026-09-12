import Link from "next/link";

const LINKS = [
  { href: "/help", label: "Help" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg tracking-wide text-slate-900">ATLAS</p>
          <p className="mt-1 text-sm text-slate-500">Travel thoughtfully · Bangladesh-first</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="min-h-11 text-sm font-medium text-slate-600 hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
