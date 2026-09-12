"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Dialog a11y: remember opener, focus initial target, trap Tab, Esc → onClose, restore focus.
 */
export function useDialogA11y(
  open: boolean,
  onClose: () => void,
  opts?: { initialFocusRef?: RefObject<HTMLElement | null> }
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      openerRef.current = document.activeElement as HTMLElement | null;
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
      const opener = openerRef.current;
      openerRef.current = null;
      queueMicrotask(() => {
        if (opener && typeof opener.focus === "function") opener.focus();
      });
    }
    wasOpen.current = open;
  }, [open, opts?.initialFocusRef]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return { panelRef };
}
