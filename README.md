# pdf-extract-text

Extract the plain text from a PDF, entirely in your browser. The file is read on your
device and never uploaded. Open source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

Text is read page by page with [pdf.js](https://github.com/mozilla/pdf.js)
(`pdfjs-dist`)'s `getTextContent()` API, which returns each page's text as a flat list of
positioned runs rather than lines or paragraphs. This tool reconstructs readable text from
that list using each run's position (where pdf.js sets `hasEOL` for line breaks, and the
x/y gap between runs for word spacing) — see `src/utils/pdfTextEngine.ts` for the exact
heuristic. The whole pipeline runs client-side; there is no server component, so your file
has no path off your device.

If a PDF has no embedded text at all (a scanned page or photo saved as a PDF of images),
the tool says so plainly instead of producing a near-empty file. It does not perform OCR.

## Features

- Extracts text from every page of a PDF
- Preview with an optional "include page numbers" heading per page
- Download as a single `.txt` file
- Clear message for password-protected PDFs and for PDFs with no text layer
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. PDF parsing runs via pdf.js's own worker
(`GlobalWorkerOptions.workerSrc`), loaded lazily on first use.

## Browser support

Works in current Chrome, Edge, Firefox and Safari — pdf.js runs entirely in JavaScript/Wasm,
with no dependency on native PDF support in the browser.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
