"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { formatPrice, products } from "@/lib/products";
import { useStore } from "./store-provider";
import { ProductRail } from "./product-card";

export function CartClient() {
  const { cart, favorites, promo, applyPromo, removeFromCart, setQuantity, toggleFavorite } = useStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const lines = useMemo(() => products.filter((product) => cart[product.id]).map((product) => ({ product, quantity: cart[product.id] })), [cart]);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const discount = promo ? Math.round(subtotal * promo.discount / 100) : 0;
  const deliveryThreshold = 3000;
  const delivery = subtotal >= deliveryThreshold ? 0 : 390;
  const total = Math.max(0, subtotal - discount + delivery);
  const remaining = Math.max(0, deliveryThreshold - subtotal);

  function submitPromo(event: FormEvent) {
    event.preventDefault();
    const stored = (() => { try { return JSON.parse(localStorage.getItem("ego-wheel-prize") ?? "null") as { code?: string; discount?: number } | null; } catch { return null; } })();
    const ok = applyPromo(promoInput, stored?.code?.toUpperCase() === promoInput.trim().toUpperCase() ? stored.discount : undefined);
    setPromoMessage(ok ? "Промокод применён" : "Проверьте код. Для демо можно использовать EGO10.");
  }

  return (
    <div className="cart-page shell">
      <header className="page-title"><p className="eyebrow">Ваш заказ</p><h1>Корзина <span>{lines.length}</span></h1></header>
      {!lines.length ? <div className="cart-empty"><strong>Здесь пока пусто</strong><p>Добавьте рабочие оттенки в корзину — мы сохраним выбор на этом устройстве.</p><Link className="primary-button" href="/catalog">Перейти в каталог</Link></div> : (
        <>
          <div className="delivery-progress"><div><span>Бесплатная доставка</span><strong>{remaining ? `Добавьте ещё ${formatPrice(remaining)}` : "Доставка уже бесплатная"}</strong></div><div className="progress-track"><i style={{ width: `${Math.min(100, subtotal / deliveryThreshold * 100)}%` }} /></div></div>
          <div className="cart-layout">
            <section className="cart-lines">
              {lines.map(({ product, quantity }) => (
                <article className="cart-line" key={product.id}>
                  <Link className="cart-image" href={`/product/${product.slug}`}><Image src={product.image} alt={product.name} fill sizes="160px" /></Link>
                  <div className="cart-description"><p>{product.collection} · {product.shade}</p><Link href={`/product/${product.slug}`}><h2>{product.shortName}</h2></Link><span>{product.volume} · арт. {product.id}</span><div className="cart-line-actions"><button onClick={() => { if (!favorites.includes(product.id)) toggleFavorite(product.id); removeFromCart(product.id); }}>В избранное</button><button onClick={() => removeFromCart(product.id)}>Удалить</button></div></div>
                  <div className="cart-line-price"><strong>{formatPrice(product.price * quantity)}</strong><s>{formatPrice(product.oldPrice * quantity)}</s><div className="quantity-control"><button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Уменьшить">−</button><span>{quantity}</span><button onClick={() => setQuantity(product.id, quantity + 1)} aria-label="Увеличить">+</button></div></div>
                </article>
              ))}
            </section>
            <aside className="order-summary">
              <h2>Итого</h2>
              <dl><div><dt>Товары</dt><dd>{formatPrice(subtotal)}</dd></div>{promo && <div className="discount"><dt>Скидка {promo.discount}%</dt><dd>−{formatPrice(discount)}</dd></div>}<div><dt>Доставка</dt><dd>{delivery ? formatPrice(delivery) : "Бесплатно"}</dd></div><div className="total"><dt>К оплате</dt><dd>{formatPrice(total)}</dd></div></dl>
              <form className="promo-form" onSubmit={submitPromo}><label htmlFor="promo">Промокод</label><div><input id="promo" value={promoInput} onChange={(event) => setPromoInput(event.target.value)} placeholder="EGO10" /><button>Применить</button></div>{promoMessage && <p role="status">{promoMessage}</p>}</form>
              <Link className="primary-button checkout-button" href="/checkout">Перейти к оформлению</Link>
              <p className="summary-note">Оплата не списывается в демо-версии. Платёжный провайдер подключается перед запуском продаж.</p>
            </aside>
          </div>
        </>
      )}
      <ProductRail title="Дополнить заказ" kicker="С этим выбирают" items={products.filter((product) => !cart[product.id]).slice(8, 13)} />
    </div>
  );
}
