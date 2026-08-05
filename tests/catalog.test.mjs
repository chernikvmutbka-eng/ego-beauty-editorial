import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../lib/products.ts", import.meta.url), "utf8");

test("catalog keeps real marketplace ids and required collections", () => {
  for (const value of ["945458176", "1141151914", "1272097452", "Mousse", "Glow Cat", "Ice Cat"]) assert.match(source, new RegExp(value));
});

test("catalog references local optimized product imagery", () => {
  assert.match(source, /\/products\/\$\{id\}\.webp/);
  assert.doesNotMatch(source, /images\.unsplash|lorem ipsum/i);
});
