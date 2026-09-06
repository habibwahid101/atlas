import BookClient from "@/components/BookClient";
import type { Category } from "@/lib/types";

export default async function Page({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  return <BookClient category={type as Category} slug={slug} />;
}
