import type { Metadata } from "next";
import { CatalogClient } from "../components/catalog-client";

export const metadata: Metadata = {
  title: "Каталог профессиональных материалов",
  description: "Гели Mousse, гель-лаки Glow Cat, жидкие полигели Ice Cat и наборы EGO Beauty.",
};

export default function CatalogPage() {
  return (
    <div className="catalog-page figma-catalog-page shell">
      <CatalogClient />
    </div>
  );
}
