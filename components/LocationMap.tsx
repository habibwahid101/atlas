"use client";

import { useEffect, useMemo, useState } from "react";

export function LocationMap({
  lat,
  lng,
  place,
}: {
  lat: number;
  lng: number;
  place: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const embedSrc = useMemo(() => {
    const pad = 0.02;
    const bbox = `${lng - pad}%2C${lat - pad}%2C${lng + pad}%2C${lat + pad}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [lat, lng]);

  useEffect(() => {
    if (failed || loaded) return;
    const t = window.setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 10000);
    return () => window.clearTimeout(t);
  }, [failed, loaded]);

  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h2>
      <div className="mt-3 overflow-hidden rounded-card border border-slate-200 bg-stone-200">
        {failed ? (
          <div
            className="flex h-[300px] w-full flex-col items-center justify-center gap-2 bg-stone-200 px-4 text-center"
            data-testid="map-placeholder"
          >
            <span className="text-2xl" aria-hidden>
              📍
            </span>
            <p className="font-medium text-slate-800">{place}</p>
            <p className="text-sm text-slate-600">Map preview unavailable</p>
          </div>
        ) : (
          <iframe
            title={`Map of ${place}`}
            src={embedSrc}
            className="h-[300px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">{place}, Bangladesh</p>
      <a
        href={directions}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-coral hover:underline"
      >
        Get directions
      </a>
    </section>
  );
}
