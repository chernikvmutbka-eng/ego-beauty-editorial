"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { formatPrice, products } from "@/lib/products";
import { checkoutSchema, CheckoutValues } from "@/lib/validation";
import { useStore } from "./store-provider";

export function CheckoutClient() {
  const router = useRouter();
  const { cart, promo, clearCart } = useStore();
  const [serverError, setServerError] = useState("");
  const lines = useMemo(() => products.filter((product) => cart[product.id]).map((product) => ({ product, quantity: cart[product.id] })), [cart]);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = Math.max(0, subtotal - (promo ? Math.round(subtotal * promo.discount / 100) : 0) + (subtotal >= 3000 ? 0 : 390));
  const form = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema), defaultValues: { delivery: "pickup", payment: "on-delivery", consent: false, name: "", phone: "", email: "", city: "Москва", address: "", comment: "" } });

  async function submit(values: CheckoutValues) {
    setServerError("");
    track("begin_checkout", { value: total, items: lines.length });
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, items: lines.map(({ product, quantity }) => ({ id: product.id, quantity })), total, promoCode: promo?.code ?? null }) });
      const body = await response.json() as { id?: string; error?: string };
      if (!response.ok || !body.id) throw new Error(body.error ?? "Не удалось сохранить заказ");
      track("purchase", { order_id: body.id, value: total });
      clearCart();
      router.push(`/checkout/success?id=${encodeURIComponent(body.id)}`);
    } catch (error) { setServerError(error instanceof Error ? error.message : "Не удалось сохранить заказ"); }
  }

  if (!lines.length) return <div className="checkout-empty shell"><h1>Корзина пуста</h1><p>Перед оформлением добавьте хотя бы один товар.</p><Link className="primary-button" href="/catalog">В каталог</Link></div>;

  return (
    <div className="checkout-page shell">
      <nav className="breadcrumbs"><Link href="/cart">Корзина</Link><span>/</span><span>Оформление</span></nav>
      <header className="page-title"><p className="eyebrow">Шаг 1 из 1</p><h1>Оформление</h1></header>
      <form className="checkout-layout" onSubmit={form.handleSubmit(submit)}>
        <div className="checkout-fields">
          <fieldset><legend><span>01</span>Контактные данные</legend><div className="form-grid"><label>Имя<input {...form.register("name")} autoComplete="name" />{form.formState.errors.name && <small>{form.formState.errors.name.message}</small>}</label><label>Телефон<input {...form.register("phone")} type="tel" autoComplete="tel" placeholder="+7 999 000-00-00" />{form.formState.errors.phone && <small>{form.formState.errors.phone.message}</small>}</label><label className="wide">Email<input {...form.register("email")} type="email" autoComplete="email" />{form.formState.errors.email && <small>{form.formState.errors.email.message}</small>}</label></div></fieldset>
          <fieldset><legend><span>02</span>Получение</legend><div className="choice-cards"><label><input type="radio" value="pickup" {...form.register("delivery")} /><span><strong>Пункт выдачи</strong><small>Адрес и срок уточнит менеджер</small></span></label><label><input type="radio" value="courier" {...form.register("delivery")} /><span><strong>Курьер</strong><small>Стоимость после расчёта</small></span></label></div><div className="form-grid"><label>Город<input {...form.register("city")} autoComplete="address-level2" />{form.formState.errors.city && <small>{form.formState.errors.city.message}</small>}</label><label>Адрес / пункт выдачи<input {...form.register("address")} autoComplete="street-address" />{form.formState.errors.address && <small>{form.formState.errors.address.message}</small>}</label></div></fieldset>
          <fieldset><legend><span>03</span>Оплата</legend><div className="choice-cards"><label><input type="radio" value="on-delivery" {...form.register("payment")} /><span><strong>После подтверждения</strong><small>Менеджер пришлёт ссылку</small></span></label><label className="disabled"><input type="radio" value="online-later" {...form.register("payment")} /><span><strong>Онлайн-картой</strong><small>Будет доступно после ЮKassa</small></span></label></div><label className="comment-field">Комментарий<textarea {...form.register("comment")} rows={4} placeholder="Пожелания к заказу" /></label></fieldset>
          <label className="consent-check"><input type="checkbox" {...form.register("consent")} /><span>Согласен(на) с политикой конфиденциальности и обработкой персональных данных</span></label>{form.formState.errors.consent && <p className="form-error">{form.formState.errors.consent.message}</p>}
        </div>
        <aside className="checkout-summary"><h2>Ваш заказ</h2><div className="checkout-products">{lines.map(({ product, quantity }) => <div key={product.id}><Image src={product.image} alt="" width={58} height={76} /><span><strong>{product.shortName}</strong><small>{quantity} × {formatPrice(product.price)}</small></span></div>)}</div><dl><div><dt>Товары</dt><dd>{formatPrice(subtotal)}</dd></div>{promo && <div><dt>Промокод {promo.code}</dt><dd>−{promo.discount}%</dd></div>}<div className="total"><dt>Итого</dt><dd>{formatPrice(total)}</dd></div></dl>{serverError && <p className="server-error" role="alert">{serverError}</p>}<button className="primary-button" type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Сохраняем…" : "Подтвердить заказ"}</button><p>Заказ сохраняется без списания оплаты. Мы подготовили интерфейсы для подключения доставки, CRM и онлайн-кассы.</p></aside>
      </form>
    </div>
  );
}
