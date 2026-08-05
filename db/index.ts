import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

const runtimeEnv = env as unknown as { DB?: D1Database };

export function getDb() {
  if (!runtimeEnv.DB) throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  return drizzle(runtimeEnv.DB, { schema });
}

export function getD1(): D1Database {
  if (!runtimeEnv.DB) throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  return runtimeEnv.DB;
}

export async function ensureCommerceSchema() {
  const db = getD1();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS partner_applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      telegram TEXT,
      location TEXT NOT NULL,
      partnership_type TEXT NOT NULL,
      company TEXT,
      website TEXT,
      monthly_volume TEXT,
      comment TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'new',
      total INTEGER NOT NULL,
      promo_code TEXT,
      customer_json TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS wheel_spins (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL UNIQUE,
      contact_hash TEXT NOT NULL,
      prize_label TEXT NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      promo_code TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      used_at INTEGER,
      created_at INTEGER NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS partner_created_idx ON partner_applications(created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS order_created_idx ON orders(created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS wheel_created_idx ON wheel_spins(created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS wheel_contact_idx ON wheel_spins(contact_hash)"),
  ]);
}
