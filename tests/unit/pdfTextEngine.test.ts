import { describe, it, expect } from 'vitest';
import { joinTextItems, buildCombinedText, type ExtractedPage } from '@/utils/pdfTextEngine';

// Synthetic pdf.js TextItem-shaped fixtures. Real pdf.js output is exercised end-to-end
// in tests/e2e/conversion.spec.ts (a real PDF, a real browser, real pdf.js parsing);
// these unit tests isolate the reconstruction heuristic itself against inputs we fully
// control, so a regression here points straight at the algorithm rather than at pdf.js.
function item(str: string, x: number, y: number, width: number, opts: { height?: number; hasEOL?: boolean } = {}) {
  return { str, transform: [12, 0, 0, 12, x, y], width, height: opts.height ?? 12, hasEOL: opts.hasEOL ?? false };
}

describe('joinTextItems', () => {
  it('inserts a space between two runs on the same line separated by a real gap', () => {
    // "Hello" ends at x=27.3 (approx width); "World" starts at x=40 — a gap much wider
    // than normal kerning at this font size (threshold is height*0.18 = 2.16).
    const items = [item('Hello', 0, 700, 27.3), item('World', 40, 700, 30)];
    expect(joinTextItems(items)).toBe('Hello World');
  });

  it('does NOT insert a space between two runs that are visually adjacent (e.g. a split word)', () => {
    // "Hel" ends exactly where "lo" begins — a font/style change mid-word is a common
    // reason a PDF's content stream splits one word into two TextItems.
    const items = [item('Hel', 0, 700, 18), item('lo', 18, 700, 12)];
    expect(joinTextItems(items)).toBe('Hello');
  });

  it('starts a new line when hasEOL is set, and does not glue the next line onto the previous word', () => {
    // This is the realistic garbling case: pdf.js represents "end of line" as an item
    // whose OWN `str` is empty (it carries no visible text), so concatenating `.str`
    // values naively drops the line break entirely and the next line's first word
    // gets glued directly onto the previous line's last word.
    const items = [
      item('One', 0, 700, 20),
      item('', 0, 700, 0, { height: 0, hasEOL: true }), // the actual EOL carrier, per pdf.js
      item('Two', 0, 680, 20),
    ];
    const out = joinTextItems(items);
    expect(out).toBe('One\nTwo');
    expect(out).not.toContain('OneTwo');
  });

  it('starts a new line on a y-jump even without an explicit hasEOL flag', () => {
    const items = [item('Alpha', 0, 700, 30), item('Beta', 0, 660, 30)];
    expect(joinTextItems(items)).toBe('Alpha\nBeta');
  });

  it('collapses 3+ consecutive line breaks to a single blank line', () => {
    const items = [
      item('A', 0, 700, 10, { hasEOL: true }),
      item('', 0, 680, 0, { height: 0, hasEOL: true }),
      item('', 0, 660, 0, { height: 0, hasEOL: true }),
      item('B', 0, 640, 10),
    ];
    expect(joinTextItems(items)).toBe('A\n\nB');
  });

  it('skips TextMarkedContent entries (no `str`) without breaking reconstruction', () => {
    const items: any[] = [
      item('Alpha', 0, 700, 30),
      { type: 'beginMarkedContentProps', id: 'P' }, // no `str` — not real text
      item('Beta', 40, 700, 30),
      { type: 'endMarkedContent' },
    ];
    expect(joinTextItems(items)).toBe('Alpha Beta');
  });

  it('handles an empty item list', () => {
    expect(joinTextItems([])).toBe('');
  });

  it('never emits a leading or trailing space/newline for a whole page', () => {
    const items = [item('  Alpha', 0, 700, 40, { hasEOL: true }), item('Beta  ', 0, 680, 40)];
    const out = joinTextItems(items);
    expect(out.startsWith(' ')).toBe(false);
    expect(out.endsWith(' ')).toBe(false);
  });
});

describe('buildCombinedText', () => {
  const pages: ExtractedPage[] = [
    { pageNumber: 1, text: 'First page text' },
    { pageNumber: 2, text: 'Second page text' },
  ];
  const pageLabel = (n: number) => `Page ${n}`;

  it('joins pages with a blank line and no headings when page numbers are off', () => {
    const out = buildCombinedText(pages, false, pageLabel);
    expect(out).toBe('First page text\n\nSecond page text\n');
    expect(out).not.toContain('Page 1');
  });

  it('prefixes each page with a heading when page numbers are on', () => {
    const out = buildCombinedText(pages, true, pageLabel);
    expect(out).toContain('----- Page 1 -----');
    expect(out).toContain('----- Page 2 -----');
    // The heading for page 1 must come before its text, which must come before page 2's heading.
    expect(out.indexOf('----- Page 1 -----')).toBeLessThan(out.indexOf('First page text'));
    expect(out.indexOf('First page text')).toBeLessThan(out.indexOf('----- Page 2 -----'));
  });

  it('handles a single page', () => {
    expect(buildCombinedText([{ pageNumber: 1, text: 'Only page' }], false, pageLabel)).toBe('Only page\n');
  });
});
