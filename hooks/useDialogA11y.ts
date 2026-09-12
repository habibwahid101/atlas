"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type Opts = {
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Preferred: the control that opened the dialog (click target). */
  openerRef?: RefObject<HTMLElement | null>;
};

/**
 * Dialog a11y: focus trap, Esc, restore focus to opener.
 */
export function useDialogA11y(open: boolean, onClose: () => void, opts?: Opts) {
  const panelRef = useRef<HTMLDivElement>(null);
  const savedOpenerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      savedOpenerRef.current =
        opts?.openerRef?.current ?? (document.activeElement as HTMLElement | null);
      queueMicrotask(() => {
        const initial = opts?.initialFocusRef?.current;
        if (initial) {
          initial.focus();
          return;
        }
        const panel = panelRef.current;
        if (!panel) return;
        const first = panel.querySelectorAll<HTMLElement>(FOCUSABLE)[0];
        first?.focus();
      });
    }
    if (!open && wasOpen.current) {
      const opener = opts?.openerRef?.current ?? savedOpenerRef.current;
      savedOpenerRef.current = null;
      queueMicrotask(() => {
        if (opener && typeof opener.focus === "function") opener.focus();
      });
    }
    wasOpen.current = open;
  }, [open, opts?.initialFocusRef, opts?.openerRef]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const list = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );
      if (!list.length) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        e.preventDefault();
        e.stopPropagation();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          e.stopPropagation();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        e.stopPropagation();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  return { panelRef };
}
