import { Suspense } from "react";
import BrowsePage from "@/components/BrowsePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <BrowsePage category="recreation" />
    </Suspense>
  );
}
