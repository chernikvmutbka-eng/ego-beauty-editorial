import type { Metadata } from "next";
import Link from "next/link";
import { CatalogClient } from "../components/catalog-client";

export const metadata: Metadata = {
  title: "Каталог профессиональных материалов",
  description: "Гели Mousse, гель-лаки Glow Cat, жидкие полигели Ice Cat и наборы EGO Beauty.",
};

export default function CatalogPage() {
  return (
    <div className="catalog-page shell">
      <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span>Каталог</span></nav>
      <CatalogClient />
    </div>
  );
}
