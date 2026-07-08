import type { ToolContent } from './types';

// pdf-extract-text. English source content.

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Extract Text from a PDF — In Your Browser, No Upload | runlocally',
    description:
      'Pull the plain text out of a PDF, page by page or as one file, right in your browser. The file is read on your device and never uploaded. Open source (MIT), works offline.',
    ogTitle: 'Extract Text from a PDF — In Your Browser, No Upload',
    ogDescription:
      'Extract the text already embedded in a PDF into a plain .txt file, in your browser. Nothing is uploaded. Open source, works offline.',
  },

  hero: {
    h1: 'Extract Text from a PDF',
    tagline: 'Pull the text out of a PDF into a plain .txt file — in your browser. Nothing is uploaded.',
  },

  intro: {
    h2: 'Extract text from a PDF, in your browser',
    paras: [
      "Drop a PDF and this tool reads the text already embedded in it, page by page — the same text layer your PDF reader lets you select and copy from. It doesn't re-typeset or reformat anything; it pulls out the words in the order the PDF stored them.",
      "The result is a single .txt file you can download, with an optional page-number heading before each page's text. Everything runs in the browser with pdfjs-dist; nothing is uploaded and no OCR happens. If a PDF has no embedded text at all — a scanned page saved as an image, for example — you get a clear message instead of an empty file.",
    ],
  },

  privacy: {
    h2: 'Why your file stays on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to:',
    points: [
      'The extraction runs entirely in your browser.',
      'The page is served as static files and makes no request with your PDF.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while extracting — no request carries your file.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Choose a PDF',
        p: 'Click to select a PDF, or drop it anywhere on the page. Its text is extracted automatically.',
      },
      {
        h3: 'Review the extracted text',
        p: 'The text appears in a preview box. Toggle "Include page numbers" to add a heading before each page, or turn it off for one continuous block of text.',
      },
      {
        h3: 'Download the .txt file',
        p: 'Download the result as a plain text file. Your original PDF is never modified or uploaded.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my PDF uploaded anywhere?',
      a: "No. The extraction runs entirely in your browser. There is no server component, so your file has no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: 'Why does it say "no text found"?',
      a: 'That PDF likely has no embedded text layer — for example, a scanned page or photo saved as a PDF of images. This tool reads the text a PDF already contains; it does not recognize text inside images (OCR), so there is nothing to extract from that kind of file.',
    },
    {
      q: "Does it keep the original PDF's layout, columns, or tables?",
      a: 'The text comes out in the order the PDF stored it, which usually matches normal reading order for simple documents. For PDFs with multiple columns or complex tables, that stored order can differ slightly from the visual reading order, so text from side-by-side columns may interleave.',
    },
    {
      q: 'Can it open a password-protected PDF?',
      a: "No. Encrypted (password-protected) PDFs can't be opened, and you'll get a clear message saying so. Remove the password in a reader you trust first, then extract the text here.",
    },
    {
      q: 'Does it change my original PDF file?',
      a: 'No. This tool only reads the PDF to pull out its text — the file you drop is never modified or re-saved.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so extraction works without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },
};
