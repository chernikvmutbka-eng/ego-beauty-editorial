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
    <footer className="site-footer editorial-footer">
      <section className="editorial-newsletter shell">
        <div><span>( подарок за подписку )</span><h2>новинки<br />без лишнего шума</h2></div>
        <div>
          <p>Подпишитесь на EGO Letter и первыми узнавайте о коллекциях, рестоках и закрытых предложениях для мастеров.</p>
          {subscribed ? <strong role="status">готово — проверьте почту</strong> : <form onSubmit={subscribe}><label className="visually-hidden" htmlFor="subscribe-email">Email</label><input id="subscribe-email" type="email" required placeholder="example@email.com" /><button type="submit">( подписаться )</button></form>}
          <small>Нажимая кнопку, вы соглашаетесь с <Link href="/privacy">политикой обработки данных</Link>.</small>
        </div>
      </section>

      <div className="editorial-footer-grid shell">
        <div className="editorial-footer-brand"><strong>EGO</strong><span>BEAUTY</span><p>Профессиональные материалы для маникюра и педикюра.</p></div>
        <div><b>( навигация )</b><Link href="/catalog">каталог</Link><Link href="/about">о бренде</Link><Link href="/fortune">колесо фортуны</Link><Link href="/info">информация / FAQ</Link><Link href="/cooperation">сотрудничество</Link></div>
        <div><b>( купить )</b><a href="https://www.wildberries.ru/brands/ego-beauty?sort=popular&page=1" target="_blank" rel="noreferrer">Wildberries ↗</a><a href="https://www.ozon.ru/search/?text=EGO%20Beauty" target="_blank" rel="noreferrer">Ozon ↗</a><Link href="/catalog">на сайте EGO Beauty</Link></div>
        <div><b>( документы )</b><Link href="/privacy">политика конфиденциальности</Link><Link href="/terms">публичная оферта</Link><Link href="/info#delivery">доставка и оплата</Link><Link href="/info#returns">возврат</Link><Link href="/fortune#rules">правила акции</Link></div>
      </div>
      <div className="editorial-footer-bottom shell"><span>© 2026 EGO Beauty</span><a href="https://t.me/egobeauty_professional" target="_blank" rel="noreferrer">@egobeauty_professional ↗</a><span>данные товаров обновлены 04.08.2026</span></div>
    </footer>
  );
}
