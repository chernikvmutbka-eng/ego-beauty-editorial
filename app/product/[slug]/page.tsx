import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productBySlug, products, reviewCountLabel } from "@/lib/products";
import { ProductDetail } from "@/app/components/product-detail";
import { ProductRail } from "@/app/components/product-card";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return { title: product.shortName, description: product.description, alternates: { canonical: `/product/${product.slug}` }, openGraph: { title: `${product.shortName} — EGO Beauty`, description: product.description, images: [product.image] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id && (item.collection === product.collection || item.category === product.category)).slice(0, 5);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name, sku: product.id, image: [product.image, `/products/${product.id}-2.webp`], description: product.description, brand: { "@type": "Brand", name: "EGO Beauty" },
    offers: { "@type": "Offer", priceCurrency: "RUB", price: product.price, availability: "https://schema.org/InStock", url: `/product/${product.slug}` },
    ...(product.reviews ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews } } : {}),
  };
  const categoryHref = `/catalog?category=${encodeURIComponent(product.category)}`;
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Главная", item: "/" }, { "@type": "ListItem", position: 2, name: "Каталог", item: "/catalog" }, { "@type": "ListItem", position: 3, name: product.category, item: categoryHref }, { "@type": "ListItem", position: 4, name: product.shortName, item: `/product/${product.slug}` }] };
  return (
    <>
      <div className="product-page shell">
        <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/catalog">Каталог</Link><span>/</span><Link href={categoryHref}>{product.category}</Link><span>/</span><span>{product.shortName}</span></nav>
        <ProductDetail product={product} />
        <section className="product-information">
          <div className="info-intro"><p className="eyebrow">Профессиональная формула</p><h2>В работе</h2></div>
          <div className="info-accordions">
            <details open><summary>Описание</summary><p>{product.description}</p></details>
            <details><summary>Технология нанесения</summary><p>Подготовьте ногтевую пластину, нанесите материал по выбранной мастером технике и полимеризуйте по инструкции на упаковке. Точное время зависит от мощности и типа лампы.</p></details>
            <details><summary>Характеристики</summary><dl><div><dt>Категория</dt><dd>{product.subcategory}</dd></div><div><dt>Коллекция</dt><dd>{product.collection}</dd></div><div><dt>Объём</dt><dd>{product.volume}</dd></div><div><dt>Эффект</dt><dd>{product.effect}</dd></div><div><dt>Укрывистость</dt><dd>{product.collection === "Mousse" ? "Плотная" : "Зависит от оттенка"}</dd></div><div><dt>Срок годности</dt><dd>Смотрите маркировку на упаковке</dd></div></dl></details>
            <details><summary>Состав и документы</summary><p>Полный INCI-состав, декларации и сертификаты будут добавлены после получения актуального пакета документов производителя. До подключения используйте маркировку на упаковке.</p></details>
            <details><summary>Меры предосторожности</summary><p>Только для профессионального применения. Избегайте контакта с кожей и глазами. Храните в недоступном для детей месте, вдали от солнечного света.</p></details>
          </div>
        </section>
        <section className="product-feedback"><div><p className="eyebrow">Оценка покупателей</p><strong>{product.rating || "—"}</strong><span>{product.reviews ? `${reviewCountLabel(product.reviews)} на маркетплейсе` : "Новая позиция"}</span></div><div><h2>Отзывы и вопросы</h2><p>Синхронизация текстов отзывов и вопросов с витриной будет подключена через адаптер. Рейтинг и количество отзывов уже отражают актуальный снимок карточки товара.</p><button>Задать вопрос</button></div></section>
      </div>
      <ProductRail title="Продолжить подбор" kicker={product.collection} items={related} href={`/catalog?collection=${encodeURIComponent(product.collection)}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
