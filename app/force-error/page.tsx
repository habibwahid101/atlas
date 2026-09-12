"use client";

import { useEffect, useState } from "react";

/**
 * QA-only: throws after mount so app/error.tsx can be verified without breaking build.
 * Visit /force-error — expect “Something went wrong” + Try again / Go home.
 */
export default function ForceErrorPage() {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(true);
  }, []);
  if (armed) {
    throw new Error("ATLAS QA force-error — intentional");
  }
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-slate-500">
      Arming error boundary…
    </div>
  );
}
