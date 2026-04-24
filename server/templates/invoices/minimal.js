import { getBaseStyles } from './_baseStyles.js'
import { getPattern } from './_patterns.js'
import { invoiceHelpers as h } from '../../services/invoiceHelpers.js'

export const minimalTemplate = (data) => {
  const { design } = data
  const primary = design.primary_color || '#000000'
  const accent = design.accent_color || '#1F2937'

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  ${getBaseStyles(design)}

  .minimal-page {
    padding: 25mm;
  }

  .minimal-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 25mm;
    padding-bottom: 8mm;
    border-bottom: 1px solid #E5E7EB;
  }

  .invoice-title {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 48pt;
    font-weight: 400;
    color: ${primary};
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .invoice-meta-right {
    text-align: right;
    font-size: 10pt;
    line-height: 1.8;
  }

  .invoice-meta-right .label {
    font-size: 8pt;
    color: ${accent};
    opacity: 0.5;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .invoice-meta-right .value {
    font-weight: 500;
    color: ${accent};
    margin-bottom: 3mm;
  }

  .parties-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20mm;
    margin-bottom: 20mm;
  }

  .party-block .label {
    font-size: 8pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${accent};
    opacity: 0.5;
    margin-bottom: 4mm;
    padding-bottom: 2mm;
    border-bottom: 1px solid #E5E7EB;
  }

  .party-block .name {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 18pt;
    font-weight: 600;
    color: ${primary};
    margin-bottom: 3mm;
    line-height: 1.2;
  }

  .party-block .details {
    font-size: 10pt;
    line-height: 1.7;
    color: ${accent};
  }

  .minimal-items {
    margin-bottom: 15mm;
  }

  .items-header {
    display: grid;
    grid-template-columns: 1fr 20mm 30mm 30mm;
    gap: 8mm;
    padding: 4mm 0;
    border-bottom: 2px solid ${primary};
    font-size: 8pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 700;
    color: ${primary};
  }

  .items-header .right {
    text-align: right;
  }

  .item-row {
    display: grid;
    grid-template-columns: 1fr 20mm 30mm 30mm;
    gap: 8mm;
    padding: 6mm 0;
    border-bottom: 1px solid #F3F4F6;
    align-items: flex-start;
  }

  .item-row .description-cell .title {
    font-size: 11pt;
    font-weight: 600;
    color: ${accent};
    margin-bottom: 1mm;
  }

  .item-row .description-cell .subtitle {
    font-size: 9pt;
    color: ${accent};
    opacity: 0.6;
  }

  .item-row .right {
    text-align: right;
    font-size: 11pt;
    color: ${accent};
  }

  .item-row .total-cell {
    font-weight: 600;
  }

  .totals-minimal {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 8mm;
    gap: 2mm;
  }

  .totals-minimal .row {
    display: flex;
    gap: 10mm;
    font-size: 10pt;
    color: ${accent};
  }

  .totals-minimal .row .label {
    opacity: 0.6;
  }

  .totals-minimal .row .amount {
    min-width: 35mm;
    text-align: right;
  }

  .totals-minimal .total-row {
    margin-top: 4mm;
    padding-top: 4mm;
    border-top: 2px solid ${primary};
    font-size: 14pt;
    font-weight: 700;
    color: ${primary};
  }

  .totals-minimal .total-row .amount {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 22pt;
    font-weight: 400;
  }

  .paid-stamp {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15mm 0;
    padding: 4mm;
    border: 2px solid ${primary};
    border-radius: 2mm;
  }

  .paid-stamp-inner {
    text-align: center;
  }

  .paid-stamp-label {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 16pt;
    color: ${primary};
    font-weight: 600;
    letter-spacing: 0.3em;
  }

  .paid-stamp-detail {
    font-size: 9pt;
    color: ${accent};
    opacity: 0.7;
    margin-top: 1mm;
  }

  .minimal-footer {
    position: absolute;
    bottom: 20mm;
    left: 25mm;
    right: 25mm;
    padding-top: 8mm;
    border-top: 1px solid #E5E7EB;
  }

  .footer-company {
    text-align: center;
    font-size: 10pt;
    font-weight: 500;
    color: ${primary};
    margin-bottom: 2mm;
  }

  .footer-legal {
    text-align: center;
    font-size: 7pt;
    color: ${accent};
    opacity: 0.5;
    line-height: 1.6;
  }
</style>
</head>
<body>
<div class="page minimal-page">

  <div class="minimal-header">
    <div class="invoice-title">Facture</div>
    <div class="invoice-meta-right">
      <div class="label">N°</div>
      <div class="value">${data.invoiceNumber}</div>
      <div class="label">Date</div>
      <div class="value">${h.formatDate(data.issueDate)}</div>
    </div>
  </div>

  <div class="parties-grid">
    <div class="party-block">
      <div class="label">Émetteur</div>
      <div class="name">${data.company.legalName || data.company.name}</div>
      <div class="details">
        ${data.company.addressLine1}<br/>
        ${data.company.addressLine2 ? `${data.company.addressLine2}<br/>` : ''}
        ${data.company.postalCode} ${data.company.city}<br/>
        ${data.company.country}
        ${data.company.email ? `<br/><br/>${data.company.email}` : ''}
      </div>
    </div>

    <div class="party-block">
      <div class="label">Destinataire</div>
      <div class="name">${data.customer.name}</div>
      <div class="details">
        ${data.customer.addressLine1}<br/>
        ${data.customer.addressLine2 ? `${data.customer.addressLine2}<br/>` : ''}
        ${data.customer.postalCode} ${data.customer.city}<br/>
        ${data.customer.country}
      </div>
    </div>
  </div>

  <div class="minimal-items">
    <div class="items-header">
      <div>Description</div>
      <div class="right">Qté</div>
      <div class="right">Prix HT</div>
      <div class="right">Total HT</div>
    </div>
    ${data.items.map(item => `
      <div class="item-row">
        <div class="description-cell">
          <div class="title">${item.description}</div>
          ${item.details ? `<div class="subtitle">${item.details}</div>` : ''}
        </div>
        <div class="right">${item.quantity}</div>
        <div class="right">${h.formatCurrency(item.unitPriceHT, data.currency)}</div>
        <div class="right total-cell">${h.formatCurrency(item.totalHT, data.currency)}</div>
      </div>
    `).join('')}
  </div>

  <div class="totals-minimal">
    <div class="row">
      <span class="label">Sous-total HT</span>
      <span class="amount">${h.formatCurrency(data.subtotalHT, data.currency)}</span>
    </div>
    <div class="row">
      <span class="label">TVA ${data.taxRate}%</span>
      <span class="amount">${h.formatCurrency(data.taxAmount, data.currency)}</span>
    </div>
    <div class="row total-row">
      <span class="label">Total TTC</span>
      <span class="amount">${h.formatCurrency(data.totalTTC, data.currency)}</span>
    </div>
  </div>

  ${data.paymentStatus === 'paid' ? `
    <div class="paid-stamp">
      <div class="paid-stamp-inner">
        <div class="paid-stamp-label">PAYÉE</div>
        <div class="paid-stamp-detail">${h.formatDate(data.paymentDate)} · ${data.paymentMethod}</div>
      </div>
    </div>
  ` : ''}

  <div class="minimal-footer">
    <div class="footer-company">${data.company.name}</div>
    <div class="footer-legal">
      ${data.legalMentions || ''}
      ${data.company.siret ? ` · SIRET ${data.company.siret}` : ''}
      ${data.company.vatNumber ? ` · TVA ${data.company.vatNumber}` : ''}
    </div>
  </div>

</div>
</body>
</html>
  `
}