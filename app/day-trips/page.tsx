import type { Metadata } from "next";
import { Suspense } from "react";
import BrowsePage from "@/components/BrowsePage";
import { BrowseSkeleton } from "@/components/Skeleton";

export const metadata: Metadata = {
  title: "Day trips in Bangladesh | ATLAS",
  description: "Browse Bangladesh day trips with all-in BDT pricing.",
  openGraph: {
    title: "Day trips in Bangladesh | ATLAS",
    description: "Browse Bangladesh day trips with all-in BDT pricing.",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <BrowsePage category="day-trips" />
    </Suspense>
  );
}
