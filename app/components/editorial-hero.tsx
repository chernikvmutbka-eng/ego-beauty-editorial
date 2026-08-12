import Image from "next/image";
import Link from "next/link";

export function EditorialHero() {
  return (
    <section className="figma-hero shell" aria-label="Коллекция Mousse EGO Beauty">
      <div className="figma-hero-image">
        <Image src="/brand/banner-1.jpg" alt="Моделирующие гели EGO Beauty Mousse" fill priority sizes="(max-width: 800px) 100vw, 58vw" />
        <span className="figma-hero-tag">Mousse collection</span>
      </div>
      <div className="figma-hero-copy">
        <p>Новая коллекция</p>
        <h1><em>Нюд,</em><br />который<br />держит форму</h1>
        <div className="figma-hero-description">Плотные моделирующие гели для укрепления, ремонта и наращивания. Палитра оттенков на каждый день.</div>
        <div className="figma-hero-buttons">
          <Link className="figma-pill light" href="/catalog?collection=Mousse">Смотреть Mousse</Link>
          <Link className="figma-pill outline-light" href="/catalog">Весь каталог</Link>
        </div>
        <div className="figma-slider-dots" aria-hidden="true"><i className="active" /><i /><i /></div>
      </div>
    </section>
  );
}
