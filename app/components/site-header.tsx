"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { catalogTree, products } from "@/lib/products";
import { useStore } from "./store-provider";

const wbBrandUrl = "https://www.wildberries.ru/brands/ego-beauty?sort=popular&page=1";
const ozonSearchUrl = "https://www.ozon.ru/search/?text=EGO%20Beauty";

export function SiteHeader() {
  const { cartCount, favorites } = useStore();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCatalogOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <div className="editorial-ticker" aria-label="Новинки EGO Beauty">
        <div><span>НОВИНКИ</span><i /> <span>ШЁЛКОВЫЕ КОШКИ</span><i /> <span>GLOW CAT</span><i /> <span>NEON CAT</span><i /> <span>ГЕЛЬ-ЛАК</span><i /></div>
      </div>
      <header className="site-header editorial-header" ref={headerRef}>
        <div className="editorial-header-grid shell">
          <nav className="editorial-nav editorial-nav-left" aria-label="Основная навигация">
            <button type="button" onClick={() => setCatalogOpen((value) => !value)} aria-expanded={catalogOpen} aria-controls="editorial-catalog">( каталог )</button>
            <Link href="/catalog?badge=Новинка">( новинки )</Link>
            <Link href="/fortune">( колесо фортуны )</Link>
            <Link href="/about">( о бренде )</Link>
            <Link href="/info">( информация )</Link>
          </nav>

          <Link className="editorial-logo" href="/" aria-label="EGO Beauty — главная">
            <span>EGO</span><small>BEAUTY</small>
          </Link>

          <nav className="editorial-nav editorial-nav-right" aria-label="Маркетплейсы и сервисы">
            <a href={wbBrandUrl} target="_blank" rel="noreferrer">( WB )</a>
            <a href={ozonSearchUrl} target="_blank" rel="noreferrer">( OZ )</a>
            <Link href="/search">( поиск )</Link>
            <Link href="/account?tab=favorites" aria-label={`Избранное: ${favorites.length}`}>( ♡ {favorites.length} )</Link>
            <Link href="/cart" aria-label={`Корзина: ${cartCount}`}>( сумка {cartCount} )</Link>
          </nav>

          <button className="editorial-menu-button" type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-menu">
            {mobileOpen ? "( закрыть )" : "( меню )"}
          </button>
        </div>

        {catalogOpen && (
          <div className="editorial-catalog-panel" id="editorial-catalog">
            <div className="editorial-catalog-grid shell">
              <div className="editorial-catalog-intro"><span>( каталог )</span><strong>{products.length} актуальных позиций</strong><Link href="/catalog" onClick={() => setCatalogOpen(false)}>смотреть всё →</Link></div>
              {catalogTree.map((section, index) => (
                <div className="editorial-catalog-column" key={section.name}>
                  <Link href={`/catalog?category=${encodeURIComponent(section.name)}`} onClick={() => setCatalogOpen(false)}><small>{String(index + 1).padStart(2, "0")}</small>{section.name}</Link>
                  {section.subcategories.map((subcategory) => <Link key={subcategory} href={`/catalog?category=${encodeURIComponent(section.name)}&subcategory=${encodeURIComponent(subcategory)}`} onClick={() => setCatalogOpen(false)}>{subcategory}</Link>)}
                </div>
              ))}
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="editorial-mobile-menu" id="mobile-menu">
            <nav className="shell">
              <Link href="/catalog" onClick={() => setMobileOpen(false)}>( каталог )</Link>
              <Link href="/catalog?badge=Новинка" onClick={() => setMobileOpen(false)}>( новинки )</Link>
              <Link href="/fortune" onClick={() => setMobileOpen(false)}>( колесо фортуны )</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)}>( о бренде )</Link>
              <Link href="/info" onClick={() => setMobileOpen(false)}>( информация )</Link>
              <Link href="/search" onClick={() => setMobileOpen(false)}>( поиск )</Link>
              <a href={wbBrandUrl} target="_blank" rel="noreferrer">( Wildberries )</a>
              <a href={ozonSearchUrl} target="_blank" rel="noreferrer">( Ozon )</a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function MobileNav() {
  const { cartCount, favorites } = useStore();
  return (
    <nav className="mobile-nav editorial-mobile-bar" aria-label="Мобильная навигация">
      <Link href="/">( главная )</Link>
      <Link href="/catalog">( каталог )</Link>
      <Link href="/account?tab=favorites">( ♡ {favorites.length} )</Link>
      <Link href="/cart">( сумка {cartCount} )</Link>
    </nav>
  );
}
