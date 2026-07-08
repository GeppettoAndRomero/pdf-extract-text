import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first 名前空間: ツールを runlocally.app/pdf-extract-text/ 配下に「物理配置」する
  // （src/pages/pdf-extract-text/ + public/pdf-extract-text/）。base は使わない（base は URL に
  // prefix を付けるが dist を入れ子化せず、ルート配信の Pages と不整合になるため）。
  // バンドルアセットも /pdf-extract-text/_assets/ に隔離し hub/他ツールと無衝突にする。
  build: {
    inlineStylesheets: 'auto',
    assets: 'pdf-extract-text/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['preact', 'preact/hooks']
            // pdfjs-dist is intentionally NOT bundled here: pdfTextEngine.ts loads it via a
            // dynamic import(), which Rollup already splits into its own lazy chunk. It only
            // downloads once a PDF is actually dropped, not on first paint.
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
