/**
 * File validation: this tool accepts a single PDF.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_EXTENSIONS = ['.pdf'];
const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB — generous for a single document

export function validateFileExtension(fileName: string): ValidationResult {
  const dot = fileName.lastIndexOf('.');
  const extension = dot === -1 ? '' : fileName.toLowerCase().slice(dot);
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: `Unsupported extension. Supported: ${ALLOWED_EXTENSIONS.join(', ')}` };
  }
  return { valid: true };
}

export function validateFileMimeType(file: File): ValidationResult {
  // MIME can be empty (some OS/browser combos don't set it for .pdf); the
  // extension check above is the primary gate, this is a secondary check only
  // when a MIME type IS present and clearly wrong.
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` };
  }
  return { valid: true };
}

export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File is too large (${sizeMB}MB / ${maxMB}MB max).` };
  }
  return { valid: true };
}

/** Single-file validation: extension, then MIME (if present), then size. */
export function validateFile(file: File): ValidationResult {
  const extensionResult = validateFileExtension(file.name);
  if (!extensionResult.valid) return extensionResult;

  const mimeResult = validateFileMimeType(file);
  if (!mimeResult.valid && file.type) return mimeResult;

  return validateFileSize(file);
}
