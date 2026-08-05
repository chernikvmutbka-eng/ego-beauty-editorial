import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const partnerApplications = sqliteTable("partner_applications", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  telegram: text("telegram"),
  location: text("location").notNull(),
  partnershipType: text("partnership_type").notNull(),
  company: text("company"),
  website: text("website"),
  monthlyVolume: text("monthly_volume"),
  comment: text("comment"),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  status: text("status").notNull().default("new"),
  total: integer("total").notNull(),
  promoCode: text("promo_code"),
  customerJson: text("customer_json").notNull(),
  itemsJson: text("items_json").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const wheelSpins = sqliteTable("wheel_spins", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull().unique(),
  contactHash: text("contact_hash").notNull(),
  prizeLabel: text("prize_label").notNull(),
  discount: integer("discount").notNull().default(0),
  promoCode: text("promo_code").notNull().unique(),
  expiresAt: integer("expires_at").notNull(),
  usedAt: integer("used_at"),
  createdAt: integer("created_at").notNull(),
});
