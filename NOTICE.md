# Third-party notices

The source code in this repository is licensed under the MIT License (see LICENSE).
It redistributes the following third-party component under its own license:

## pdfjs-dist — Apache-2.0

- **Package:** [`pdfjs-dist`](https://www.npmjs.com/package/pdfjs-dist)
- **Upstream:** [PDF.js](https://github.com/mozilla/pdf.js) (Mozilla) — parses PDFs and
  provides the `getTextContent()` API this tool uses to read each page's embedded text.
- **License:** Apache License, Version 2.0.
- **Modifications:** none. The library is used unmodified, as an npm dependency.

A copy of the Apache License, Version 2.0 is available at
<https://www.apache.org/licenses/LICENSE-2.0> and is included within the `pdfjs-dist`
package (`node_modules/pdfjs-dist/LICENSE` in this repository's dependency tree).

`public/pdf-extract-text/pdfjs/` contains two data directories pdf.js fetches on
demand at runtime (not bundled into the JS): `cmaps/` (Adobe's predefined CMaps for
CID-keyed fonts, BSD-style license) and `standard_fonts/` (Foxit's substitute metrics
for the 14 standard PDF fonts, BSD-style license, plus the Liberation fonts under the
SIL Open Font License). Both are copied unmodified from `pdfjs-dist`'s own
distribution, and each directory retains its own `LICENSE*` file.

---

Other dependencies — Astro, Preact, and @astrojs/preact — are distributed under the MIT License.
