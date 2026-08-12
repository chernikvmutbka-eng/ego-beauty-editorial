"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogTree } from "@/lib/products";
import { useStore } from "./store-provider";

export function SiteHeader() {
  const { cartCount, favorites } = useStore();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Гель-лак");
  const activeSection = catalogTree.find((section) => section.name === activeCategory) ?? catalogTree[0];

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCatalogOpen(false);
        setMobileOpen(false);
        setMobileCatalogOpen(false);
        setMobileCategoryOpen(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const closeMenus = () => {
    setCatalogOpen(false);
    setMobileOpen(false);
    setMobileCatalogOpen(false);
    setMobileCategoryOpen(null);
  };

  return (
    <header className="figma-site-header">
      <div className="figma-header-shell shell">
        <div className="figma-header-bar">
          <nav className="figma-header-left" aria-label="Основная навигация">
            <button className="figma-hamburger" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Открыть меню" aria-expanded={mobileOpen}>
              <i /><i />
            </button>
            <button className="figma-header-link" type="button" onClick={() => setCatalogOpen((value) => !value)} aria-expanded={catalogOpen} aria-controls="figma-catalog-menu">Каталог</button>
            <Link href="/catalog?badge=Новинка">Новинки</Link>
            <Link href="/about">О бренде</Link>
          </nav>

          <Link className="figma-logo" href="/" aria-label="EGO Beauty — главная">
            <strong>eGo</strong><span>beauty</span>
          </Link>

          <nav className="figma-header-right" aria-label="Сервисы">
            <Link href="/fortune">Колесо фортуны</Link>
            <Link className="figma-icon-link search-mark" href="/search" aria-label="Поиск" />
            <Link className="figma-icon-link heart-mark" href="/account?tab=favorites" aria-label={`Избранное: ${favorites.length}`}><span>{favorites.length || ""}</span></Link>
            <Link className="figma-icon-link bag-mark" href="/cart" aria-label={`Корзина: ${cartCount}`}><span>{cartCount}</span></Link>
          </nav>
        </div>

        {catalogOpen && (
          <div className="figma-mega-menu" id="figma-catalog-menu">
            <div className="figma-mega-categories">
              {catalogTree.map((section) => (
                <button className={section.name === activeSection.name ? "active" : ""} type="button" key={section.name} onMouseEnter={() => setActiveCategory(section.name)} onFocus={() => setActiveCategory(section.name)} onClick={() => setActiveCategory(section.name)}>
                  <span>{section.name}</span><i>→</i>
                </button>
              ))}
            </div>
            <div className="figma-mega-subcategories">
              <p>{activeSection.name}</p>
              <Link className="figma-mega-all" href={`/catalog?category=${encodeURIComponent(activeSection.name)}`} onClick={closeMenus}>Смотреть всё <span>→</span></Link>
              {activeSection.subcategories.map((subcategory) => (
                <Link key={subcategory} href={`/catalog?category=${encodeURIComponent(activeSection.name)}&subcategory=${encodeURIComponent(subcategory)}`} onClick={closeMenus}>{subcategory}<span>→</span></Link>
              ))}
            </div>
          </div>
        )}

        {mobileOpen && (
          <nav className="figma-mobile-menu" aria-label="Мобильное меню">
            <button
              className="figma-mobile-catalog-trigger"
              type="button"
              onClick={() => setMobileCatalogOpen((value) => !value)}
              aria-expanded={mobileCatalogOpen}
              aria-controls="figma-mobile-catalog"
            >
              <span>Каталог</span><i aria-hidden="true">⌄</i>
            </button>
            {mobileCatalogOpen && (
              <div className="figma-mobile-catalog" id="figma-mobile-catalog">
                <Link className="figma-mobile-all" href="/catalog" onClick={closeMenus}>Все товары <span>→</span></Link>
                {catalogTree.map((section) => {
                  const sectionOpen = mobileCategoryOpen === section.name;
                  return (
                    <div className="figma-mobile-category" key={section.name}>
                      <button
                        type="button"
                        onClick={() => setMobileCategoryOpen(sectionOpen ? null : section.name)}
                        aria-expanded={sectionOpen}
                      >
                        <span>{section.name}</span><i aria-hidden="true">{sectionOpen ? "−" : "+"}</i>
                      </button>
                      {sectionOpen && (
                        <div className="figma-mobile-subcategories">
                          <Link href={`/catalog?category=${encodeURIComponent(section.name)}`} onClick={closeMenus}>Смотреть всё</Link>
                          {section.subcategories.map((subcategory) => (
                            <Link key={subcategory} href={`/catalog?category=${encodeURIComponent(section.name)}&subcategory=${encodeURIComponent(subcategory)}`} onClick={closeMenus}>{subcategory}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <Link href="/catalog?badge=Новинка" onClick={closeMenus}>Новинки</Link>
            <Link href="/about" onClick={closeMenus}>О бренде</Link>
            <Link href="/fortune" onClick={closeMenus}>Колесо фортуны</Link>
            <Link href="/search" onClick={closeMenus}>Поиск</Link>
            <Link href="/info" onClick={closeMenus}>Информация</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export function MobileNav() {
  const { cartCount, favorites } = useStore();
  return (
    <nav className="figma-mobile-bar" aria-label="Быстрая навигация">
      <Link href="/">Главная</Link>
      <Link href="/catalog">Каталог</Link>
      <Link href="/account?tab=favorites">♡ {favorites.length}</Link>
      <Link href="/cart">Корзина {cartCount}</Link>
    </nav>
  );
}
