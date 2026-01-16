// import puppeteer from "puppeteer";

// export async function htmlToPDF(html: string): Promise<Buffer> {
//   const executablePath = puppeteer.executablePath();
//   console.log("Using chromium at:", executablePath);
//   const browser = await puppeteer.launch({
//     headless: true,
//     executablePath,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();

//   await page.setContent(html, { waitUntil: "networkidle0" });

//   const pdfUnit8 = await page.pdf({
//     format: "A4",
//     printBackground: true,
//   });

//   await browser.close();
//   return Buffer.from(pdfUnit8);
// }

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function htmlToPDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfUint8 = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdfUint8);
}
