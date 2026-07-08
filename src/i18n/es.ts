import type { ToolContent } from './types';

// Español. Transcreación basada en el vocabulario que se usa realmente para
// extraer texto de un PDF, no traducción literal. Sin palabras publicitarias
// (fácil / rápido / perfecto…); la privacidad se explica de forma estructural,
// no como promesa. Español pan-regional (España y Latinoamérica), registro «tú».

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Extraer el texto de un PDF — en tu navegador, sin subir nada | runlocally',
    description:
      'Saca el texto de un PDF, página por página o como un solo archivo, directamente en tu navegador. El archivo se lee en tu dispositivo y no se sube a ningún sitio. Código abierto (MIT), funciona sin conexión.',
    ogTitle: 'Extraer el texto de un PDF — en tu navegador, sin subir nada',
    ogDescription:
      'Extrae el texto ya incrustado en un PDF a un archivo .txt sencillo, en tu navegador. No se sube nada. Código abierto, funciona sin conexión.',
  },

  hero: {
    h1: 'Extraer el texto de un PDF',
    tagline: 'Saca el texto de un PDF a un archivo .txt sencillo, en tu navegador. No se sube nada.',
  },

  intro: {
    h2: 'Extraer el texto de un PDF, en tu navegador',
    paras: [
      'Suelta un PDF y esta herramienta lee el texto que ya lleva incrustado, página por página: la misma capa de texto que tu lector de PDF te deja seleccionar y copiar. No recompone ni reformatea nada; saca las palabras en el orden en que el PDF las guardó.',
      'El resultado es un único archivo .txt que puedes descargar, con un encabezado de número de página opcional antes del texto de cada página. Todo se ejecuta en el navegador con pdfjs-dist; no se sube nada y no se hace OCR. Si un PDF no tiene ningún texto incrustado —una página escaneada guardada como imagen, por ejemplo—, verás un mensaje claro en lugar de un archivo vacío.',
    ],
  },

  privacy: {
    h2: 'Por qué tu archivo no sale de tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay un paso de subida porque no hay ningún servidor al que subir nada:',
    points: [
      'La extracción se ejecuta por completo en tu navegador.',
      'La página se sirve como archivos estáticos y no envía ninguna petición con tu PDF.',
      'El código es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de Red de tu navegador mientras extraes el texto: ninguna petición lleva tu archivo.',
    sourceLinkText: 'Leer el código fuente.',
  },

  howto: {
    h2: 'Cómo se usa',
    steps: [
      {
        h3: 'Elige un PDF',
        p: 'Haz clic para seleccionar un PDF, o suéltalo en cualquier parte de la página. Su texto se extrae automáticamente.',
      },
      {
        h3: 'Revisa el texto extraído',
        p: 'El texto aparece en un cuadro de vista previa. Activa «Incluir números de página» para añadir un encabezado antes de cada página, o desactívalo para obtener un bloque de texto continuo.',
      },
      {
        h3: 'Descarga el archivo .txt',
        p: 'Descarga el resultado como un archivo de texto plano. Tu PDF original nunca se modifica ni se sube.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi PDF a algún sitio?',
      a: 'No. La extracción se ejecuta por completo en tu navegador. No hay ningún componente de servidor, así que tu archivo no tiene forma de salir del dispositivo. El código es abierto y puedes confirmarlo en el panel de Red de tu navegador.',
    },
    {
      q: '¿Por qué dice que «no se encontró texto»?',
      a: 'Es probable que ese PDF no tenga una capa de texto incrustada, por ejemplo si es una página escaneada o una foto guardada como PDF de imágenes. Esta herramienta lee el texto que un PDF ya contiene; no reconoce texto dentro de imágenes (OCR), así que no hay nada que extraer en ese tipo de archivo.',
    },
    {
      q: '¿Conserva el diseño, las columnas o las tablas del PDF original?',
      a: 'El texto sale en el orden en que el PDF lo guardó, que suele coincidir con el orden de lectura normal en documentos sencillos. En PDFs con varias columnas o tablas complejas, ese orden guardado puede diferir un poco del orden de lectura visual, por lo que el texto de columnas contiguas puede entremezclarse.',
    },
    {
      q: '¿Puede abrir un PDF protegido con contraseña?',
      a: 'No. Los PDF cifrados (protegidos con contraseña) no se pueden abrir, y verás un mensaje claro que lo indica. Quita antes la contraseña en un lector de confianza y luego extrae el texto aquí.',
    },
    {
      q: '¿Cambia mi archivo PDF original?',
      a: 'No. Esta herramienta solo lee el PDF para sacar su texto: el archivo que sueltas nunca se modifica ni se vuelve a guardar.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda guardada en la caché, de modo que la extracción funciona sin conexión a la red. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con ayuda de IA; la revisión y las decisiones son del responsable del proyecto.',
    securityText: 'Seguridad',
  },
};
