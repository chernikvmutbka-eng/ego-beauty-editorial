import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Информация и FAQ",
  description: "Ответы о заказах, доставке, оплате, возврате и сотрудничестве с EGO Beauty.",
};

const faq = [
  ["Как выбрать материал?", "Используйте категории и фильтры в каталоге или напишите команде EGO Beauty в Telegram — подскажем по назначению, текстуре и эффекту."],
  ["Цены на маркетплейсах совпадают с сайтом?", "Не всегда. На карточке товара показана дата сверки, а после перехода маркетплейс может применить персональную скидку. Неподтверждённую цену мы не показываем как актуальную."],
  ["Где посмотреть состав?", "Актуальный INCI и срок годности указаны на упаковке. Электронные документы будут добавлены в карточки после сверки с производством."],
  ["Можно заказать оптом?", "Да. Заполните форму сотрудничества — команда свяжется с вами и предложит условия под тип бизнеса и объём."],
];

export default function InfoPage() {
  return (
    <main className="info-page shell">
      <header className="info-hero"><span>( информация )</span><h1>всё, что важно<br />до и после заказа</h1><p>Короткие ответы без мелкого шрифта. Перед боевым запуском способы оплаты, тарифы и юридические условия необходимо подтвердить у команды бренда.</p></header>
      <nav className="info-index" aria-label="Разделы информации"><a href="#faq">FAQ</a><a href="#delivery">доставка</a><a href="#payment">оплата</a><a href="#returns">возврат</a><a href="#cooperation">сотрудничество</a><a href="#contacts">контакты</a></nav>
      <section className="info-section" id="faq"><div><span>01</span><h2>FAQ</h2></div><div className="info-faq">{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
      <section className="info-section" id="delivery"><div><span>02</span><h2>доставка</h2></div><div><p>Расчёт срока и стоимости появится после выбора города и способа получения. До подключения боевых тарифов CDEK данные в корзине являются предварительными.</p><p>Заказы через Wildberries и Ozon доставляются по правилам выбранного маркетплейса.</p></div></section>
      <section className="info-section" id="payment"><div><span>03</span><h2>оплата</h2></div><div><p>Интернет-эквайринг подключается перед началом реальных продаж. Сайт не запрашивает и не хранит данные банковской карты самостоятельно.</p><p>На маркетплейсах оплата проходит на стороне Wildberries или Ozon.</p></div></section>
      <section className="info-section" id="returns"><div><span>04</span><h2>возврат</h2></div><div><p>Условия возврата зависят от категории товара, сохранности упаковки и места покупки. Для заказа с сайта напишите номер заказа и приложите фотографии — команда проверит обращение.</p><p>Для покупки на маркетплейсе оформляйте обращение в личном кабинете площадки.</p></div></section>
      <section className="info-section" id="cooperation"><div><span>05</span><h2>сотрудничество</h2></div><div><p>Работаем с магазинами, студиями, школами, преподавателями и амбассадорами.</p><Link className="editorial-inline-button" href="/cooperation">( оставить заявку )</Link></div></section>
      <section className="info-section" id="contacts"><div><span>06</span><h2>контакты</h2></div><div><a href="https://t.me/egobeauty_professional" target="_blank" rel="noreferrer">Telegram: @egobeauty_professional ↗</a><p>Реквизиты, рабочие часы и адрес производства добавляются после подтверждения брендом.</p></div></section>
    </main>
  );
}
