"use client";

import Link from "next/link";
import { useState } from "react";

const steps = {
  strengthen: { label: "Укрепить", href: "/catalog?collection=Mousse", result: "Mousse — плотная формула для укрепления и ремонта формы" },
  model: { label: "Смоделировать", href: "/catalog?category=Жидкие полигели", result: "Ice Cat — жидкий полигель для моделирования с мягким переливом" },
  color: { label: "Добавить эффект", href: "/catalog?effect=Кошачий глаз", result: "Glow Cat — шелковая кошка и деликатные вкрапления" },
};

export function HomeFinder() {
  const [choice, setChoice] = useState<keyof typeof steps>("strengthen");
  const result = steps[choice];
  return (
    <section className="finder-section shell">
      <div className="finder-intro"><p className="eyebrow">Поможем выбрать</p><h2>Что нужно сделать?</h2><p>Три вопроса здесь не нужны. Начните с задачи — мы покажем подходящий материал.</p></div>
      <div className="finder-options" role="radiogroup" aria-label="Выберите задачу">
        {(Object.entries(steps) as [keyof typeof steps, (typeof steps)[keyof typeof steps]][]).map(([key, item]) => <button key={key} type="button" role="radio" aria-checked={choice === key} className={choice === key ? "active" : ""} onClick={() => setChoice(key)}>{item.label}</button>)}
      </div>
      <div className="finder-result" aria-live="polite"><span>Наш выбор</span><strong>{result.result}</strong><Link href={result.href}>Перейти к подборке →</Link></div>
    </section>
  );
}
