"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { formatPrice, Product, reviewCountLabel } from "@/lib/products";
import { useStore } from "./store-provider";

const swatches: Record<string, string[]> = {
  "Молочный": ["#ecece7", "#f2dfe0", "#f5e9df"],
  "Бежевый": ["#d9c4b4", "#edd6c6", "#bfa796"],
  "Розовый": ["#d8aab8", "#f1c6cd", "#bd8194"],
  "Коричневый": ["#7f594e", "#ac8073", "#d0aaa0"],
  "Сиреневый": ["#aa91bf", "#d4c1df", "#77658e"],
  "Фиолетовый": ["#745177", "#9d759e", "#c1a1c5"],
  "Синий": ["#58718e", "#8da4bb", "#30465e"],
  "Мульти": ["#a58aa7", "#b7c6d7", "#dab4bf"],
  "Нюд": ["#d8b8ad", "#ead5cc", "#b99689"],
};

function productSwatches(product: Product) {
  return swatches[product.colorGroup] ?? ["#d7c4bf", "#b8a2ab", "#eee4df"];
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [quickOpen, setQuickOpen] = useState(false);
  const favorite = favorites.includes(product.id);
  const colors = productSwatches(product);
  const tipStyle = { "--tip-a": colors[0], "--tip-b": colors[1], "--tip-c": colors[2] } as CSSProperties;

  useEffect(() => {
    if (!quickOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setQuickOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickOpen]);

  return (
    <article className="product-card figma-product-card">
      <div className="figma-product-visual" style={tipStyle}>
        <div className="figma-product-topline">
          <span>{product.collection}</span>
          <div aria-label={`Палитра ${product.colorGroup}`}>{colors.map((color) => <i key={color} style={{ background: color }} />)}</div>
        </div>
        <Link className="figma-tip-link" href={`/product/${product.slug}`} aria-label={`Открыть ${product.shortName}`}>
          <span className="figma-nail-tip" aria-hidden="true" />
          <Image className="figma-product-pack" src={product.image} alt="" width={110} height={110} sizes="110px" />
        </Link>
        <span className={`product-badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
        <button className={`favorite-button figma-favorite ${favorite ? "active" : ""}`} type="button" onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Удалить из избранного" : "Добавить в избранное"}>{favorite ? "♥" : "♡"}</button>
        <button className="quick-button" type="button" onClick={() => setQuickOpen(true)}>Быстрый просмотр</button>
      </div>

      <div className="product-info figma-product-info">
        <div className="product-meta"><span>{product.collection} · оттенок {product.shade}</span><span>{product.volume}</span></div>
        <Link href={`/product/${product.slug}`}><h3>{product.shortName}</h3></Link>
        <div className="rating-row"><span>★ {product.rating || "—"}</span><span>{product.reviews ? reviewCountLabel(product.reviews) : "Новинка без отзывов"}</span></div>
        <div className="price-row"><strong>{formatPrice(product.price)}</strong><s>{formatPrice(product.oldPrice)}</s><span>−{Math.round((1 - product.price / product.oldPrice) * 100)}%</span></div>
        <p className="figma-compare-label">Сравнить цену</p>
        <div className="card-marketplaces" aria-label="Сравнить цены">
          <button className="card-cart-button best-price" type="button" onClick={() => addToCart(product.id)}><span>На нашем сайте</span><strong>{formatPrice(product.price)}</strong></button>
          <a href={product.wbUrl} target="_blank" rel="noreferrer"><span>Wildberries ↗</span><strong>{formatPrice(product.wbPrice)}</strong></a>
          {product.ozonUrl && product.ozonPrice ? <a href={product.ozonUrl} target="_blank" rel="noreferrer"><span>Ozon ↗</span><strong>{formatPrice(product.ozonPrice)}</strong></a> : <a className="marketplace-unverified" href={`https://www.ozon.ru/search/?text=${encodeURIComponent(`EGO Beauty ${product.shortName}`)}`} target="_blank" rel="noreferrer"><span>Ozon ↗</span><small>проверить цену</small></a>}
        </div>
        <small className="marketplace-date">цены сверены {product.marketplaceUpdatedAt}</small>
      </div>

      {quickOpen && (
        <div className="quick-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setQuickOpen(false)}>
          <div className="quick-modal" role="dialog" aria-modal="true" aria-labelledby={`quick-${product.id}`}>
            <button className="modal-close" onClick={() => setQuickOpen(false)} aria-label="Закрыть">×</button>
            <div className="quick-image"><Image src={product.image} alt={product.name} fill sizes="440px" /></div>
            <div className="quick-content"><p className="eyebrow">{product.collection} · арт. {product.id}</p><h2 id={`quick-${product.id}`}>{product.shortName}</h2><div className="quick-rating">★ {product.rating || "—"} · {reviewCountLabel(product.reviews)}</div><p>{product.description}</p><div className="price-row large"><strong>{formatPrice(product.price)}</strong><s>{formatPrice(product.oldPrice)}</s></div><div className="stock-line"><i /> В наличии · отгрузка завтра</div><button className="primary-button" onClick={() => { addToCart(product.id); setQuickOpen(false); }}>Добавить в корзину</button><a className="text-link" href={product.wbUrl} target="_blank" rel="noreferrer">Купить на Wildberries за {formatPrice(product.wbPrice)} ↗</a><Link className="text-link" href={`/product/${product.slug}`}>Все характеристики →</Link></div>
          </div>
        </div>
      )}
    </article>
  );
}

export function ProductRail({ title, kicker, items, href = "/catalog" }: { title: string; kicker: string; items: Product[]; href?: string }) {
  return (
    <section className="product-section shell">
      <div className="section-head"><div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div><Link href={href}>Смотреть все →</Link></div>
      <div className="product-rail">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>
  );
}
