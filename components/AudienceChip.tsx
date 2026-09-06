export function AudienceChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-pill bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      Audience: {label}
    </span>
  );
}
