import type { Metadata } from "next";
import DetailClient from "@/components/DetailClient";
import { getListing } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing("day-trips", slug);
  if (!listing) return { title: "Page not found | ATLAS" };
  const description = listing.description.slice(0, 155);
  return {
    title: `${listing.title} · ${listing.place} | ATLAS`,
    description,
    openGraph: {
      title: `${listing.title} · ${listing.place} | ATLAS`,
      description,
      images: listing.images[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <DetailClient category="day-trips" slug={slug} />;
}
