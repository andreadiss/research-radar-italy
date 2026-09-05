import { notFound } from "next/navigation";
import { OpportunityDirectory, directoryMetadata } from "@/app/components/OpportunityDirectory";
import { directoryPageCount } from "@/lib/opportunity-directory";

export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, directoryPageCount() - 1) }, (_, i) => ({ page: String(i + 2) }));
}
export function generateMetadata({ params }: { params: { page: string } }) { return directoryMetadata(Number(params.page)); }
export default function Page({ params }: { params: { page: string } }) {
  const page = Number(params.page);
  if (!Number.isInteger(page) || page < 2 || page > directoryPageCount()) notFound();
  return <OpportunityDirectory page={page} />;
}
