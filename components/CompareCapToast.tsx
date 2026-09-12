"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { COMPARE_CAP_MESSAGE, subscribeCompareCapToast } from "@/lib/compare-cap-toast";

export function CompareCapToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return subscribeCompareCapToast((msg) => {
      setMessage(msg || COMPARE_CAP_MESSAGE);
      setKey((k) => k + 1);
    });
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 4500);
    return () => window.clearTimeout(t);
  }, [message, key]);

  if (!mounted || !message) return null;

  return createPortal(
    <div
      key={key}
      role="status"
      aria-live="assertive"
      data-testid="compare-cap-toast"
      className="fixed inset-x-0 top-3 z-[9999] flex justify-center px-4"
    >
      <div className="pointer-events-auto max-w-md rounded-pill border border-white/10 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl">
        {message}
      </div>
    </div>,
    document.body
  );
}
