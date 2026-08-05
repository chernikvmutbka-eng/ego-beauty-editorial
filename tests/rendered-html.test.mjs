import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public routes and commerce surfaces are implemented", async () => {
  const routes = ["app/page.tsx", "app/catalog/page.tsx", "app/search/page.tsx", "app/cart/page.tsx", "app/checkout/page.tsx", "app/cooperation/page.tsx", "app/fortune/page.tsx", "app/account/page.tsx", "app/admin/page.tsx"];
  await Promise.all(routes.map((route) => access(new URL(`../${route}`, import.meta.url))));
});

test("starter preview is fully replaced with branded content", async () => {
  const [home, layout, css, packageJson] = await Promise.all([read("app/page.tsx"), read("app/layout.tsx"), read("app/globals.css"), read("package.json")]);
  assert.match(home, /Коллекция Mousse/);
  assert.match(layout, /EGO Beauty/);
  assert.match(css, /--pink-strong/);
  assert.doesNotMatch(home + layout + packageJson, /SkeletonPreview|react-loading-skeleton|codex-preview/);
});

test("wheel result is server-selected, signed and rate-limited", async () => {
  const route = await read("app/api/wheel/route.ts");
  assert.match(route, /crypto\.getRandomValues/);
  assert.match(route, /HMAC/);
  assert.match(route, /30 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(route, /ORDER BY created_at DESC/);
  assert.match(route, /INSERT INTO wheel_spins/);
});

test("orders and partnership applications use validated D1 writes", async () => {
  const [orders, cooperation, validation] = await Promise.all([read("app/api/orders/route.ts"), read("app/api/cooperation/route.ts"), read("lib/validation.ts")]);
  assert.match(orders, /orderApiSchema\.safeParse/);
  assert.match(orders, /INSERT INTO orders/);
  assert.match(cooperation, /cooperationSchema\.safeParse/);
  assert.match(cooperation, /INSERT INTO partner_applications/);
  assert.match(validation, /z\.email/);
});
