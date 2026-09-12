export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export function BrowseSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-3 h-4 w-40" />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 w-28 rounded-pill" />
        <Skeleton className="h-10 w-36 rounded-pill" />
        <Skeleton className="h-10 w-32 rounded-pill" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/3] w-full rounded-card" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Skeleton className="aspect-[21/9] w-full rounded-card" />
      <div className="mt-3 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-24" />
        ))}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="mt-3 h-4 w-40" />
          <Skeleton className="mt-6 h-24 w-full" />
        </div>
        <Skeleton className="h-72 w-full rounded-card" />
      </div>
    </div>
  );
}
