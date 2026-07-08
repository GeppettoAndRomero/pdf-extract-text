import { describe, it, expect } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

describe('resolveErrorMessage', () => {
  it('maps codes (incl. string codes, e.g. forwarded from a caught exception) to localized strings', () => {
    expect(resolveErrorMessage('errPdfEncrypted', ui.en)).toBe('This PDF is password-protected (encrypted).');
    expect(resolveErrorMessage('errPdfEncrypted', ui.ja)).toBe('この PDF はパスワードで保護されています（暗号化）。');
    expect(resolveErrorMessage(new AppError('errPdfUnreadable'), ui.de)).toBe(
      'Diese Datei ist kein lesbares PDF.'
    );
  });

  it('falls back to the localized generic message for unmapped English/undefined errors', () => {
    // e.g. an internal pdf.js error string, or a missing error value.
    expect(resolveErrorMessage('Failed to fetch worker script', ui.zh)).toBe(ui.zh.errConversionFailed);
    expect(resolveErrorMessage(undefined, ui.es)).toBe(ui.es.errConversionFailed);
  });

  it('every locale defines the mapped codes', () => {
    for (const loc of ['en', 'ja', 'zh', 'de', 'es'] as const)
      for (const c of ['errPdfEncrypted', 'errPdfUnreadable', 'errConversionFailed'])
        expect((ui as any)[loc][c], `${loc}.${c}`).toBeTruthy();
  });
});
