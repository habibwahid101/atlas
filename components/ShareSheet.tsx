"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useDialogA11y } from "@/hooks/useDialogA11y";

export function ShareSheet({
  open,
  onClose,
  title,
  url,
  openerRef,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
  openerRef?: RefObject<HTMLElement | null>;
}) {
  const [toast, setToast] = useState<string | null>(null);

  const closeRef = useRef<HTMLButtonElement>(null);
  const { panelRef } = useDialogA11y(open, onClose, { initialFocusRef: closeRef, openerRef });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  if (!open) return null;

  const waText = encodeURIComponent(`${title}\n${url}`);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch {
      setToast("Link copied");
      // Fallback for older browsers
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {}
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 sm:items-center"
        role="presentation"
        onClick={onClose}
      >
        <div
          ref={panelRef}
          className="w-full max-w-md rounded-t-card bg-white p-5 shadow-soft sm:rounded-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-sheet-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id="share-sheet-title" className="font-display text-xl text-slate-900">
              Share
            </h2>
            <button ref={closeRef} type="button" className="min-h-11 min-w-11 text-2xl leading-none text-slate-500" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
          <p className="mt-1 truncate text-sm text-slate-500">{title}</p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              className="flex min-h-11 items-center justify-center rounded-pill border border-slate-200 text-sm font-medium text-slate-800"
              onClick={copyLink}
            >
              Copy link
            </button>
            <a
              href={`https://wa.me/?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center justify-center rounded-pill bg-coral text-sm font-semibold text-white hover:bg-coral-700"
            >
              WhatsApp
            </a>
          </div>
          <button
            type="button"
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-pill text-sm font-medium text-slate-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-pill bg-slate-900 px-4 py-2 text-sm text-white shadow-soft">
          {toast}
        </div>
      )}
    </>
  );
}
