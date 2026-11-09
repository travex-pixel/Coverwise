// Rasterises the watercolour SVG sources in /art into optimised WebP/PNG assets
// in /public/art using the locally installed Playwright Chromium.
// Usage: node scripts/render-art.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Playwright is resolved from the local toolchain; it is not a project dependency.
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright");
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const jobs = [
  { src: "art/suv-watercolour.svg", out: "public/art/suv-watercolour.webp", width: 1200, height: 700, scale: 1.4, type: "webp", quality: 78 },
  { src: "art/suv-watercolour.svg", out: "public/art/suv-watercolour-sm.webp", width: 1200, height: 700, scale: 0.7, type: "webp", quality: 74 },
];

const browser = await chromium.launch();
for (const job of jobs) {
  const svg = await readFile(path.join(ROOT, job.src), "utf8");
  const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: job.scale });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.waitForTimeout(200);
  const buf = await page.screenshot({ type: job.type, quality: job.type === "webp" ? job.quality : undefined, omitBackground: true, clip: { x: 0, y: 0, width: job.width, height: job.height } });
  await writeFile(path.join(ROOT, job.out), buf);
  console.log(job.out, `${(buf.length / 1024).toFixed(0)} KB`);
  await page.close();
}
await browser.close();
