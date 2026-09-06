import DocClient from "@/components/DocClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocClient id={id} kind="voucher" />;
}
