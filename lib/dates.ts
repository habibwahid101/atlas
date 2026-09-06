export function parseISO(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

export function formatShortRange(from: string, to: string) {
  const a = parseISO(from);
  const b = parseISO(to);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${a.toLocaleDateString("en-GB", opts)}–${b.toLocaleDateString("en-GB", opts)}`;
}

export function nightsBetween(from: string, to: string) {
  const ms = parseISO(to).getTime() - parseISO(from).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function addDays(iso: string, days: number) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatMoney(n: number) {
  return `BDT ${n.toLocaleString("en-BD")}`;
}

export function defaultDates() {
  // Demo window matching Designer mocks: 12–15 Sep
  return { from: "2026-09-12", to: "2026-09-15" };
}
