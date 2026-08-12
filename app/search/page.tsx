import type { Metadata } from "next";
import { CatalogClient } from "../components/catalog-client";

export const metadata: Metadata = { title: "Поиск по каталогу", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return (
    <div className="catalog-page figma-catalog-page shell">
      <CatalogClient mode="search" initialQuery={q} />
    </div>
  );
}
