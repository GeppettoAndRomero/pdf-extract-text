/**
 * Preact island (client UI) copy, by locale.
 * Separate from the page-level content (`en.ts` / `ja.ts` / ...), this holds the
 * strings the interactive island itself renders.
 *
 * Important: the island receives `locale` as a PROP (present at SSR time) rather
 * than reading it from `document`, so SSR and the client render the same string
 * and hydration never mismatches.
 *
 * Interpolated strings use `{name}` / `{n}` / `{count}` / `{current}` / `{total}`
 * placeholders, replaced with `.replace(...)` on the island side.
 */
export const ui = {
  en: {
    // ConversionManager
    uploadHeading: 'Upload a PDF',
    uploadSubtitle: 'Choose a PDF to extract its text.',
    dropClick: 'Click to choose a file',
    dropOr: 'or drop it anywhere on the page',
    dropSupported: 'PDF files',
    extracting: 'Extracting text…',
    extractingProgress: 'Extracting text… (page {current} of {total})',
    pagesLabel: '{n} pages',
    includePageNumbers: 'Include page numbers',
    previewLabel: 'Extracted text',
    downloadButton: 'Download .txt',
    pageMarker: 'Page {n}',
    scannedTitle: 'No text found in this PDF',
    scannedBody:
      "This PDF appears to be scanned or made of images — it has no embedded text layer, so there is nothing to extract. This tool reads the text a PDF already contains; it does not recognize text in images (OCR).",
    notificationsAria: 'Notifications',
    errUnsupported: 'Not a PDF file ({name}).',
    errConversionFailed: 'Extraction failed',
    errPdfEncrypted: 'This PDF is password-protected (encrypted).',
    errPdfUnreadable: 'This file is not a readable PDF.',
    errDownloadFailed: 'Download failed',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // GlobalDropZone
    dzProcessing: 'Processing {count} file(s)...',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a PDF to extract its text',
    dzDropSub: 'Text is extracted in your browser, nothing is uploaded',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    close: 'Close',
  },
  ja: {
    // ConversionManager
    uploadHeading: 'PDFを選ぶ',
    uploadSubtitle: 'テキストを抽出したいPDFを選んでください。',
    dropClick: 'クリックしてファイルを選択',
    dropOr: 'またはページ上にドロップ',
    dropSupported: 'PDFファイル',
    extracting: 'テキストを抽出中…',
    extractingProgress: 'テキストを抽出中…（{current} / {total} ページ）',
    pagesLabel: '{n} ページ',
    includePageNumbers: 'ページ番号を含める',
    previewLabel: '抽出したテキスト',
    downloadButton: '.txt をダウンロード',
    pageMarker: '{n} ページ目',
    scannedTitle: 'このPDFにはテキストが見つかりませんでした',
    scannedBody:
      'このPDFはスキャンした画像や写真だけで構成されている可能性があり、テキスト情報が埋め込まれていないため抽出できるテキストがありません。このツールはPDFにすでに含まれているテキストを読み取るものであり、画像内の文字を認識する機能（OCR）は備えていません。',
    notificationsAria: '通知',
    errUnsupported: 'PDFファイルではありません（{name}）。',
    errConversionFailed: '抽出に失敗しました',
    errPdfEncrypted: 'この PDF はパスワードで保護されています（暗号化）。',
    errPdfUnreadable: 'このファイルは読み取り可能な PDF ではありません。',
    errDownloadFailed: 'ダウンロードに失敗しました',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを処理中…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'ドロップしてPDFのテキストを抽出',
    dzDropSub: 'ブラウザ内でテキストを抽出します。アップロードは行いません',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    close: '閉じる',
  },
  zh: {
    // ConversionManager
    uploadHeading: '选择 PDF',
    uploadSubtitle: '选择要提取文本的 PDF。',
    dropClick: '点击选择文件',
    dropOr: '或把文件拖到页面任意位置',
    dropSupported: 'PDF 文件',
    extracting: '正在提取文本…',
    extractingProgress: '正在提取文本…（第 {current} / {total} 页）',
    pagesLabel: '共 {n} 页',
    includePageNumbers: '包含页码',
    previewLabel: '提取的文本',
    downloadButton: '下载 .txt',
    pageMarker: '第 {n} 页',
    scannedTitle: '未在此 PDF 中找到文本',
    scannedBody:
      '此 PDF 可能是扫描件或由图片组成，没有嵌入的文本层，因此没有可提取的文本。此工具读取的是 PDF 中已有的文本，并不具备识别图片中文字的能力（OCR）。',
    notificationsAria: '通知',
    errUnsupported: '不是 PDF 文件（{name}）。',
    errConversionFailed: '提取失败',
    errPdfEncrypted: '此 PDF 受密码保护（已加密）。',
    errPdfUnreadable: '此文件不是可读取的 PDF。',
    errDownloadFailed: '下载失败',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // GlobalDropZone
    dzProcessing: '正在处理 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放 PDF 以提取文本',
    dzDropSub: '文本在浏览器中提取，不会上传',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    close: '关闭',
  },
  de: {
    // ConversionManager
    uploadHeading: 'PDF auswählen',
    uploadSubtitle: 'Wähle ein PDF aus, dessen Text extrahiert werden soll.',
    dropClick: 'Zum Auswählen klicken',
    dropOr: 'oder irgendwo auf die Seite ziehen',
    dropSupported: 'PDF-Dateien',
    extracting: 'Text wird extrahiert…',
    extractingProgress: 'Text wird extrahiert… (Seite {current} von {total})',
    pagesLabel: '{n} Seiten',
    includePageNumbers: 'Seitenzahlen einfügen',
    previewLabel: 'Extrahierter Text',
    downloadButton: '.txt herunterladen',
    pageMarker: 'Seite {n}',
    scannedTitle: 'Kein Text in diesem PDF gefunden',
    scannedBody:
      'Dieses PDF scheint gescannt oder aus Bildern zusammengesetzt zu sein — es enthält keine eingebettete Textebene, daher gibt es nichts zu extrahieren. Dieses Werkzeug liest den Text, den ein PDF bereits enthält; es erkennt keinen Text in Bildern (OCR).',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported: 'Keine PDF-Datei ({name}).',
    errConversionFailed: 'Extraktion fehlgeschlagen',
    errPdfEncrypted: 'Dieses PDF ist passwortgeschützt (verschlüsselt).',
    errPdfUnreadable: 'Diese Datei ist kein lesbares PDF.',
    errDownloadFailed: 'Download fehlgeschlagen',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden verarbeitet …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'PDF ablegen, um den Text zu extrahieren',
    dzDropSub: 'Der Text wird im Browser extrahiert, nichts wird hochgeladen',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    close: 'Schließen',
  },
  es: {
    // ConversionManager
    uploadHeading: 'Seleccionar un PDF',
    uploadSubtitle: 'Elige un PDF para extraer su texto.',
    dropClick: 'Haz clic para elegir un archivo',
    dropOr: 'o suéltalo en cualquier parte de la página',
    dropSupported: 'Archivos PDF',
    extracting: 'Extrayendo texto…',
    extractingProgress: 'Extrayendo texto… (página {current} de {total})',
    pagesLabel: '{n} páginas',
    includePageNumbers: 'Incluir números de página',
    previewLabel: 'Texto extraído',
    downloadButton: 'Descargar .txt',
    pageMarker: 'Página {n}',
    scannedTitle: 'No se encontró texto en este PDF',
    scannedBody:
      'Este PDF parece estar escaneado o compuesto por imágenes: no tiene una capa de texto incrustada, así que no hay nada que extraer. Esta herramienta lee el texto que un PDF ya contiene; no reconoce texto dentro de imágenes (OCR).',
    notificationsAria: 'Notificaciones',
    errUnsupported: 'No es un archivo PDF ({name}).',
    errConversionFailed: 'La extracción falló',
    errPdfEncrypted: 'Este PDF está protegido con contraseña (cifrado).',
    errPdfUnreadable: 'Este archivo no es un PDF legible.',
    errDownloadFailed: 'La descarga falló',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // GlobalDropZone
    dzProcessing: 'Procesando {count} archivo(s)...',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un PDF para extraer su texto',
    dzDropSub: 'El texto se extrae en tu navegador, no se sube nada',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    close: 'Cerrar',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
