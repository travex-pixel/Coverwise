// Renders high-quality link preview images (Open Graph / Twitter / WhatsApp)
// from an HTML template using the local Playwright Chromium.
// Usage: node scripts/render-og.mjs   (run after scripts/render-art.mjs)
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright");

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const art = await readFile(path.join(ROOT, "public/art/suv-watercolour.webp"));
const artUri = `data:image/webp;base64,${art.toString("base64")}`;

function template({ width, height, square }) {
  return `<!doctype html><html><head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">
  <style>
    *{margin:0;box-sizing:border-box}
    body{width:${width}px;height:${height}px;background:#F5F3ED;font-family:Geist,system-ui,sans-serif;color:#111512;overflow:hidden;position:relative}
    .grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:multiply}
    .art{position:absolute;${square ? "right:-18%;bottom:-6%;width:130%" : "right:-6%;bottom:-10%;width:66%"};}
    .copy{position:absolute;left:${square ? 64 : 72}px;top:${square ? 72 : 76}px;max-width:${square ? 900 : 560}px}
    .eyebrow{font-size:${square ? 22 : 17}px;letter-spacing:.14em;text-transform:uppercase;color:#8F7C4F;font-weight:500;display:flex;align-items:center;gap:14px}
    .eyebrow:before{content:"";display:block;width:34px;height:1px;background:#B39F70}
    h1{margin-top:${square ? 28 : 22}px;font-size:${square ? 108 : 78}px;line-height:.98;letter-spacing:-.035em;font-weight:500}
    h1 em{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;color:#14241D;letter-spacing:-.02em}
    p{margin-top:${square ? 30 : 22}px;font-size:${square ? 30 : 23}px;line-height:1.4;color:#5E645F;max-width:${square ? 760 : 520}px}
    .brand{position:absolute;left:${square ? 64 : 72}px;bottom:${square ? 64 : 56}px;display:flex;align-items:center;gap:12px;font-weight:600;font-size:${square ? 30 : 24}px;letter-spacing:-.03em}
    .mark{width:${square ? 40 : 32}px;height:${square ? 40 : 32}px;border-radius:10px;background:#111512;position:relative}
    .mark:after{content:"";position:absolute;inset:26%;border-radius:50%;border:3px solid #C7B58D;border-right-color:#F5F3ED;border-bottom-color:#F5F3ED}
    .tag{position:absolute;right:${square ? 64 : 64}px;top:${square ? 72 : 64}px;font-size:${square ? 18 : 14}px;color:#868C87;letter-spacing:.06em;text-transform:uppercase}
  </style></head><body>
  <svg class="grain" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0.42 0 0 0 0 0.4 0 0 0 0 0.34 0 0 0 -0.55 0.5"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
  <img class="art" src="${artUri}">
  <div class="tag">Demonstration</div>
  <div class="copy">
    <div class="eyebrow">Comprehensive car insurance · Australia</div>
    <h1>Stop <em>shopping around</em> for insurance.</h1>
    <p>Tell us about your car once. Compare available options from participating providers, all in one place.</p>
  </div>
  <div class="brand"><span class="mark"></span>Coverwise</div>
  </body></html>`;
}

const jobs = [
  { out: "public/og/coverwise-og.jpg", width: 1200, height: 630, square: false },
  { out: "public/og/coverwise-square.jpg", width: 1080, height: 1080, square: true },
];
await mkdir(path.join(ROOT, "public/og"), { recursive: true });
const browser = await chromium.launch();
for (const job of jobs) {
  const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1 });
  await page.setContent(template(job), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  let quality = 86;
  let buf = await page.screenshot({ type: "jpeg", quality });
  // WhatsApp and Messenger prefer previews under ~300 KB.
  while (buf.length > 290 * 1024 && quality > 60) {
    quality -= 6;
    buf = await page.screenshot({ type: "jpeg", quality });
  }
  await writeFile(path.join(ROOT, job.out), buf);
  console.log(job.out, `${(buf.length / 1024).toFixed(0)} KB (q${quality})`);
  await page.close();
}
await browser.close();
