
import { chromium } from "playwright";
import fs from "fs";
const path = "/workspace/atlas-shipped-audit";
fs.mkdirSync(path, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(45000);
async function shot(name) {
  await page.screenshot({ path: path + "/" + name + ".png", fullPage: true });
  console.log("shot", name);
}
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await shot("01-home");
await page.goto("http://127.0.0.1:3000/stays", { waitUntil: "networkidle" });
await shot("02-browse-stays");
await page.goto("http://127.0.0.1:3000/stays/inani-cliff-suite", { waitUntil: "networkidle" });
await shot("03-detail");
const compare = page.getByRole("button", { name: /add to compare/i });
if (await compare.count()) await compare.click();
await page.waitForTimeout(300);
await page.goto("http://127.0.0.1:3000/stays/sea-pearl-cottage", { waitUntil: "networkidle" });
const compare2 = page.getByRole("button", { name: /add to compare/i });
if (await compare2.count()) await compare2.click();
await page.waitForTimeout(400);
const openBtn = page.getByRole("button", { name: /^Compare/i });
if (await openBtn.count()) await openBtn.click().catch(()=>{});
await page.waitForTimeout(500);
await shot("04-compare");
await page.goto("http://127.0.0.1:3000/book/stays/inani-cliff-suite", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await shot("05-book");
const inputs = page.locator("input:visible");
const n = await inputs.count();
const vals = ["Ayesha Rahman", "ayesha@email.com", "1712345678", "Acme Ltd", "billing@acme.com", "123456789"];
for (let i = 0; i < Math.min(n, vals.length); i++) {
  await inputs.nth(i).fill(vals[i]).catch(()=>{});
}
const bkash = page.getByText(/bKash/i).first();
if (await bkash.count()) await bkash.click();
await page.waitForTimeout(300);
await shot("06-book-filled");
const pay = page.getByRole("button", { name: /Pay BDT/i });
if (await pay.count() && await pay.isEnabled()) {
  await pay.click();
  await page.waitForTimeout(1200);
  await shot("07-confirm");
} else console.log("pay disabled");
await page.goto("http://127.0.0.1:3000/trips", { waitUntil: "networkidle" });
await shot("08-trips");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await shot("10-mobile-home");
await page.goto("http://127.0.0.1:3000/stays/inani-cliff-suite", { waitUntil: "networkidle" });
await shot("11-mobile-detail");
await page.goto("http://127.0.0.1:3000/book/stays/inani-cliff-suite", { waitUntil: "networkidle" });
await shot("12-mobile-book");
await browser.close();
console.log("done");
