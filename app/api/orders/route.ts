import { ensureCommerceSchema, getD1 } from "@/db";
import { orderApiSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = orderApiSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Проверьте данные заказа", issues: parsed.error.flatten() }, { status: 400 });
    await ensureCommerceSchema();
    const id = `EGO-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const { items, total, promoCode, ...customer } = parsed.data;
    await getD1().prepare("INSERT INTO orders (id, status, total, promo_code, customer_json, items_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, "new", total, promoCode ?? null, JSON.stringify(customer), JSON.stringify(items), Date.now()).run();
    return Response.json({ id, status: "new" }, { status: 201 });
  } catch (error) {
    console.error("order_create_failed", error);
    return Response.json({ error: "Сервис заказов временно недоступен" }, { status: 500 });
  }
}
