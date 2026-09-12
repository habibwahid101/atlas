import type { Metadata } from "next";
import { Suspense } from "react";
import BrowsePage from "@/components/BrowsePage";
import { BrowseSkeleton } from "@/components/Skeleton";

export const metadata: Metadata = {
  title: "Stays in Bangladesh | ATLAS",
  description: "Browse Bangladesh stays with all-in BDT pricing.",
};

export default function Page() {
  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <BrowsePage category="stays" />
    </Suspense>
  );
}
