import type { Metadata } from "next";
import Link from "next/link";
import { CatalogClient } from "../components/catalog-client";

export const metadata: Metadata = { title: "Поиск по каталогу", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return (
    <div className="catalog-page shell">
      <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span>Поиск</span></nav>
      <CatalogClient mode="search" initialQuery={q} />
    </div>
  );
}
