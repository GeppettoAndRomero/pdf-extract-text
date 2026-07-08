import { type Page, type Download } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const PDF_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/pdf/text-sample.pdf', import.meta.url))
).toString('base64');

/** Wait until the island has hydrated and the extraction subsystem is ready. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/** Drop a File (given as base64) through the same path the drop zone uses. */
export async function dropFile(page: Page, b64: string, name: string, type = 'application/pdf') {
  await page.evaluate(
    ({ b64, name, type }) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const file = new File([bytes], name, { type });
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    },
    { b64, name, type }
  );
}

/** Feed the bundled 2-page text PDF through the drop-zone path, then download the .txt. */
export async function convert(page: Page): Promise<Download> {
  await dropFile(page, PDF_B64, 'sample.pdf');
  await page.locator('#download-action').waitFor({ state: 'visible', timeout: 15_000 });
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.click('#download-action');
  return downloadPromise;
}
