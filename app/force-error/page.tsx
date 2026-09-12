"use client";

/**
 * QA-only: throws on render so app/error.tsx can be verified.
 * Visit /force-error — expect “Something went wrong” + Try again / Go home.
 */
export default function ForceErrorPage() {
  throw new Error("ATLAS QA force-error — intentional");
}
