/**
 * Extract plain text from a PDF in the browser (pdfjs-dist, no server).
 *
 * pdf.js is loaded lazily (dynamic `import()`), so it is not part of the initial
 * bundle — it only downloads once a PDF is actually dropped. Its own parsing runs in
 * a Worker it manages internally (`GlobalWorkerOptions.workerSrc`), so the (usually
 * fast, but occasionally not-so-fast on large scanned-image PDFs) parse work is
 * already off the main thread without this tool needing its own Worker wrapper.
 *
 * ## Why text reconstruction needs more than `item.str` concatenation
 *
 * `page.getTextContent()` does not return lines or paragraphs. It returns a flat
 * list of `TextItem`s — one per contiguous run of glyphs the PDF's content stream
 * drew with a single `Tj`/`TJ` operator — each carrying its own position
 * (`transform`, a 6-element affine matrix whose `[4]`/`[5]` are the run's x/y in
 * PDF space), rendered `width`/`height`, and a `hasEOL` flag pdf.js sets when the
 * *next* run starts a new line. Concatenating `item.str` values in order without
 * using that position data garbles real-world PDFs in two ways:
 *   1. Two runs on the same visual line (e.g. either side of a tab stop, a column
 *      gap, or a font/style change mid-sentence) have no space character between
 *      them in `str`, so words merge: "HelloWorld" instead of "Hello World".
 *   2. There is no line-break character between runs on different lines, so every
 *      page collapses into one run-on paragraph.
 * See `joinTextItems` below for the fix (uses the same position data pdf.js
 * already computed to decide where spaces and newlines belong).
 */
import { AppError } from './appError';

export interface ExtractedPage {
  pageNumber: number; // 1-based
  text: string;
}

export interface ExtractResult {
  pageCount: number;
  pages: ExtractedPage[];
  /**
   * True when the document has (essentially) no embedded text — the common
   * signature of a scanned/photographed page saved as a PDF of images. This tool
   * does not do OCR; callers should show an honest "no text found" message
   * instead of a near-empty download.
   */
  isLikelyScanned: boolean;
}

// A PDF with less than this many non-whitespace characters across ALL pages is
// treated as having no real text layer (a stray watermark or a single printed
// page number shouldn't count as "has text").
const SCANNED_TEXT_THRESHOLD = 10;

// pdf.js itself is loaded on first use only (dynamic import — keeps it out of the
// initial bundle). The worker URL import is static but only resolves to a small
// string (Vite's `?url`), not the worker code itself, so it costs nothing upfront.
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/* v8 ignore start -- browser/pdf.js-worker-dependent; exercised by the Playwright
   e2e suite (tests/e2e/conversion.spec.ts) with real PDF fixtures in a real browser,
   not by the Node-based unit tests. */
let pdfjsPromise: Promise<any> | null = null;
async function getPdfjs(): Promise<any> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((lib: any) => {
      lib.GlobalWorkerOptions.workerSrc = workerUrl;
      return lib;
    });
  }
  return pdfjsPromise;
}

// Static assets pdf.js fetches on demand (same-origin, not bundled into the JS):
//   - standardFontDataUrl: metrics for the 14 standard PDF fonts (Helvetica, Times,
//     Courier, ...). Without this, pdf.js falls back to approximate glyph widths for
//     any non-embedded standard font, which throws off the x-position gaps
//     `joinTextItems` uses to decide where word spaces belong.
//   - cMapUrl: character maps for CID-keyed fonts, which many PDFs use to encode
//     non-Latin text (including Japanese/Chinese). Without this, text extracted from
//     such a PDF can come out empty or garbled.
// Both ship inside the pdfjs-dist package and are copied verbatim into public/ (see
// STAMP-TODO / repo README) so they're same-origin static files, no CDN dependency.
const CMAP_URL = '/pdf-extract-text/pdfjs/cmaps/';
const STANDARD_FONT_DATA_URL = '/pdf-extract-text/pdfjs/standard_fonts/';

/** Open a PDF, mapping pdf.js's load-time failures to localizable AppError codes. */
async function loadDocument(file: File): Promise<any> {
  const pdfjs = await getPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    return await pdfjs.getDocument({
      data,
      isEvalSupported: false, // CSP has no 'unsafe-eval'
      disableAutoFetch: true,
      disableStream: true,
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      standardFontDataUrl: STANDARD_FONT_DATA_URL,
    }).promise;
  } catch (e: any) {
    if (e?.name === 'PasswordException') throw new AppError('errPdfEncrypted');
    if (e?.name === 'InvalidPDFException') throw new AppError('errPdfUnreadable');
    throw new AppError('errPdfUnreadable');
  }
}
/* v8 ignore stop */

/**
 * Join a page's flat `TextItem`/`TextMarkedContent` list into readable text,
 * inserting spaces and newlines the source data implies but doesn't spell out.
 *
 * - A line ends where pdf.js marks `hasEOL: true`, OR where the next run's
 *   baseline y jumps by more than half a line height (belt-and-braces: some
 *   content streams position runs without ever setting `hasEOL`).
 * - Within a line, a space is inserted between two runs when the gap between
 *   where the previous run visually ends (`x + width`) and where the next run
 *   starts is wider than a small fraction of the font height. Real inter-word
 *   gaps are comfortably wider than intra-word kerning, so this threshold (a
 *   proportion of font size, not a fixed pixel count) tells them apart across
 *   different font sizes and zoom levels without needing to know the exact
 *   width of a space glyph in that font.
 */
export function joinTextItems(items: ReadonlyArray<{ str?: string; transform?: number[]; width?: number; height?: number; hasEOL?: boolean }>): string {
  let out = '';
  let prevEndX: number | null = null;
  let prevY: number | null = null;
  let prevHeight = 0;

  for (const item of items) {
    if (typeof item.str !== 'string') continue; // a TextMarkedContent marker, not text

    if (item.str === '') {
      // pdf.js emits an empty item purely to carry hasEOL for a blank line.
      if (item.hasEOL) {
        out += '\n';
        prevEndX = null;
        prevY = null;
      }
      continue;
    }

    const transform = item.transform ?? [1, 0, 0, 1, 0, 0];
    const x = transform[4] ?? 0;
    const y = transform[5] ?? 0;
    const height = item.height || Math.abs(transform[3]) || prevHeight || 10;

    if (prevY !== null) {
      const sameLine = Math.abs(y - prevY) < Math.max(height, prevHeight) * 0.5;
      if (!sameLine) {
        out += '\n';
        prevEndX = null;
      } else if (prevEndX !== null) {
        const gap = x - prevEndX;
        const spaceThreshold = Math.max(height, prevHeight) * 0.18;
        if (gap > spaceThreshold && !/\s$/.test(out) && !/^\s/.test(item.str)) {
          out += ' ';
        }
      }
    }

    out += item.str;
    prevEndX = x + (item.width || 0);
    prevY = y;
    prevHeight = height;

    if (item.hasEOL) {
      out += '\n';
      prevEndX = null;
      prevY = null;
    }
  }

  // Collapse the stray blank lines that come from PDFs with a hasEOL item AND a
  // y-jump on the same break, then trim the page's leading/trailing whitespace.
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

/* v8 ignore start -- calls loadDocument()/pdf.js's page.getTextContent(); covered by
   the Playwright e2e suite (real PDF fixtures, real browser), not the Node unit tests.
   joinTextItems (the actual reconstruction heuristic called inside this loop) IS
   unit-tested directly above. */
/**
 * Extract text from every page of a PDF. `onProgress` (optional) is called after
 * each page so the UI can show "page X of N" for larger documents.
 */
export async function extractText(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractResult> {
  const doc = await loadDocument(file);
  const pageCount = doc.numPages;
  const pages: ExtractedPage[] = [];
  let totalNonWhitespace = 0;

  try {
    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      try {
        const content = await page.getTextContent();
        const text = joinTextItems(content.items as any[]);
        pages.push({ pageNumber: i, text });
        totalNonWhitespace += text.replace(/\s+/g, '').length;
      } finally {
        page.cleanup();
      }
      onProgress?.(i, pageCount);
    }
  } catch {
    throw new AppError('errPdfUnreadable');
  } finally {
    doc.destroy();
  }

  return {
    pageCount,
    pages,
    isLikelyScanned: totalNonWhitespace < SCANNED_TEXT_THRESHOLD,
  };
}
/* v8 ignore stop */

/**
 * Build the single downloadable/previewable text from extracted pages.
 * `pageLabel` renders the localized "Page {n}" heading used as a marker.
 */
export function buildCombinedText(
  pages: ReadonlyArray<ExtractedPage>,
  includePageNumbers: boolean,
  pageLabel: (n: number) => string
): string {
  if (!includePageNumbers) {
    return pages.map((p) => p.text).join('\n\n').trim() + '\n';
  }
  return (
    pages
      .map((p) => `----- ${pageLabel(p.pageNumber)} -----\n\n${p.text}`)
      .join('\n\n')
      .trim() + '\n'
  );
}
