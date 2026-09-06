import DetailClient from "@/components/DetailClient";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailClient category="stays" slug={slug} />;
}
