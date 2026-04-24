import { getBaseStyles } from './_baseStyles.js'
import { getPattern } from './_patterns.js'
import { invoiceHelpers as h } from '../../services/invoiceHelpers.js'

export const creativeTemplate = (data) => {
  const { design } = data
  const primary = design.primary_color || '#7C3AED'
  const secondary = design.secondary_color || '#EC4899'
  const accent = design.accent_color || '#1F2937'

  const patternBg = getPattern(design.pattern || 'hexagons', primary, 0.08)

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  ${getBaseStyles(design)}

  .creative-page {
    position: relative;
    overflow: hidden;
  }

  .creative-bg {
    position: absolute;
    inset: 0;
    background-image: ${patternBg};
    z-index: 0;
  }

  .shape-1 {
    position: absolute;
    top: -60mm;
    right: -60mm;
    width: 180mm;
    height: 180mm;
    background: linear-gradient(135deg, ${primary}, ${secondary});
    border-radius: 50%;
    opacity: 0.1;
    z-index: 0;
  }

  .shape-2 {
    position: absolute;
    bottom: -80mm;
    left: -40mm;
    width: 150mm;
    height: 150mm;
    background: linear-gradient(135deg, ${secondary}, ${primary});
    border-radius: 50%;
    opacity: 0.08;
    z-index: 0;
  }

  .creative-content {
    position: relative;
    z-index: 1;
    padding: 18mm;
  }

  .creative-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10mm;
    margin-bottom: 15mm;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .creative-label {
    display: inline-block;
    padding: 2mm 5mm;
    background: linear-gradient(135deg, ${primary}, ${secondary});
    color: white;
    border-radius: 999px;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    align-self: flex-start;
    margin-bottom: 5mm;
  }

  .creative-number {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 52pt;
    font-weight: 800;
    line-height: 0.9;
    background: linear-gradient(135deg, ${primary}, ${secondary});
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 3mm;
  }

  .creative-date {
    font-size: 11pt;
    color: ${accent};
    opacity: 0.7;
  }

  .header-right {
    background: white;
    padding: 6mm;
    border-radius: 4mm;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    min-width: 60mm;
  }

  .company-card-name {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 14pt;
    font-weight: 700;
    color: ${primary};
    margin-bottom: 2mm;
  }

  .company-card-details {
    font-size: 9pt;
    line-height: 1.6;
    color: ${accent};
  }

  .info-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8mm;
    margin-bottom: 12mm;
  }

  .info-card {
    position: relative;
    background: white;
    padding: 8mm;
    border-radius: 4mm;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  .info-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3mm;
    background: linear-gradient(90deg, ${primary}, ${secondary});
  }

  .info-card-label {
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${primary};
    margin-bottom: 3mm;
    margin-top: 1mm;
  }

  .info-card.billing::before {
    background: linear-gradient(90deg, ${secondary}, ${primary});
  }

  .info-card.billing .info-card-label {
    color: ${secondary};
  }

  .info-card-name {
    font-size: 12pt;
    font-weight: 700;
    color: ${accent};
    margin-bottom: 2mm;
  }

  .info-card-details {
    font-size: 9pt;
    line-height: 1.7;
    color: ${accent};
    opacity: 0.8;
  }

  .creative-items {
    background: white;
    border-radius: 4mm;
    padding: 8mm;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    margin-bottom: 10mm;
  }

  .items-title {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 16pt;
    font-weight: 700;
    color: ${primary};
    margin-bottom: 5mm;
  }

  .creative-item-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 6mm;
    align-items: center;
    padding: 4mm;
    border-radius: 3mm;
    transition: background 0.2s;
  }

  .creative-item-row:not(:last-child) {
    margin-bottom: 2mm;
    border-bottom: 1px solid #F3F4F6;
  }

  .item-icon {
    width: 10mm;
    height: 10mm;
    background: linear-gradient(135deg, ${primary}20, ${secondary}20);
    border-radius: 2mm;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${primary};
    font-weight: 700;
    font-size: 12pt;
  }

  .item-description-block {
    display: flex;
    align-items: center;
    gap: 4mm;
  }

  .item-text .title {
    font-size: 11pt;
    font-weight: 600;
    color: ${accent};
    margin-bottom: 1mm;
  }

  .item-text .subtitle {
    font-size: 8pt;
    color: ${accent};
    opacity: 0.6;
  }

  .item-qty, .item-price {
    font-size: 10pt;
    color: ${accent};
    text-align: right;
    min-width: 18mm;
  }

  .item-total {
    font-size: 12pt;
    font-weight: 700;
    color: ${primary};
    text-align: right;
    min-width: 25mm;
  }

  .creative-totals {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10mm;
    margin-bottom: 10mm;
  }

  .payment-status-card {
    background: linear-gradient(135deg, ${primary}, ${secondary});
    color: white;
    padding: 8mm;
    border-radius: 4mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .payment-status-card .icon {
    width: 12mm;
    height: 12mm;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4mm;
    font-size: 18pt;
    font-weight: 700;
  }

  .payment-status-card .label {
    font-size: 9pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.9;
    margin-bottom: 2mm;
  }

  .payment-status-card .value {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 20pt;
    font-weight: 700;
    margin-bottom: 2mm;
  }

  .payment-status-card .detail {
    font-size: 9pt;
    opacity: 0.85;
  }

  .totals-card {
    background: white;
    padding: 6mm;
    border-radius: 4mm;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    min-width: 80mm;
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    padding: 2mm 0;
    font-size: 10pt;
  }

  .total-line .label {
    color: ${accent};
    opacity: 0.7;
  }

  .total-line .value {
    font-weight: 600;
    color: ${accent};
  }

  .total-line.final {
    margin-top: 3mm;
    padding-top: 4mm;
    border-top: 2px solid ${primary};
    font-size: 14pt;
  }

  .total-line.final .label {
    font-weight: 700;
    color: ${primary};
    opacity: 1;
  }

  .total-line.final .value {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 22pt;
    font-weight: 700;
    color: ${primary};
  }

  .creative-footer {
    text-align: center;
    padding-top: 8mm;
    border-top: 2px dashed ${primary}40;
  }

  .creative-footer .notes {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 13pt;
    font-style: italic;
    color: ${primary};
    margin-bottom: 5mm;
  }

  .creative-footer .legal {
    font-size: 7pt;
    line-height: 1.6;
    color: ${accent};
    opacity: 0.5;
  }
</style>
</head>
<body>
<div class="page creative-page">
  <div class="creative-bg"></div>
  <div class="shape-1"></div>
  <div class="shape-2"></div>

  <div class="creative-content">
    <div class="creative-header">
      <div class="header-left">
        <div>
          <div class="creative-label">Facture</div>
          <div class="creative-number">${data.invoiceNumber}</div>
          <div class="creative-date">Émise le ${h.formatDate(data.issueDate)} · Commande ${data.orderNumber}</div>
        </div>
      </div>

      <div class="header-right">
        <div class="company-card-name">${data.company.name}</div>
        <div class="company-card-details">
          ${data.company.addressLine1}<br/>
          ${data.company.postalCode} ${data.company.city}<br/>
          ${data.company.country}
          ${data.company.email ? `<br/>${data.company.email}` : ''}
        </div>
      </div>
    </div>

    <div class="info-cards">
      <div class="info-card">
        <div class="info-card-label">Émetteur</div>
        <div class="info-card-name">${data.company.legalName || data.company.name}</div>
        <div class="info-card-details">
          ${data.company.addressLine1}<br/>
          ${data.company.postalCode} ${data.company.city}<br/>
          ${data.company.country}
          ${data.company.siret ? `<br/><br/>SIRET : ${data.company.siret}` : ''}
          ${data.company.vatNumber ? `<br/>TVA : ${data.company.vatNumber}` : ''}
        </div>
      </div>

      <div class="info-card billing">
        <div class="info-card-label">Facturé à</div>
        <div class="info-card-name">${data.customer.name}</div>
        <div class="info-card-details">
          ${data.customer.addressLine1}<br/>
          ${data.customer.addressLine2 ? `${data.customer.addressLine2}<br/>` : ''}
          ${data.customer.postalCode} ${data.customer.city}<br/>
          ${data.customer.country}
          ${data.customer.email ? `<br/><br/>${data.customer.email}` : ''}
        </div>
      </div>
    </div>

    <div class="creative-items">
      <div class="items-title">Détails de la commande</div>
      ${data.items.map((item, i) => `
        <div class="creative-item-row">
          <div class="item-description-block">
            <div class="item-icon">${i + 1}</div>
            <div class="item-text">
              <div class="title">${item.description}</div>
              ${item.details ? `<div class="subtitle">${item.details}</div>` : ''}
            </div>
          </div>
          <div class="item-qty">Qté ${item.quantity}</div>
          <div class="item-price">${h.formatCurrency(item.unitPriceHT, data.currency)}</div>
          <div class="item-total">${h.formatCurrency(item.totalHT, data.currency)}</div>
        </div>
      `).join('')}
    </div>

    <div class="creative-totals">
      ${data.paymentStatus === 'paid' ? `
        <div class="payment-status-card">
          <div class="icon">✓</div>
          <div class="label">Statut du paiement</div>
          <div class="value">Facture payée</div>
          <div class="detail">Le ${h.formatDate(data.paymentDate)} par ${data.paymentMethod}</div>
        </div>
      ` : '<div></div>'}

      <div class="totals-card">
        <div class="total-line">
          <span class="label">Sous-total HT</span>
          <span class="value">${h.formatCurrency(data.subtotalHT, data.currency)}</span>
        </div>
        <div class="total-line">
          <span class="label">TVA ${data.taxRate}%</span>
          <span class="value">${h.formatCurrency(data.taxAmount, data.currency)}</span>
        </div>
        <div class="total-line final">
          <span class="label">Total TTC</span>
          <span class="value">${h.formatCurrency(data.totalTTC, data.currency)}</span>
        </div>
      </div>
    </div>

    <div class="creative-footer">
      ${data.notes ? `<div class="notes">« ${data.notes} »</div>` : ''}
      <div class="legal">
        ${data.legalMentions || ''}
        ${data.company.siret ? ` · SIRET ${data.company.siret}` : ''}
        ${data.company.rcs ? ` · RCS ${data.company.rcs}` : ''}
        ${data.company.vatNumber ? ` · TVA ${data.company.vatNumber}` : ''}
      </div>
    </div>
  </div>
</div>
</body>
</html>
  `
}