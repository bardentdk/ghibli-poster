export const getBaseStyles = (design) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: A4;
    margin: 0;
  }

  html, body {
    width: 210mm;
    min-height: 297mm;
    font-family: '${design.body_font || 'Inter'}', -apple-system, sans-serif;
    color: ${design.text_color || '#1F2937'};
    background: ${design.background_color || '#FFFFFF'};
    font-size: 10pt;
    line-height: 1.5;
  }

  .title-font {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
  }

  .body-font {
    font-family: '${design.body_font || 'Inter'}', sans-serif;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 0;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  .text-primary { color: ${design.primary_color}; }
  .text-secondary { color: ${design.secondary_color}; }
  .text-accent { color: ${design.accent_color}; }
  .text-muted { color: ${design.text_color}; opacity: 0.6; }

  .bg-primary { background-color: ${design.primary_color}; }
  .bg-secondary { background-color: ${design.secondary_color}; }
  .bg-accent { background-color: ${design.accent_color}; }

  .uppercase { text-transform: uppercase; letter-spacing: 0.1em; }
  .text-xs { font-size: 8pt; }
  .text-sm { font-size: 9pt; }
  .text-base { font-size: 10pt; }
  .text-lg { font-size: 11pt; }
  .text-xl { font-size: 13pt; }
  .text-2xl { font-size: 16pt; }
  .text-3xl { font-size: 22pt; }
  .text-4xl { font-size: 28pt; }
  .text-5xl { font-size: 36pt; }

  .font-light { font-weight: 300; }
  .font-normal { font-weight: 400; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-black { font-weight: 800; }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 120pt;
    font-weight: 900;
    color: ${design.primary_color};
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
  }
`