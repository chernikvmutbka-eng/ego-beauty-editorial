"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { formatPrice, Product, products, reviewCountLabel } from "@/lib/products";
import { useStore } from "./store-provider";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState<string | null>(null);
  const variants = products.filter((item) => item.collection === product.collection && item.category === product.category).slice(0, 10);
  const favorite = favorites.includes(product.id);

  useEffect(() => { track("view_item", { product_id: product.id, name: product.shortName }); }, [product.id, product.shortName]);
  useEffect(() => { if (!zoom) return; const handler = (event: KeyboardEvent) => event.key === "Escape" && setZoom(null); window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [zoom]);

  function buyNow() { addToCart(product.id, quantity); window.location.href = "/checkout"; }

  return (
    <>
      <div className="product-hero">
        <div className="product-gallery">
          {[product.image, `/products/${product.id}-2.webp`, `/products/${product.id}-3.webp`].map((src, index) => <button key={src} className={`gallery-item gallery-${index + 1}`} onClick={() => setZoom(src)} aria-label={`Увеличить фото ${index + 1}`}><Image src={src} alt={`${product.name}, фото ${index + 1}`} fill sizes="(max-width: 800px) 100vw, 45vw" /></button>)}
        </div>
        <div className="buy-panel">
          <div><span className="product-badge">{product.badge}</span><p className="eyebrow">{product.collection} · арт. {product.id}</p></div>
          <h1>{product.shortName}</h1>
          <div className="detail-rating"><a href="#feedback">★ {product.rating || "—"} · {product.reviews ? reviewCountLabel(product.reviews) : "без отзывов"}</a><span>В наличии</span></div>
          <p className="detail-description">{product.description}</p>
          {variants.length > 1 && <div className="variant-picker"><div><strong>Оттенок</strong><span>{product.shade}</span></div><div className="variant-swatches">{variants.map((variant, index) => <Link key={variant.id} className={variant.id === product.id ? "active" : ""} style={{ background: ["#f5f1e8", "#b98276", "#c58b79", "#ce8e9b", "#e7b8b3", "#a46d61", "#d8ced4", "#f2dad9", "#b1a1c9", "#d4c6bc"][index % 10] }} href={`/product/${variant.slug}`} aria-label={`${variant.shortName}, оттенок ${variant.shade}`} />)}</div></div>}
          <div className="detail-price"><div className="price-row large"><strong>{formatPrice(product.price)}</strong><s>{formatPrice(product.oldPrice)}</s><span>−{Math.round((1 - product.price / product.oldPrice) * 100)}%</span></div><small>Цена и наличие зафиксированы 04.08.2026</small></div>
          <section className="detail-marketplaces" aria-labelledby="where-to-buy">
            <div><h2 id="where-to-buy">Где выгоднее купить</h2><small>цены сверены {product.marketplaceUpdatedAt}</small></div>
            <div className="marketplace-compare-row best"><span>Сайт EGO Beauty<small>официальная корзина</small></span><strong>{formatPrice(product.price)}</strong></div>
            <a className="marketplace-compare-row" href={product.wbUrl} target="_blank" rel="noreferrer"><span>Wildberries<small>открыть карточку ↗</small></span><strong>{formatPrice(product.wbPrice)}</strong></a>
            {product.ozonUrl && product.ozonPrice ? <a className="marketplace-compare-row" href={product.ozonUrl} target="_blank" rel="noreferrer"><span>Ozon<small>открыть карточку ↗</small></span><strong>{formatPrice(product.ozonPrice)}</strong></a> : <a className="marketplace-compare-row unverified" href={`https://www.ozon.ru/search/?text=${encodeURIComponent(`EGO Beauty ${product.shortName}`)}`} target="_blank" rel="noreferrer"><span>Ozon<small>найти товар ↗</small></span><strong>проверить цену</strong></a>}
            <p>Цена на маркетплейсе может измениться после перехода из-за персональной скидки.</p>
          </section>
          <div className="purchase-row"><div className="quantity-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Уменьшить количество">−</button><span>{quantity}</span><button onClick={() => setQuantity((value) => Math.min(20, value + 1))} aria-label="Увеличить количество">+</button></div><button className="primary-button" onClick={() => addToCart(product.id, quantity)}>Добавить в корзину</button><button className={`detail-favorite ${favorite ? "active" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Удалить из избранного" : "Добавить в избранное"}>{favorite ? "♥" : "♡"}</button></div>
          <button className="buy-now" onClick={buyNow}>Купить сейчас</button>
          <div className="delivery-cards"><div><b>Доставка</b><span>Расчёт после выбора города</span></div><div><b>Оплата</b><span>Картой после подключения ЮKassa</span></div><div><b>Для профи</b><span>Оптовые условия по заявке</span></div></div>
        </div>
      </div>
      <div className="mobile-buy-bar"><div><strong>{formatPrice(product.price)}</strong><small>{product.volume}</small></div><button onClick={() => addToCart(product.id)}>В корзину</button></div>
      {zoom && <div className="zoom-overlay" role="dialog" aria-modal="true" aria-label="Увеличенное фото" onClick={() => setZoom(null)}><button aria-label="Закрыть">×</button><Image src={zoom} alt={product.name} fill sizes="100vw" /></div>}
    </>
  );
}
