import assert from "node:assert/strict";

const baseUrl = (process.env.CROP_ROUTE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

function readMetadata(html) {
  return {
    title: html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null,
    canonical: html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? null,
    description: html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] ?? null,
  };
}

async function readRoute(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const metadata = readMetadata(await response.text());
  return { path, status: response.status, ...metadata };
}

const invalid = await readRoute("/mandi-bhav/crop/not-a-real-crop");
assert.equal(invalid.status, 404, `Expected invalid crop to return 404, received ${invalid.status}`);
assert.equal(invalid.canonical, null, "Invalid crop must not expose a canonical URL");
assert.equal(invalid.description, null, "Invalid crop must not expose a crop description");

const expected = [
  ["wheat", "गेहूं (Wheat)"],
  ["soyabean", "सोयाबीन (Soyabean)"],
  ["paddy", "धान (Paddy)"],
];

for (const [slug, cropName] of expected) {
  const route = await readRoute(`/mandi-bhav/crop/${slug}`);
  assert.equal(route.status, 200, `Expected ${slug} to return 200, received ${route.status}`);
  assert.match(route.title ?? "", new RegExp(cropName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${slug} title changed`);
  assert.equal(route.canonical, `${baseUrl}/mandi-bhav/crop/${slug}`, `${slug} canonical changed`);
  assert.ok(route.description?.includes(cropName), `${slug} description changed`);
}

console.log(`Crop route checks passed against ${baseUrl}`);
