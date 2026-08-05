"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { products } from "@/lib/products";
import { useStore } from "./store-provider";

const tabs = ["profile", "orders", "favorites", "promos", "wheel", "subscriptions"] as const;
const labels: Record<(typeof tabs)[number], string> = { profile: "Профиль", orders: "Заказы", favorites: "Избранное", promos: "Промокоды", wheel: "Колесо", subscriptions: "Подписки" };

export function AccountClient({ user }: { user: { displayName: string; email: string } | null }) {
  const searchParams = useSearchParams(); const { favorites, toggleFavorite, addToCart } = useStore(); const requested = searchParams.get("tab"); const tab = tabs.includes(requested as (typeof tabs)[number]) ? requested as (typeof tabs)[number] : "profile";
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  const [wheel, setWheel] = useState<{ code?: string; label?: string; expiresAt?: number } | null>(null);
  useEffect(() => { queueMicrotask(() => { try { setWheel(JSON.parse(localStorage.getItem("ego-wheel-prize") ?? "null")); } catch { setWheel(null); } }); }, []);
  return <div className="account-page shell"><header className="account-header"><p className="eyebrow">EGO Account</p><h1>{user ? `Привет, ${user.displayName.split(" ")[0]}` : "Ваш кабинет"}</h1><p>{user ? user.email : "Войдите, чтобы синхронизировать заказы, адреса и результаты колеса между устройствами."}</p>{user ? <a href="/signout-with-chatgpt?return_to=/">Выйти</a> : <a className="primary-button" href="/signin-with-chatgpt?return_to=/account">Войти безопасно</a>}</header><nav className="account-tabs" aria-label="Разделы кабинета">{tabs.map((item) => <Link key={item} className={tab === item ? "active" : ""} href={`/account?tab=${item}`}>{labels[item]}{item === "favorites" && <b>{favorites.length}</b>}</Link>)}</nav><section className="account-content">
    {tab === "profile" && <div className="account-panel profile-panel"><div><p className="eyebrow">Контактные данные</p><h2>{user ? user.displayName : "Гостевой режим"}</h2><p>{user?.email ?? "Профиль станет доступен после входа."}</p><button disabled={!user}>Редактировать профиль</button></div><div><p className="eyebrow">Адреса</p><strong>Сохранённых адресов пока нет</strong><p>Добавьте адрес при первом оформлении заказа.</p><button disabled={!user}>Добавить адрес</button></div></div>}
    {tab === "orders" && <EmptyAccount title="История заказов" text={user ? "Новые заказы появятся здесь после оформления." : "Войдите, чтобы видеть историю и статусы заказов."} action="Перейти в каталог" href="/catalog" />}
    {tab === "favorites" && (favoriteProducts.length ? <div className="favorite-list">{favoriteProducts.map((product) => <article key={product.id}><Link href={`/product/${product.slug}`}><Image src={product.image} alt={product.name} width={140} height={180} /></Link><div><p>{product.collection}</p><h3>{product.shortName}</h3><span>{product.price} ₽</span><button onClick={() => addToCart(product.id)}>В корзину</button><button onClick={() => toggleFavorite(product.id)}>Удалить</button></div></article>)}</div> : <EmptyAccount title="Избранное пусто" text="Сохраняйте рабочие оттенки, чтобы быстро вернуться к ним." action="Открыть каталог" href="/catalog" />)}
    {tab === "promos" && <div className="promo-wallet"><div><span>EGO10</span><strong>−10% на первый заказ</strong><small>Действует в демо-корзине</small></div>{wheel?.code && <div><span>{wheel.code}</span><strong>{wheel.label}</strong><small>{wheel.expiresAt ? `до ${new Date(wheel.expiresAt).toLocaleDateString("ru-RU")}` : ""}</small></div>}</div>}
    {tab === "wheel" && (wheel?.code ? <div className="wheel-account"><p className="eyebrow">Последний результат</p><h2>{wheel.label}</h2><strong>{wheel.code}</strong><Link className="primary-button" href="/cart">Применить в корзине</Link></div> : <EmptyAccount title="Колесо ждёт" text="Испытайте удачу — результат сохранится здесь." action="Крутить колесо" href="/fortune" />)}
    {tab === "subscriptions" && <div className="subscription-panel"><h2>Управление подписками</h2><label><span><strong>Новинки и рестоки</strong><small>Email один-два раза в месяц</small></span><input type="checkbox" defaultChecked /></label><label><span><strong>Персональные предложения</strong><small>Скидки на сохранённые коллекции</small></span><input type="checkbox" /></label><button className="primary-button">Сохранить настройки</button></div>}
  </section></div>;
}

function EmptyAccount({ title, text, action, href }: { title: string; text: string; action: string; href: string }) { return <div className="account-empty"><h2>{title}</h2><p>{text}</p><Link className="primary-button" href={href}>{action}</Link></div>; }
