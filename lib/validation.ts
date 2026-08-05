import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  phone: z.string().trim().min(10, "Проверьте номер телефона"),
  email: z.email("Проверьте email"),
  city: z.string().trim().min(2, "Укажите город"),
  address: z.string().trim().min(5, "Укажите адрес или пункт выдачи"),
  delivery: z.enum(["courier", "pickup"]),
  payment: z.enum(["on-delivery", "online-later"]),
  comment: z.string().max(700).optional(),
  consent: z.boolean().refine(Boolean, "Нужно согласие на обработку данных"),
});

export const orderApiSchema = checkoutSchema.extend({
  items: z.array(z.object({ id: z.string(), quantity: z.number().int().min(1).max(20) })).min(1),
  total: z.number().int().min(1),
  promoCode: z.string().max(80).nullable().optional(),
});

export const cooperationSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  phone: z.string().trim().min(10, "Проверьте номер телефона"),
  email: z.email("Проверьте email"),
  telegram: z.string().max(100).optional(),
  location: z.string().trim().min(2, "Укажите город и страну"),
  partnershipType: z.enum(["wholesale", "studio", "education", "ambassador"]),
  company: z.string().max(160).optional(),
  website: z.string().max(300).optional(),
  monthlyVolume: z.string().max(100).optional(),
  comment: z.string().max(1200).optional(),
  consent: z.boolean().refine(Boolean, "Нужно согласие на обработку данных"),
});

export const wheelSchema = z.object({
  contact: z.string().trim().regex(/^@?[A-Za-z0-9_]{5,32}$/, "Проверьте ник Telegram"),
  consent: z.literal(true),
  requestId: z.string().uuid(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
export type CooperationValues = z.infer<typeof cooperationSchema>;
