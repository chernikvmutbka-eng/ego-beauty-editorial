import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "./components/editorial-hero";

const categoryCards = [
  { title: "Базы", image: "/products/945458176.webp", href: "/catalog?category=Гели%20для%20моделирования%20ногтей" },
  { title: "Уход", image: "/products/1272097452.webp", href: "/catalog?category=Уходовые%20средства" },
  { title: "Топы", image: "/products/1141151914.webp", href: "/catalog?category=Топы" },
];

const promoCards = [
  { title: "Новинки", image: "/products/1272155829-3.webp", href: "/catalog?badge=Новинка", className: "new" },
  { title: "Скидки", image: "/products/1046546817-2.webp", href: "/catalog?badge=Sale", className: "sale" },
  { title: "Бестселлеры", image: "/products/945458176-3.webp", href: "/catalog?badge=Хит", className: "best" },
];

export default function Home() {
  return (
    <>
      <EditorialHero />

      <section className="figma-category-section shell" aria-labelledby="category-heading">
        <div className="figma-section-heading">
          <h2 id="category-heading">Выберите категорию</h2>
          <div className="figma-round-arrows" aria-hidden="true"><span>←</span><span>→</span></div>
        </div>
        <div className="figma-category-cards">
          {categoryCards.map((card) => (
            <Link className="figma-image-card" href={card.href} key={card.title}>
              <Image src={card.image} alt={card.title} fill sizes="(max-width: 720px) 90vw, 31vw" />
              <span>{card.title}</span>
            </Link>
          ))}
        </div>
        <Link className="figma-pill dark centered" href="/catalog">Смотреть все</Link>
      </section>

      <section className="figma-about-banner shell">
        <Image src="/products/1272155829-3.webp" alt="Текстура материалов EGO Beauty" fill sizes="100vw" />
        <div className="figma-about-copy">
          <p>EGO BEAUTY</p>
          <h2>больше, чем<br /><em>просто материалы</em></h2>
          <Link className="figma-pill outline-light" href="/about">О бренде</Link>
        </div>
      </section>

      <section className="figma-promos shell" aria-labelledby="promo-heading">
        <h2 className="visually-hidden" id="promo-heading">Подборки EGO Beauty</h2>
        <div className="figma-promo-grid">
          {promoCards.map((card) => (
            <Link className={`figma-promo-card ${card.className}`} href={card.href} key={card.title}>
              <Image src={card.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
              <span>{card.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
