import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <div className="success-page shell"><span className="success-mark">✓</span><p className="eyebrow">Заказ сохранён</p><h1>Спасибо.<br />Мы уже в работе.</h1><p>Номер заказа: <strong>{id ?? "EGO-DEMO"}</strong>. В боевой версии подтверждение придёт на email и в SMS после подключения провайдера.</p><div><Link className="primary-button" href="/account?tab=orders">Статус заказа</Link><Link className="text-link" href="/catalog">Вернуться в каталог →</Link></div></div>;
}
