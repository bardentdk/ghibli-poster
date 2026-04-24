import { getBaseStyles } from './_baseStyles.js'
import { getPattern } from './_patterns.js'
import { invoiceHelpers as h } from '../../services/invoiceHelpers.js'

export const classicTemplate = (data) => {
  const { design } = data
  const primary = design.primary_color || '#1E3A8A'
  const accent = design.accent_color || '#111827'

  const patternBg = getPattern(design.pattern || 'none', primary, design.pattern_opacity || 0.03)

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  ${getBaseStyles(design)}

  .classic-page {
    padding: 20mm 18mm;
    background-image: ${patternBg};
  }

  .classic-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 10mm;
    border-bottom: 3px double ${primary};
    margin-bottom: 12mm;
  }

  .company-header {
    max-width: 60%;
  }

  .company-name {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 22pt;
    font-weight: 700;
    color: ${primary};
    margin-bottom: 2mm;
  }

  .company-tagline {
    font-size: 9pt;
    color: ${accent};
    opacity: 0.7;
    font-style: italic;
    margin-bottom: 4mm;
  }

  .company-details {
    font-size: 9pt;
    line-height: 1.6;
    color: ${accent};
  }

  .invoice-header-right {
    text-align: right;
  }

  .invoice-stamp {
    display: inline-block;
    padding: 4mm 8mm;
    border: 3px double ${primary};
    color: ${primary};
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 24pt;
    font-weight: 700;
    margin-bottom: 4mm;
    letter-spacing: 0.1em;
  }

  .invoice-meta {
    font-size: 10pt;
    line-height: 1.8;
    color: ${accent};
  }

  .invoice-meta strong {
    color: ${primary};
    font-weight: 700;
  }

  .addresses-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
    margin-bottom: 12mm;
  }

  .address-block h3 {
    font-size: 9pt;
    font-weight: 700;
    color: ${primary};
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding-bottom: 2mm;
    margin-bottom: 3mm;
    border-bottom: 1px solid ${primary};
  }

  .address-block {
    font-size: 10pt;
    line-height: 1.7;
  }

  .address-block .name {
    font-weight: 700;
    font-size: 11pt;
    color: ${accent};
    margin-bottom: 1mm;
  }

  .classic-items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10mm;
    border: 1px solid ${primary};
  }

  .classic-items-table thead {
    background: ${primary};
    color: white;
  }

  .classic-items-table th {
    padding: 3mm 4mm;
    text-align: left;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  .classic-items-table th:last-child {
    border-right: none;
  }

  .classic-items-table th.text-right {
    text-align: right;
  }

  .classic-items-table td {
    padding: 4mm;
    border-bottom: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    font-size: 10pt;
    vertical-align: top;
  }

  .classic-items-table td:last-child {
    border-right: none;
  }

  .classic-items-table td.text-right {
    text-align: right;
  }

  .classic-items-table tbody tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .item-description strong {
    color: ${primary};
    font-weight: 700;
  }

  .item-description small {
    display: block;
    margin-top: 1mm;
    color: ${accent};
    opacity: 0.6;
    font-size: 8pt;
  }

  .totals-table {
    width: 80mm;
    margin-left: auto;
    border-collapse: collapse;
    border: 1px solid ${primary};
  }

  .totals-table td {
    padding: 3mm 5mm;
    font-size: 10pt;
    border-bottom: 1px solid #E5E7EB;
  }

  .totals-table td:first-child {
    text-align: left;
    color: ${accent};
  }

  .totals-table td:last-child {
    text-align: right;
    font-weight: 600;
  }

  .totals-table tr:last-child td {
    background: ${primary};
    color: white;
    padding: 4mm 5mm;
    font-size: 12pt;
    font-weight: 700;
    border-bottom: none;
  }

  .payment-info {
    margin-top: 10mm;
    padding: 6mm 8mm;
    background: rgba(30, 58, 138, 0.05);
    border-left: 4px solid ${primary};
    font-size: 10pt;
  }

  .payment-info strong {
    color: ${primary};
  }

  .classic-footer {
    margin-top: 15mm;
    padding-top: 8mm;
    border-top: 1px solid ${primary};
    text-align: center;
  }

  .classic-footer .notes {
    font-style: italic;
    color: ${primary};
    margin-bottom: 5mm;
    font-size: 10pt;
  }

  .classic-footer .legal {
    font-size: 7pt;
    line-height: 1.6;
    color: ${accent};
    opacity: 0.6;
  }
</style>
</head>
<body>
<div class="page classic-page">

  <div class="classic-header">
    <div class="company-header">
      <div class="company-name">${data.company.name}</div>
      ${data.company.legalName && data.company.legalName !== data.company.name 
        ? `<div class="company-tagline">${data.company.legalName}</div>` 
        : ''}
      <div class="company-details">
        ${data.company.addressLine1}<br/>
        ${data.company.addressLine2 ? `${data.company.addressLine2}<br/>` : ''}
        ${data.company.postalCode} ${data.company.city}, ${data.company.country}
        ${data.company.phone ? `<br/>Tél : ${data.company.phone}` : ''}
        ${data.company.email ? `<br/>${data.company.email}` : ''}
      </div>
    </div>

    <div class="invoice-header-right">
      <div class="invoice-stamp">FACTURE</div>
      <div class="invoice-meta">
        <div><strong>N° :</strong> ${data.invoiceNumber}</div>
        <div><strong>Date :</strong> ${h.formatDate(data.issueDate)}</div>
        <div><strong>Commande :</strong> ${data.orderNumber}</div>
      </div>
    </div>
  </div>

  <div class="addresses-section">
    <div class="address-block">
      <h3>Émetteur</h3>
      <div class="name">${data.company.legalName || data.company.name}</div>
      <div>
        ${data.company.addressLine1}<br/>
        ${data.company.postalCode} ${data.company.city}<br/>
        ${data.company.country}
      </div>
      ${data.company.siret ? `<div style="margin-top: 2mm; font-size: 9pt;">SIRET : ${data.company.siret}</div>` : ''}
      ${data.company.vatNumber ? `<div style="font-size: 9pt;">N° TVA : ${data.company.vatNumber}</div>` : ''}
    </div>

    <div class="address-block">
      <h3>Facturé à</h3>
      <div class="name">${data.customer.name}</div>
      <div>
        ${data.customer.addressLine1}<br/>
        ${data.customer.addressLine2 ? `${data.customer.addressLine2}<br/>` : ''}
        ${data.customer.postalCode} ${data.customer.city}<br/>
        ${data.customer.country}
      </div>
      ${data.customer.email ? `<div style="margin-top: 2mm; font-size: 9pt;">${data.customer.email}</div>` : ''}
    </div>
  </div>

  <table class="classic-items-table">
    <thead>
      <tr>
        <th style="width: 50%;">Désignation</th>
        <th class="text-right" style="width: 10%;">Qté</th>
        <th class="text-right" style="width: 15%;">P.U. HT</th>
        <th class="text-right" style="width: 10%;">TVA</th>
        <th class="text-right" style="width: 15%;">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map(item => `
        <tr>
          <td class="item-description">
            <strong>${item.description}</strong>
            ${item.details ? `<small>${item.details}</small>` : ''}
          </td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${h.formatCurrency(item.unitPriceHT, data.currency)}</td>
          <td class="text-right">${item.taxRate}%</td>
          <td class="text-right">${h.formatCurrency(item.totalHT, data.currency)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <table class="totals-table">
    <tr>
      <td>Total HT</td>
      <td>${h.formatCurrency(data.subtotalHT, data.currency)}</td>
    </tr>
    <tr>
      <td>TVA (${data.taxRate}%)</td>
      <td>${h.formatCurrency(data.taxAmount, data.currency)}</td>
    </tr>
    <tr>
      <td>Total TTC</td>
      <td>${h.formatCurrency(data.totalTTC, data.currency)}</td>
    </tr>
  </table>

  ${data.paymentStatus === 'paid' ? `
    <div class="payment-info">
      <strong>✓ FACTURE RÉGLÉE</strong> - Paiement effectué le ${h.formatDate(data.paymentDate)} par ${data.paymentMethod}.
    </div>
  ` : ''}

  <div class="classic-footer">
    ${data.notes ? `<div class="notes">${data.notes}</div>` : ''}
    <div class="legal">
      ${data.legalMentions || ''}
      ${data.company.siret ? `<br/>SIRET : ${data.company.siret}` : ''}
      ${data.company.rcs ? ` - RCS ${data.company.rcs}` : ''}
      ${data.company.capital ? ` - Capital : ${data.company.capital}` : ''}
      ${data.company.apeCode ? ` - Code APE : ${data.company.apeCode}` : ''}
    </div>
  </div>

</div>
</body>
</html>
  `
}