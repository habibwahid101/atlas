export function AudienceChip({ label }: { label: string }) {
  const display = label === "Single" ? "Solo" : label === "Corporate" ? "Work" : label;
  return (
    <span className="inline-flex items-center gap-1 rounded-pill bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      Who: {display}
    </span>
  );
}
