import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { products } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const requestHeaders = await headers();
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const configuredUrl = configured ? new URL(configured) : null;
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? configuredUrl?.host ?? "localhost:3000").split(",")[0].trim();
  const protocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim() ?? (host.startsWith("localhost") ? "http" : "https");
  const base = `${protocol}://${host}`;
  return ["", "/catalog", "/about", "/info", "/cooperation", "/fortune", "/privacy", "/terms", ...products.map((product) => `/product/${product.slug}`)].map((path) => ({ url: `${base}${path}`, lastModified: new Date("2026-08-04"), changeFrequency: path.startsWith("/product") ? "weekly" : "monthly", priority: path === "" ? 1 : path === "/catalog" ? .9 : .7 }));
}
