import type { Metadata } from "next";
import Link from "next/link";
import { CooperationForm } from "../components/cooperation-form";

export const metadata: Metadata = { title: "Сотрудничество", description: "Оптовые условия, партнёрство со студиями, школами, преподавателями и амбассадорами EGO Beauty." };

const directions = [
  { number: "01", title: "Дистрибьюторы и опт", forWhom: "Региональным дистрибьюторам и магазинам профессиональной косметики", benefits: ["Оптовая матрица", "Материалы для запуска", "Персональный менеджер"], start: "Заявка → знакомство → коммерческие условия → первая поставка", type: "wholesale" },
  { number: "02", title: "Студии и салоны", forWhom: "Салонам и студиям, которые формируют единую рабочую палитру", benefits: ["Подбор стартовой матрицы", "Командные закупки", "Новинки для тестирования"], start: "Заявка → аудит потребности → подбор продуктов → заказ", type: "studio" },
  { number: "03", title: "Школы и преподаватели", forWhom: "Школам маникюра, технологам и практикующим преподавателям", benefits: ["Материалы для обучения", "Методическая поддержка", "Специальные форматы наборов"], start: "Заявка → программа курса → согласование → поставка", type: "education" },
  { number: "04", title: "Мастера и амбассадоры", forWhom: "Мастерам и авторам, которые умеют показывать продукт в реальной работе", benefits: ["Продуктовые интеграции", "Ранний доступ", "Совместный контент"], start: "Заявка → портфолио → знакомство → формат сотрудничества", type: "ambassador" },
];

const faq = [
  ["Есть ли минимальный объём?", "Условия зависят от формата партнёрства и географии. Оставьте ориентир в заявке — менеджер предложит подходящую матрицу."],
  ["Работаете ли вы с другими странами?", "География и возможность отгрузки уточняются индивидуально с учётом документов и логистики."],
  ["Можно ли получить продукты на тест?", "Тестирование обсуждается с преподавателями, студиями и авторами после знакомства с проектом."],
  ["Когда ждать ответ?", "В рабочем контуре команда отвечает после проверки заявки. SLA и каналы уведомлений настраиваются при подключении CRM."],
];

export default function CooperationPage() {
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return (
    <>
      <section className="coop-hero"><div className="shell"><p className="eyebrow light">EGO Beauty / partners</p><h1>Растём<br />вместе с<br /><em>EGO Beauty</em></h1><p>Партнёрство для магазинов, салонов, школ и тех, кто двигает nail-индустрию вперёд практикой, знаниями и контентом.</p><Link className="primary-button light-button" href="#application">Стать партнёром</Link></div></section>
      <section className="coop-benefits shell"><div><span>01</span><strong>Продуктовая экспертиза</strong><p>Помогаем собрать матрицу под ваш формат и аудиторию.</p></div><div><span>02</span><strong>Запуск без хаоса</strong><p>Последовательные этапы: знакомство, условия, подбор, поставка.</p></div><div><span>03</span><strong>Материалы бренда</strong><p>Контент и продуктовые акценты для витрины и обучения.</p></div></section>
      <section className="directions shell"><header><p className="eyebrow">Выберите направление</p><h2>Четыре способа быть в команде</h2></header>{directions.map((direction) => <article key={direction.number} id={direction.type}><span className="direction-number">{direction.number}</span><div><p className="eyebrow">Кому подходит</p><h3>{direction.title}</h3><p>{direction.forWhom}</p></div><ul>{direction.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><div className="direction-flow"><p className="eyebrow">Как начать</p><p>{direction.start}</p><Link href="#application">Стать партнёром →</Link></div></article>)}</section>
      <section className="geography"><div className="shell"><p className="eyebrow light">География</p><h2>Из России — в вашу рабочую палитру</h2><p>Собираем партнёрскую сеть бережно: проверяем логистику, документы и формат поддержки для каждого региона. Международные запросы рассматриваем отдельно.</p><div className="map-graphic" aria-hidden="true"><i /><i /><i /><i /><span>EGO</span></div></div></section>
      <section className="coop-steps shell"><div><p className="eyebrow">Подключение</p><h2>От заявки до первой поставки</h2></div><ol><li><span>01</span><strong>Заявка</strong><p>Расскажите о проекте и планируемом объёме.</p></li><li><span>02</span><strong>Знакомство</strong><p>Сверяем задачи, географию и формат.</p></li><li><span>03</span><strong>Условия</strong><p>Подбираем матрицу и коммерческий сценарий.</p></li><li><span>04</span><strong>Старт</strong><p>Готовим материалы и сопровождаем запуск.</p></li></ol></section>
      <section className="coop-application shell" id="application"><div><p className="eyebrow">Оставить заявку</p><h2>Расскажите<br />о вашем проекте</h2><p>Форма сохраняет заявку в защищённом хранилище и готова к отправке в CRM. Поля со звёздочкой обязательны.</p><div id="contacts"><a href="https://t.me/egobeauty_professional" target="_blank" rel="noreferrer">Telegram бренда ↗</a><span>Ответы по заявкам — после подключения рабочего канала</span></div></div><CooperationForm /></section>
      <section className="coop-faq shell" id="faq"><div><p className="eyebrow">FAQ</p><h2>Перед заявкой</h2></div><div>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
