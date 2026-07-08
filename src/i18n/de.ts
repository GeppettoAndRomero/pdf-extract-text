import type { ToolContent } from './types';

// Deutsch. Keine Wort-für-Wort-Übersetzung, sondern Transkreation auf Basis der
// Begriffe, die für PDF-Textextraktion tatsächlich verwendet werden. Keine
// Werbefloskeln (einfach / schnell / perfekt) — Datenschutz wird strukturell
// begründet, nicht versprochen (BRAND-OPERATING-MODEL / I18N-SEO-GUIDELINE).
// Register: informelles „du", wie bei kostenlosen Browser-Tools üblich.

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Text aus einem PDF extrahieren — im Browser, ohne Upload | runlocally',
    description:
      'Extrahiere den reinen Text aus einem PDF, seitenweise oder als eine Datei, direkt in deinem Browser. Die Datei wird auf deinem Gerät gelesen und nie hochgeladen. Open Source (MIT), funktioniert offline.',
    ogTitle: 'Text aus einem PDF extrahieren — im Browser, ohne Upload',
    ogDescription:
      'Extrahiere den im PDF eingebetteten Text in eine einfache .txt-Datei, im Browser. Nichts wird hochgeladen. Open Source, offline nutzbar.',
  },

  hero: {
    h1: 'Text aus einem PDF extrahieren',
    tagline:
      'Hol den Text aus einem PDF in eine einfache .txt-Datei — direkt im Browser. Nichts wird hochgeladen.',
  },

  intro: {
    h2: 'Text aus einem PDF extrahieren — direkt im Browser',
    paras: [
      'Ziehe ein PDF auf die Seite und dieses Tool liest den darin bereits eingebetteten Text, Seite für Seite — dieselbe Textebene, aus der dein PDF-Reader auswählen und kopieren lässt. Es wird nichts neu gesetzt oder umformatiert; die Wörter kommen in der Reihenfolge heraus, in der das PDF sie gespeichert hat.',
      'Das Ergebnis ist eine einzelne .txt-Datei zum Herunterladen, wahlweise mit einer Seitenzahl-Überschrift vor dem Text jeder Seite. Alles läuft im Browser mit pdfjs-dist; nichts wird hochgeladen und es findet keine OCR statt. Enthält ein PDF gar keinen eingebetteten Text — etwa eine gescannte Seite, die als Bild gespeichert wurde —, bekommst du eine klare Meldung statt einer leeren Datei.',
    ],
  },

  privacy: {
    h2: 'Warum deine Datei auf dem Gerät bleibt',
    lead: 'Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, zu dem etwas hochgeladen werden könnte:',
    points: [
      'Die Extraktion läuft vollständig in deinem Browser.',
      'Die Seite wird als statische Dateien ausgeliefert und sendet keine Anfrage mit deinem PDF.',
      'Der Quellcode ist offen und kann von allen eingesehen werden (MIT).',
      'Die Seite funktioniert offline – was nur möglich ist, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst, öffne beim Extrahieren das Netzwerk-Panel deines Browsers – keine Anfrage trägt deine Datei.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'PDF auswählen',
        p: 'Klicke, um ein PDF auszuwählen, oder ziehe es irgendwo auf die Seite. Der Text wird automatisch extrahiert.',
      },
      {
        h3: 'Extrahierten Text prüfen',
        p: 'Der Text erscheint in einer Vorschau. Mit „Seitenzahlen einfügen" fügst du vor jeder Seite eine Überschrift ein, oder du lässt es aus für einen durchgehenden Textblock.',
      },
      {
        h3: '.txt-Datei herunterladen',
        p: 'Lade das Ergebnis als einfache Textdatei herunter. Dein ursprüngliches PDF wird nie verändert oder hochgeladen.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird mein PDF irgendwohin hochgeladen?',
      a: 'Nein. Die Extraktion läuft vollständig in deinem Browser. Es gibt keine Serverkomponente, also gibt es für deine Datei keinen Weg vom Gerät. Der Quellcode ist offen und du kannst das im Netzwerk-Panel deines Browsers nachprüfen.',
    },
    {
      q: 'Warum steht dort „kein Text gefunden"?',
      a: 'Dieses PDF hat vermutlich keine eingebettete Textebene — zum Beispiel eine gescannte Seite oder ein Foto, das als PDF aus Bildern gespeichert wurde. Dieses Tool liest den Text, den ein PDF bereits enthält; es erkennt keinen Text in Bildern (OCR), daher gibt es bei solchen Dateien nichts zu extrahieren.',
    },
    {
      q: 'Bleiben Layout, Spalten oder Tabellen des Original-PDFs erhalten?',
      a: 'Der Text kommt in der Reihenfolge heraus, in der ihn das PDF gespeichert hat, was bei einfachen Dokumenten meist der normalen Lesereihenfolge entspricht. Bei PDFs mit mehreren Spalten oder komplexen Tabellen kann diese gespeicherte Reihenfolge leicht von der visuellen Lesereihenfolge abweichen, sodass sich Text aus nebeneinanderliegenden Spalten vermischen kann.',
    },
    {
      q: 'Kann es ein passwortgeschütztes PDF öffnen?',
      a: 'Nein. Verschlüsselte (passwortgeschützte) PDFs können nicht geöffnet werden, und du bekommst eine klare Meldung dazu. Entferne das Passwort zuerst in einem Reader, dem du vertraust, und extrahiere den Text dann hier.',
    },
    {
      q: 'Wird meine ursprüngliche PDF-Datei verändert?',
      a: 'Nein. Dieses Tool liest das PDF nur, um den Text herauszuholen — die Datei, die du ablegst, wird nie verändert oder neu gespeichert.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Das Tool ist eine PWA. Nach dem ersten Besuch wird es zwischengespeichert, sodass die Extraktion ohne Netzwerkverbindung funktioniert. Du kannst es auch zum Startbildschirm hinzufügen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
