import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О бренде",
  description: "EGO Beauty — профессиональные материалы, созданные мастерами для мастеров.",
};

const stats = [
  ["52", "набора гель-лаков", "311 оттенков"],
  ["67", "оттенков", "для идеальной базы"],
  ["21", "набор гелей", "135 оттенков"],
  ["5", "наборов акригелей", "18 оттенков"],
  ["5", "наборов полигелей", "32 оттенка"],
];

export default function AboutPage() {
  return (
    <main className="editorial-inner-page">
      <section className="about-hero">
        <Image src="/brand/banner-2.jpg" alt="Профессиональные материалы EGO Beauty" fill priority sizes="100vw" />
        <div className="shell"><span>( о бренде )</span><h1>больше, чем<br />просто материалы</h1></div>
      </section>
      <section className="about-intro shell">
        <p className="eyebrow">( EGO Beauty / создано мастерами )</p>
        <h2>Мы создаём продукты для мастеров уже много лет.</h2>
        <div><p>Совершенствуем формулы, палитры и качество, чтобы каждый материал был предсказуемым в работе, а результат — точным и вдохновляющим.</p><p>Собственное производство помогает нам контролировать путь продукта от идеи до готовой баночки. Тысячи мастеров выбирают EGO Beauty каждый день.</p></div>
      </section>
      <section className="about-stats shell">
        {stats.map(([value, label, note], index) => <article key={label}><span>0{index + 1}</span><strong>{value}</strong><h2>{label}</h2><p>{note}</p></article>)}
      </section>
      <section className="about-letter shell">
        <div><span>( наша работа )</span><h2>формулы,<br />которым доверяют</h2></div>
        <div><p>Мы слушаем обратную связь мастеров, тестируем текстуры в реальной работе и развиваем ассортимент не ради количества, а ради свободы выбора.</p><p>В коллекциях есть спокойные рабочие нюды, выразительные эффекты и материалы для сложных техник — всё, чтобы у мастера был свой язык.</p><strong>С любовью,<br />Команда EGO Beauty</strong><Link href="/catalog">( открыть каталог )</Link></div>
      </section>
    </main>
  );
}
