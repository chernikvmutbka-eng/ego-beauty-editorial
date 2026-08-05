"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { src: "/brand/banner-1.jpg", alt: "Коллекция Mousse EGO Beauty", position: "center" },
  { src: "/brand/banner-2.jpg", alt: "Профессиональные гели EGO Beauty", position: "center" },
  { src: "/brand/banner-3.jpg", alt: "Материалы EGO Beauty для мастеров", position: "center" },
];

export function EditorialHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5600);
    return () => window.clearInterval(timer);
  }, []);

  function move(direction: number) {
    setActive((value) => (value + direction + slides.length) % slides.length);
  }

  return (
    <section className="editorial-hero" aria-roledescription="carousel" aria-label="Коллекции EGO Beauty">
      <div className="editorial-slides">
        {slides.map((slide, index) => (
          <div className={index === active ? "editorial-slide active" : "editorial-slide"} aria-hidden={index !== active} key={slide.src}>
            <Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" style={{ objectPosition: slide.position }} />
          </div>
        ))}
      </div>
      <div className="editorial-hero-actions">
        <Link href="/catalog?badge=Новинка">( смотреть новинки )</Link>
        <Link href="/catalog">( перейти в каталог )</Link>
      </div>
      <div className="editorial-hero-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Предыдущий баннер">←</button>
        <div>{slides.map((slide, index) => <button key={slide.src} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Открыть баннер ${index + 1}`} />)}</div>
        <button type="button" onClick={() => move(1)} aria-label="Следующий баннер">→</button>
      </div>
      <span className="editorial-hero-index">0{active + 1} / 0{slides.length}</span>
    </section>
  );
}
