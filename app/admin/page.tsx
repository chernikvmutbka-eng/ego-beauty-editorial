import type { Metadata } from "next";
import { ensureCommerceSchema, getD1 } from "@/db";
import { products } from "@/lib/products";
import { requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Управление магазином", robots: { index: false, follow: false } };

type OrderRow = { id: string; status: string; total: number; created_at: number };
type PartnerRow = { id: string; name: string; partnership_type: string; status: string; created_at: number };
type SpinRow = { promo_code: string; prize_label: string; created_at: number };

async function AdminDashboard() {
  const user = await requireChatGPTUser("/admin");
  await ensureCommerceSchema(); const db = getD1();
  const [ordersResult, partnersResult, spinsResult] = await db.batch([
    db.prepare("SELECT id, status, total, created_at FROM orders ORDER BY created_at DESC LIMIT 8"),
    db.prepare("SELECT id, name, partnership_type, status, created_at FROM partner_applications ORDER BY created_at DESC LIMIT 8"),
    db.prepare("SELECT promo_code, prize_label, created_at FROM wheel_spins ORDER BY created_at DESC LIMIT 8"),
  ]);
  const orders = ordersResult.results as unknown as OrderRow[]; const partners = partnersResult.results as unknown as PartnerRow[]; const spins = spinsResult.results as unknown as SpinRow[];
  return <div className="admin-page shell"><header className="admin-header"><div><p className="eyebrow">Protected workspace</p><h1>EGO Control</h1></div><div><span>{user.email}</span><a href="/signout-with-chatgpt?return_to=/">Выйти</a></div></header><section className="admin-metrics"><div><span>Товары</span><strong>{products.length}</strong><small>реальных позиций в витрине</small></div><div><span>Заказы</span><strong>{orders.length}</strong><small>последние записи</small></div><div><span>Заявки</span><strong>{partners.length}</strong><small>последние записи</small></div><div><span>Прокрутки</span><strong>{spins.length}</strong><small>последние записи</small></div></section><section className="admin-grid"><AdminTable title="Последние заказы" columns={["Номер", "Статус", "Сумма"]} rows={orders.map((order) => [order.id, order.status, `${order.total} ₽`])} /><AdminTable title="Заявки на сотрудничество" columns={["Номер", "Контакт", "Тип"]} rows={partners.map((partner) => [partner.id, partner.name, partner.partnership_type])} /><AdminTable title="История колеса" columns={["Промокод", "Приз", "Дата"]} rows={spins.map((spin) => [spin.promo_code, spin.prize_label, new Date(spin.created_at).toLocaleDateString("ru-RU")])} /></section><section className="admin-catalog"><div className="admin-section-head"><div><p className="eyebrow">Каталог</p><h2>Товарная матрица</h2></div><button disabled>Импортировать прайс</button></div><div className="admin-products">{products.slice(0, 8).map((product) => <div key={product.id}><span>{product.id}</span><strong>{product.shortName}</strong><small>{product.stock} шт. · {product.price} ₽</small><button disabled>Редактировать</button></div>)}</div><p>Редактирование каталога, цен, остатков и баннеров подключается через CMS/1С-адаптер. Заказы, партнёрские заявки и результаты колеса уже сохраняются в D1.</p></section></div>;
}

function AdminTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) { return <div className="admin-table"><h2>{title}</h2><div className="admin-table-head">{columns.map((column) => <span key={column}>{column}</span>)}</div>{rows.length ? rows.map((row, index) => <div key={index}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>) : <p>Записей пока нет</p>}</div>; }

export default function AdminPage() { return <AdminDashboard />; }
