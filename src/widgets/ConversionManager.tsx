/**
 * ConversionManager (pdf-extract-text).
 * Drop one PDF → extract its text with pdf.js (`getTextContent()` per page) →
 * preview the combined text (with an "include page numbers" toggle) → download
 * as a single .txt file. Everything runs in the browser (no server).
 *
 * If the PDF has (essentially) no embedded text — the signature of a scanned or
 * photographed page saved as a PDF of images — this shows an honest notice
 * instead of a near-empty download. This tool does not do OCR.
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'preact/hooks';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { extractText, buildCombinedText, type ExtractedPage } from '@/utils/pdfTextEngine';
import { validateFile } from '@/utils/fileValidation';
import { resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface ConversionManagerProps {
  locale?: string;
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ExtractedPage[] | null>(null);
  const [isLikelyScanned, setIsLikelyScanned] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);
  const requestIdRef = useRef(0);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);
  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  const pageLabel = useCallback((n: number) => (t.pageMarker ?? 'Page {n}').replace('{n}', String(n)), [t]);

  const combinedText = useMemo(() => {
    if (!pages) return '';
    return buildCombinedText(pages, includePageNumbers, pageLabel);
  }, [pages, includePageNumbers, pageLabel]);

  const openPdf = useCallback(
    async (f: File) => {
      const validation = validateFile(f);
      if (!validation.valid) {
        showErrorToast(t.errUnsupported.replace('{name}', f.name));
        return;
      }

      setFile(f);
      setPages(null);
      setIsLikelyScanned(false);
      setExtracting(true);
      setProgress(null);

      const requestId = ++requestIdRef.current;
      try {
        const result = await extractText(f, (current, total) => {
          if (requestIdRef.current === requestId) setProgress({ current, total });
        });
        if (requestIdRef.current !== requestId) return; // a newer file was dropped meanwhile
        setPages(result.pages);
        setIsLikelyScanned(result.isLikelyScanned);
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        setFile(null);
        showErrorToast(`${f.name}: ${resolveErrorMessage(error, t)}`);
      } finally {
        if (requestIdRef.current === requestId) setExtracting(false);
      }
    },
    [showErrorToast, t]
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      const pdf = files.find((f) => f.name.toLowerCase().endsWith('.pdf'));
      if (!pdf) {
        if (files.length > 0) showErrorToast(t.errUnsupported.replace('{name}', files[0].name));
      } else {
        openPdf(pdf);
      }
      window.dispatchEvent(new CustomEvent('filesProcessed'));
    },
    [openPdf, showErrorToast, t]
  );

  useEffect(() => {
    const handler = (e: Event) => handleFiles((e as CustomEvent<File[]>).detail);
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const handleDownload = useCallback(() => {
    if (!file || !pages) return;
    const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '') + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [file, pages, combinedText]);

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h3 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h3>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <div
          style={{
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div style="font-size: 3rem; margin-bottom: var(--space-2);">📄</div>
          <div style="font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
            {t.dropClick}
          </div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.dropOr}</div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">
            {t.dropSupported}
          </div>
          <input
            id="file-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              handleFiles(Array.from(e.currentTarget.files || []));
              e.currentTarget.value = '';
            }}
            style="display: none;"
          />
        </div>

        {file && extracting && (
          <div style="font-size: var(--fs-2); color: var(--color-subtle);" aria-live="polite">
            {progress
              ? (t.extractingProgress ?? 'Extracting text… (page {current} of {total})')
                  .replace('{current}', String(progress.current))
                  .replace('{total}', String(progress.total))
              : (t.extracting ?? 'Extracting text…')}
          </div>
        )}

        {file && !extracting && pages && isLikelyScanned && (
          <div
            role="status"
            style={{
              padding: 'var(--space-4)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-surface)',
            }}
          >
            <strong style="display: block; margin-bottom: var(--space-1);">{t.scannedTitle}</strong>
            <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.scannedBody}</p>
          </div>
        )}

        {file && !extracting && pages && !isLikelyScanned && (
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
              <strong style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{file.name}</strong>
              <span style="font-size: var(--fs-2); color: var(--color-subtle); flex-shrink: 0;" class="num">
                {(t.pagesLabel ?? '{n} pages').replace('{n}', String(pages.length))}
              </span>
            </div>

            <label style="display: flex; align-items: center; gap: var(--space-2); font-size: var(--fs-2);">
              <input
                type="checkbox"
                checked={includePageNumbers}
                onChange={(e) => setIncludePageNumbers(e.currentTarget.checked)}
              />
              {t.includePageNumbers ?? 'Include page numbers'}
            </label>

            <label style="font-size: var(--fs-2); display: flex; flex-direction: column; gap: var(--space-1);">
              {t.previewLabel ?? 'Extracted text'}
              <textarea
                id="text-preview"
                readOnly
                value={combinedText}
                aria-label={t.previewLabel ?? 'Extracted text'}
                style={{
                  width: '100%',
                  minHeight: '280px',
                  maxHeight: '480px',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 'var(--fs-1)',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  whiteSpace: 'pre-wrap',
                }}
              />
            </label>

            <div style="display: flex; justify-content: flex-end;">
              <button id="download-action" onClick={handleDownload} class="app-button app-button--primary">
                {t.downloadButton ?? 'Download .txt'}
              </button>
            </div>
          </div>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast key={toast.id} id={toast.id} message={toast.message} onClose={removeErrorToast} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
