import { env } from "cloudflare:workers";
import { ensureCommerceSchema, getD1 } from "@/db";
import { wheelSchema } from "@/lib/validation";

const prizes = [
  { label: "Гайд по ассортименту", code: "ASSORT", discount: 0, weight: 34 },
  { label: "Гайд по продвижению", code: "PROMO-GUIDE", discount: 0, weight: 28 },
  { label: "Промокод 1 — скидка 7%", code: "PROMO1", discount: 7, weight: 22 },
  { label: "Промокод 2 — скидка 12%", code: "PROMO2", discount: 12, weight: 16 },
  { label: "Суперприз", code: "SUPER", discount: 0, weight: 0 },
];

type WheelEnv = { WHEEL_SIGNING_SECRET?: string; TELEGRAM_VERIFY_URL?: string };

async function digest(value: string) { const bytes = new TextEncoder().encode(value); const hash = await crypto.subtle.digest("SHA-256", bytes); return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join(""); }
async function sign(value: string) { const secret = (env as unknown as WheelEnv).WHEEL_SIGNING_SECRET ?? "development-only-change-before-sales"; const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)); return [...new Uint8Array(signature)].slice(0, 5).map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase(); }

async function verifyTelegram(username: string) {
  const verificationUrl = (env as unknown as WheelEnv).TELEGRAM_VERIFY_URL;
  if (!verificationUrl) return "pending";
  const response = await fetch(verificationUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username }) });
  if (!response.ok) throw new Error("telegram_verification_unavailable");
  const result = await response.json() as { subscribed?: boolean };
  return result.subscribed ? "verified" : "not_subscribed";
}

export async function POST(request: Request) {
  try {
    const parsed = wheelSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Введите корректный ник Telegram и примите правила" }, { status: 400 });
    await ensureCommerceSchema();
    const db = getD1(); const now = Date.now();
    const existingRequest = await db.prepare("SELECT prize_label, discount, promo_code, expires_at FROM wheel_spins WHERE request_id = ? LIMIT 1").bind(parsed.data.requestId).first<{ prize_label: string; discount: number; promo_code: string; expires_at: number }>();
    if (existingRequest) { const segmentIndex = Math.max(0, prizes.findIndex((prize) => existingRequest.prize_label.startsWith(prize.label))); return Response.json({ label: existingRequest.prize_label, discount: existingRequest.discount, code: existingRequest.promo_code, expiresAt: existingRequest.expires_at, segmentIndex, repeated: true }, { status: 409 }); }

    const username = parsed.data.contact.trim().replace(/^@/, "").toLowerCase();
    const contactHash = await digest(username);
    const previous = await db.prepare("SELECT prize_label, discount, promo_code, expires_at FROM wheel_spins WHERE contact_hash = ? ORDER BY created_at DESC LIMIT 1").bind(contactHash).first<{ prize_label: string; discount: number; promo_code: string; expires_at: number }>();
    if (previous) { const segmentIndex = Math.max(0, prizes.findIndex((prize) => previous.prize_label.startsWith(prize.label))); return Response.json({ error: "Попытка уже использована", label: previous.prize_label, discount: previous.discount, code: previous.promo_code, expiresAt: previous.expires_at, segmentIndex, repeated: true }, { status: 429 }); }

    const verification = await verifyTelegram(username);
    if (verification === "not_subscribed") return Response.json({ error: "Сначала подпишитесь на Telegram-канал EGO Beauty" }, { status: 403 });

    const count = await db.prepare("SELECT COUNT(*) AS total FROM wheel_spins").first<{ total: number }>();
    const ordinal = Number(count?.total ?? 0) + 1;
    let segmentIndex = 0;
    if (ordinal % 300 === 0) segmentIndex = prizes.length - 1;
    else {
      const regular = prizes.slice(0, -1); const totalWeight = regular.reduce((sum, prize) => sum + prize.weight, 0); const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 * totalWeight; let cursor = 0;
      for (let index = 0; index < regular.length; index++) { cursor += regular[index].weight; if (random < cursor) { segmentIndex = index; break; } }
    }

    const prize = prizes[segmentIndex]; const id = crypto.randomUUID(); const expiresAt = now + 30 * 24 * 60 * 60 * 1000; const base = `${prize.code}-${id.slice(0, 8).toUpperCase()}`; const code = `EGO-${base}-${await sign(base)}`;
    await db.prepare("INSERT INTO wheel_spins (id, request_id, contact_hash, prize_label, discount, promo_code, expires_at, used_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, parsed.data.requestId, contactHash, prize.label, prize.discount, code, expiresAt, null, now).run();
    return Response.json({ label: prize.label, discount: prize.discount, code, expiresAt, segmentIndex, verification });
  } catch (error) { console.error("wheel_spin_failed", error); return Response.json({ error: "Колесо временно недоступно" }, { status: 500 }); }
}
