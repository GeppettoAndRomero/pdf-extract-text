import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { waitReady, convert, dropFile } from './_helpers';

const SCANNED_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/pdf/scanned-image-only.pdf', import.meta.url))
).toString('base64');
const ENCRYPTED_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/pdf/encrypted.pdf', import.meta.url))
).toString('base64');

test.describe('PDF text extraction', () => {
  test('extracts real text per page, correctly spaced, with no upload', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const u = req.url();
      if (!u.startsWith('http://localhost:4321') && !u.startsWith('data:') && !u.startsWith('blob:')) {
        external.push(u);
      }
    });

    await page.goto('/pdf-extract-text/');
    await waitReady(page);
    const download = await convert(page);

    expect(download.suggestedFilename()).toMatch(/\.txt$/);
    const path = await download.path();
    expect(path).toBeTruthy();
    const text = readFileSync(path as string, 'utf-8');

    // Page-number headings are on by default: the two pages must appear as
    // separate, ordered sections rather than being merged together.
    expect(text.indexOf('Page 1')).toBeGreaterThanOrEqual(0);
    expect(text.indexOf('Page 2')).toBeGreaterThan(text.indexOf('Page 1'));

    // The core value proposition: words must be correctly SPACED, not garbled
    // together the way naive `items.map(i => i.str).join('')` concatenation would
    // produce ("HelloWorldfromPageOneRUNLOCALLYPAGEONEMARKER..."). Compare against
    // the fixture's known sentences with runs of whitespace normalized to one
    // space, so the assertion is robust to a reasonable choice of newline vs space
    // at the line break while still failing hard if any word boundary is lost.
    const normalized = text.replace(/\s+/g, ' ');
    expect(normalized).toContain('Hello World from Page One');
    expect(normalized).toContain('RUNLOCALLY PAGE ONE MARKER');
    expect(normalized).toContain('Hello World from Page Two');
    expect(normalized).toContain('RUNLOCALLY PAGE TWO MARKER');
    // And the two pages' marker text must not have merged into one run-on string.
    expect(text).not.toMatch(/MARKERHello/);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('omits page headings when "include page numbers" is turned off', async ({ page }) => {
    await page.goto('/pdf-extract-text/');
    await waitReady(page);
    await dropFile(
      page,
      readFileSync(fileURLToPath(new URL('../fixtures/pdf/text-sample.pdf', import.meta.url))).toString('base64'),
      'sample.pdf'
    );
    await page.locator('#download-action').waitFor({ state: 'visible', timeout: 15_000 });

    // The toggle defaults to on; switch it off and confirm the preview drops the headings.
    const toggle = page.locator('input[type=checkbox]');
    await toggle.uncheck();
    const preview = page.locator('#text-preview');
    await expect(preview).not.toHaveValue(/Page 1/);
    await expect(preview).toHaveValue(/Hello World from Page One/);

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;
    const text = readFileSync((await download.path()) as string, 'utf-8');
    expect(text).not.toContain('Page 1');
    expect(text.replace(/\s+/g, ' ')).toContain('Hello World from Page One');
  });

  test('shows an honest message for a scanned/image-only PDF instead of an empty download', async ({ page }) => {
    await page.goto('/pdf-extract-text/');
    await waitReady(page);
    await dropFile(page, SCANNED_B64, 'scanned.pdf');

    // No OCR claim, no download button — just the honest "no text" notice.
    await expect(page.getByText('No text found in this PDF')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#download-action')).toHaveCount(0);
  });

  test('shows a clear error for a password-protected PDF', async ({ page }) => {
    await page.goto('/pdf-extract-text/');
    await waitReady(page);
    await dropFile(page, ENCRYPTED_B64, 'encrypted.pdf');

    // Target the error toast specifically (role="alert") — the static FAQ content
    // below also mentions "password-protected", so a page-wide text search is ambiguous.
    await expect(page.getByRole('alert')).toContainText('password-protected', { timeout: 15_000 });
    await expect(page.locator('#download-action')).toHaveCount(0);
  });
});
