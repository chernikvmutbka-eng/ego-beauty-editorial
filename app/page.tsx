import Image from "next/image";
import Link from "next/link";
import { catalogTree, products } from "@/lib/products";
import { EditorialHero } from "./components/editorial-hero";
import { ProductRail } from "./components/product-card";

export default function Home() {
  const newItems = products.filter((product) => product.badge === "Новинка").slice(0, 5);
  const bestsellers = products.filter((product) => product.badge === "Хит").slice(0, 5);

  return (
    <>
      <EditorialHero />

      <section className="editorial-manifesto shell">
        <p>( ego beauty / professional )</p>
        <h1>Материалы для тех,<br />кто знает, чего хочет.</h1>
        <div><span>Профессиональные формулы</span><p>Создаём палитры и текстуры, к которым мастер возвращается каждый рабочий день.</p></div>
      </section>

      <section className="editorial-category-index shell">
        <div className="editorial-section-title"><span>( 01 )</span><h2>каталог</h2><Link href="/catalog">( смотреть всё )</Link></div>
        <div className="editorial-category-list">
          {catalogTree.slice(0, 7).map((section, index) => (
            <Link key={section.name} href={`/catalog?category=${encodeURIComponent(section.name)}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{section.name}</strong>
              <small>{section.subcategories.slice(0, 3).join(" · ")}</small>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <ProductRail title="новинки" kicker="( 02 / только появились )" items={newItems} href="/catalog?badge=Новинка" />

      <section className="editorial-story shell" id="brand-story">
        <div className="editorial-story-image"><Image src="/brand/mousse-story.jpg" alt="Коллекция Mousse — моделирующие гели EGO Beauty" fill sizes="(max-width: 800px) 100vw, 54vw" /></div>
        <div className="editorial-story-copy">
          <span>( наша философия )</span>
          <h2>больше, чем<br />просто материалы</h2>
          <p>Мы создаём продукты для мастеров уже много лет, совершенствуем формулы, палитры и качество, чтобы каждая работа была удобной, точной и вдохновляющей.</p>
          <div className="editorial-story-stats"><div><strong>52</strong><small>набора гель-лаков</small></div><div><strong>311</strong><small>оттенков</small></div><div><strong>135</strong><small>оттенков гелей</small></div></div>
          <Link href="/about">( читать больше )</Link>
        </div>
      </section>

      <section className="editorial-quote shell">
        <p>The work you do with love becomes the work people remember.</p>
        <span>( EGO Beauty / создано мастерами для мастеров )</span>
      </section>

      <ProductRail title="выбор мастеров" kicker="( 03 / проверенные хиты )" items={bestsellers} href="/catalog?badge=Хит" />

      <section className="editorial-effects shell">
        <div className="editorial-section-title"><span>( 04 )</span><h2>эффекты</h2></div>
        <div className="editorial-effect-grid">
          <Link href="/catalog?collection=Mousse"><Image src="/products/945458176-2.webp" alt="Текстура Mousse" fill sizes="33vw" /><span>mousse / рабочий нюд</span></Link>
          <Link href="/catalog?collection=Ice%20Cat"><Image src="/products/1272155829-2.webp" alt="Текстура Ice Cat" fill sizes="33vw" /><span>ice cat / морозное сияние</span></Link>
          <Link href="/catalog?collection=Glow%20Cat"><Image src="/products/1141151914-2.webp" alt="Текстура Glow Cat" fill sizes="33vw" /><span>glow cat / шёлковая кошка</span></Link>
        </div>
      </section>

      <section className="editorial-fortune shell">
        <div className="editorial-fortune-wheel" aria-hidden="true"><span>EGO</span><i>300</i></div>
        <div><span>( колесо фортуны )</span><h2>один шанс.<br />настоящий приз.</h2><p>Подпишитесь на Telegram, укажите ник и испытайте удачу. Каждый 300-й участник получает суперприз.</p><Link href="/fortune">( крутить колесо )</Link></div>
      </section>

      <section className="editorial-contact shell">
        <div><span>( сотрудничество )</span><h2>растём вместе</h2></div>
        <p>Магазины, студии, школы, преподаватели и амбассадоры — подберём формат под ваш проект и географию.</p>
        <Link href="/cooperation">( оставить заявку )</Link>
      </section>
    </>
  );
}
