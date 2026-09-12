import type { Metadata } from "next";
import DetailClient from "@/components/DetailClient";
import { getListing } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing("recreation", slug);
  if (!listing) return { title: "Not found · ATLAS" };
  return {
    title: `${listing.title} · ATLAS`,
    description: listing.description.slice(0, 155),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 155),
      images: listing.images[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <DetailClient category="recreation" slug={slug} />;
}
