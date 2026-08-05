"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { catalogTree, productCountLabel, products } from "@/lib/products";
import { ProductCard } from "./product-card";

const filterDefinitions = [
  { key: "category", label: "Категория", values: [...catalogTree.map((item) => item.name), "Наборы"] },
  { key: "subcategory", label: "Подкатегория", values: [...new Set([...catalogTree.flatMap((item) => item.subcategories), "Наборы коллекции"])] },
  { key: "collection", label: "Коллекция", values: ["Mousse", "Ice Cat", "Glow Cat"] },
  { key: "color", label: "Цветовая группа", values: ["Молочный", "Бежевый", "Розовый", "Фиолетовый", "Синий"] },
  { key: "effect", label: "Эффект", values: ["Плотный нюд", "Кошачий глаз", "Шелковая кошка"] },
  { key: "volume", label: "Объём", values: ["10 мл", "15 мл", "4 × 15 мл", "6 × 15 мл"] },
] as const;

export function CatalogClient({ mode = "catalog", initialQuery = "" }: { mode?: "catalog" | "search"; initialQuery?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sort, setSort] = useState(searchParams.get("sort") ?? "popular");
  const [grid, setGrid] = useState<"standard" | "compact">("standard");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(12);
  const query = mode === "search" ? initialQuery : (searchParams.get("q") ?? "");
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 0);
  const stockOnly = searchParams.get("stock") !== "all";

  const active = useMemo(() => Object.fromEntries(filterDefinitions.map((filter) => [filter.key, searchParams.get(filter.key) ?? ""])), [searchParams]);
  const badge = searchParams.get("badge") ?? "";

  const filtered = useMemo(() => {
    const needle = query.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();
    const result = products.filter((product) => {
      const searchable = `${product.name} ${product.shortName} ${product.id} ${product.collection} ${product.category} ${product.subcategory} ${product.shade} ${product.effect}`.toLocaleLowerCase("ru-RU").replace(/ё/g, "е");
      return (!needle || searchable.includes(needle))
        && (!active.category || product.category === active.category)
        && (!active.subcategory || product.subcategory === active.subcategory)
        && (!active.collection || product.collection === active.collection)
        && (!active.color || product.colorGroup === active.color)
        && (!active.effect || product.effect === active.effect)
        && (!active.volume || product.volume === active.volume)
        && (!minPrice || product.price >= minPrice)
        && (!maxPrice || product.price <= maxPrice)
        && (!stockOnly || product.stock > 0)
        && (!badge || product.badge === badge);
    });
    return result.sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : b.reviews - a.reviews);
  }, [query, active, badge, sort, minPrice, maxPrice, stockOnly]);

  useEffect(() => {
    track("view_item_list", { list: mode, query, count: filtered.length });
  }, [mode, query, filtered.length]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    setVisible(12);
    setLoading(true);
    track("filter_use", { key, value });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.setTimeout(() => setLoading(false), 260);
  }

  const chips = [
    ...filterDefinitions.map((filter) => ({ key: filter.key, value: active[filter.key], label: active[filter.key] })).filter((item) => item.value),
    ...(badge ? [{ key: "badge", value: badge, label: badge }] : []),
    ...(minPrice ? [{ key: "minPrice", value: String(minPrice), label: `от ${minPrice} ₽` }] : []),
    ...(maxPrice ? [{ key: "maxPrice", value: String(maxPrice), label: `до ${maxPrice} ₽` }] : []),
  ];

  return (
    <>
      <header className="catalog-heading">
        <p className="eyebrow">EGO Beauty / online store</p>
        <h1>{mode === "search" ? (query ? `Результаты: «${query}»` : "Поиск") : "Каталог"}</h1>
        <p>{mode === "search" ? "Ищем по названию, артикулу, номеру оттенка, коллекции и эффекту." : "Профессиональные материалы для укрепления, моделирования и дизайна ногтей. Актуальные цены и ассортимент — снимок витрины EGO Beauty на 04.08.2026."}</p>
      </header>

      {mode === "search" && (
        <form className="catalog-search" action="/search"><input name="q" defaultValue={query} placeholder="Mousse, 945458176, кошачий глаз…" aria-label="Поисковый запрос" /><button>Найти</button></form>
      )}

      <div className="catalog-toolbar">
        <div><button className="filter-open" type="button" onClick={() => setFiltersOpen(true)}>Фильтры <b>{chips.length || ""}</b></button><span>{productCountLabel(filtered.length)}</span></div>
        <div><label>Сортировка<select value={sort} onChange={(event) => { setSort(event.target.value); updateParam("sort", event.target.value); }}><option value="popular">По популярности</option><option value="rating">По рейтингу</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select></label><div className="grid-switch" aria-label="Вид каталога"><button className={grid === "standard" ? "active" : ""} onClick={() => setGrid("standard")} aria-label="Обычная сетка">▦</button><button className={grid === "compact" ? "active" : ""} onClick={() => setGrid("compact")} aria-label="Компактная сетка">▦▦</button></div></div>
      </div>

      {chips.length > 0 && <div className="active-filters">{chips.map((chip) => <button key={`${chip.key}-${chip.value}`} onClick={() => updateParam(chip.key, "")}>{chip.label}<span>×</span></button>)}<button className="clear-filters" onClick={() => router.replace(pathname)}>Сбросить всё</button></div>}

      <div className="catalog-layout">
        <aside className={`filter-drawer ${filtersOpen ? "open" : ""}`} aria-label="Фильтры каталога">
          <div className="filter-mobile-head"><strong>Фильтры</strong><button onClick={() => setFiltersOpen(false)} aria-label="Закрыть фильтры">×</button></div>
          {filterDefinitions.map((filter) => (
            <details key={filter.key} open>
              <summary>{filter.label}</summary>
              <div className="filter-values">{filter.values.map((value) => <label key={value}><input type="radio" name={filter.key} checked={active[filter.key] === value} onChange={() => updateParam(filter.key, active[filter.key] === value ? "" : value)} /><span>{value}</span><small>{products.filter((product) => filter.key === "category" ? product.category === value : filter.key === "subcategory" ? product.subcategory === value : filter.key === "collection" ? product.collection === value : filter.key === "color" ? product.colorGroup === value : filter.key === "effect" ? product.effect === value : product.volume === value).length}</small></label>)}</div>
            </details>
          ))}
          <details open><summary>Цена</summary><div className="price-filter"><input key={`min-${minPrice}`} inputMode="numeric" defaultValue={minPrice || ""} placeholder="от 500" aria-label="Минимальная цена" onBlur={(event) => updateParam("minPrice", event.target.value.replace(/\D/g, ""))} /><input key={`max-${maxPrice}`} inputMode="numeric" defaultValue={maxPrice || ""} placeholder="до 1 742" aria-label="Максимальная цена" onBlur={(event) => updateParam("maxPrice", event.target.value.replace(/\D/g, ""))} /></div></details>
          <div className="toggle-filters"><label><span>Только в наличии</span><input type="checkbox" checked={stockOnly} onChange={(event) => updateParam("stock", event.target.checked ? "" : "all")} /></label><label><span>Со скидкой</span><input type="checkbox" checked={badge === "Sale"} onChange={(event) => updateParam("badge", event.target.checked ? "Sale" : "")} /></label></div>
          <button className="filter-apply primary-button" onClick={() => setFiltersOpen(false)}>Показать {filtered.length}</button>
        </aside>
        <section className="catalog-results" aria-busy={loading}>
          {loading ? <div className={`catalog-grid ${grid}`}>{Array.from({ length: 8 }).map((_, index) => <div className="product-skeleton" key={index}><div /><span /><span /></div>)}</div> : filtered.length ? <><div className={`catalog-grid ${grid}`}>{filtered.slice(0, visible).map((product) => <ProductCard key={product.id} product={product} />)}</div>{visible < filtered.length && <button className="load-more" onClick={() => setVisible((count) => count + 8)}>Показать ещё <span>{filtered.length - visible}</span></button>}</> : <div className="catalog-empty"><strong>По этим параметрам пока ничего нет</strong><p>Сбросьте один из фильтров или откройте всю палитру.</p><button className="primary-button" onClick={() => router.replace(pathname)}>Сбросить фильтры</button></div>}
        </section>
      </div>
    </>
  );
}
