"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="figma-footer shell">
      <section className="figma-newsletter">
        <div className="figma-footer-logo"><strong>eGo</strong><span>beauty</span></div>
        <div className="figma-newsletter-copy"><h2>БУДЬ В КУРСЕ НОВОСТЕЙ</h2><p>Новинки, закрытые предложения и полезные материалы для мастеров — без лишнего шума.</p></div>
        {subscribed ? (
          <strong className="figma-subscribed" role="status">Готово — проверьте почту</strong>
        ) : (
          <form onSubmit={subscribe}>
            <label className="visually-hidden" htmlFor="footer-email">Электронная почта</label>
            <input id="footer-email" type="email" required placeholder="Ваш e-mail" />
            <button type="submit">Подписаться</button>
          </form>
        )}
      </section>

      <div className="figma-footer-nav">
        <div>
          <b>Каталог</b>
          <Link href="/catalog?category=Гели%20для%20моделирования%20ногтей">Гели для моделирования</Link>
          <Link href="/catalog?category=Гель-лак">Гель-лаки</Link>
          <Link href="/catalog?category=Топы">Топы</Link>
          <Link href="/catalog">Все категории</Link>
        </div>
        <div>
          <b>О компании</b>
          <Link href="/about">О бренде</Link>
          <Link href="/catalog?badge=Новинка">Новости</Link>
          <Link href="/cooperation">Сотрудничество</Link>
        </div>
        <div>
          <b>Клиентам</b>
          <Link href="/info#delivery">Оплата и доставка</Link>
          <Link href="/info#returns">Обмен и возврат</Link>
          <Link href="/account">Личный кабинет</Link>
          <Link href="/info">Задать вопрос</Link>
        </div>
        <div>
          <b>Как связаться</b>
          <a href="https://t.me/egobeauty_professional" target="_blank" rel="noreferrer">Написать в Telegram ↗</a>
          <Link href="/cooperation">Оптовым клиентам</Link>
          <div className="figma-socials" aria-label="Социальные сети"><span>VK</span><span>TG</span><span>PI</span><span>YT</span></div>
        </div>
      </div>

      <div className="figma-footer-bottom">
        <span>© 2026 EGO Beauty</span>
        <Link href="/privacy">Политика конфиденциальности</Link>
        <Link href="/terms">Публичная оферта</Link>
      </div>
    </footer>
  );
}
