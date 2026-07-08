import { describe, it, expect } from 'vitest';
import {
  validateFileExtension,
  validateFileMimeType,
  validateFileSize,
  validateFile,
} from '@/utils/fileValidation';

// `sizeOverride` fakes a large `.size` without actually allocating that many bytes
// (validateFileSize only reads `.size`, so a real multi-hundred-MB buffer is unnecessary).
function pdfFile(name: string, size = 1024, type = 'application/pdf', sizeOverride?: number): File {
  const file = new File([new Uint8Array(size)], name, { type });
  if (sizeOverride !== undefined) Object.defineProperty(file, 'size', { value: sizeOverride });
  return file;
}

describe('validateFileExtension', () => {
  it('accepts .pdf (any case)', () => {
    expect(validateFileExtension('doc.pdf').valid).toBe(true);
    expect(validateFileExtension('DOC.PDF').valid).toBe(true);
  });
  it('rejects other extensions', () => {
    expect(validateFileExtension('doc.docx').valid).toBe(false);
    expect(validateFileExtension('doc.txt').valid).toBe(false);
  });
  it('rejects a file name with no extension', () => {
    expect(validateFileExtension('README').valid).toBe(false);
  });
});

describe('validateFileMimeType', () => {
  it('accepts application/pdf', () => {
    expect(validateFileMimeType(pdfFile('a.pdf', 10, 'application/pdf')).valid).toBe(true);
  });
  it('accepts an empty MIME type (some OS/browser combos omit it)', () => {
    expect(validateFileMimeType(pdfFile('a.pdf', 10, '')).valid).toBe(true);
  });
  it('rejects a clearly wrong MIME type', () => {
    expect(validateFileMimeType(pdfFile('a.pdf', 10, 'image/png')).valid).toBe(false);
  });
});

describe('validateFileSize', () => {
  it('accepts a normal-sized file', () => {
    expect(validateFileSize(pdfFile('a.pdf', 1024)).valid).toBe(true);
  });
  it('rejects a file over the size limit', () => {
    const result = validateFileSize(pdfFile('big.pdf', 10, 'application/pdf', 501 * 1024 * 1024));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('MB');
  });
});

describe('validateFile', () => {
  it('passes a normal PDF', () => {
    expect(validateFile(pdfFile('report.pdf')).valid).toBe(true);
  });
  it('fails on extension before checking MIME/size', () => {
    const result = validateFile(pdfFile('report.docx'));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported extension');
  });
  it('fails on a wrong non-empty MIME type even with a .pdf extension', () => {
    const result = validateFile(pdfFile('fake.pdf', 10, 'image/png'));
    expect(result.valid).toBe(false);
  });
});
