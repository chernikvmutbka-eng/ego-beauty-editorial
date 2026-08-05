import { ensureCommerceSchema, getD1 } from "@/db";
import { cooperationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = cooperationSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Проверьте обязательные поля", issues: parsed.error.flatten() }, { status: 400 });
    await ensureCommerceSchema(); const id = `PART-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`; const value = parsed.data;
    await getD1().prepare("INSERT INTO partner_applications (id, name, phone, email, telegram, location, partnership_type, company, website, monthly_volume, comment, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, value.name, value.phone, value.email, value.telegram || null, value.location, value.partnershipType, value.company || null, value.website || null, value.monthlyVolume || null, value.comment || null, "new", Date.now()).run();
    return Response.json({ id }, { status: 201 });
  } catch (error) { console.error("partner_create_failed", error); return Response.json({ error: "Сервис заявок временно недоступен" }, { status: 500 }); }
}
