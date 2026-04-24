import { getBaseStyles } from './_baseStyles.js'
import { getPattern } from './_patterns.js'
import { invoiceHelpers as h } from '../../services/invoiceHelpers.js'

export const modernTemplate = (data) => {
  const { design } = data
  const primary = design.primary_color || '#4A7C59'
  const secondary = design.secondary_color || '#FF8C69'
  const accent = design.accent_color || '#283618'
  
  const patternBg = getPattern(design.pattern || 'none', primary, design.pattern_opacity || 0.05)

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  ${getBaseStyles(design)}

  .modern-header {
    position: relative;
    padding: 20mm 18mm 15mm 18mm;
    background: linear-gradient(135deg, ${primary} 0%, ${accent} 100%);
    color: white;
    overflow: hidden;
  }

  .modern-header::before {
    content: '';
    position: absolute;
    top: -50mm;
    right: -50mm;
    width: 120mm;
    height: 120mm;
    background: ${secondary};
    opacity: 0.15;
    border-radius: 50%;
  }

  .modern-header::after {
    content: '';
    position: absolute;
    bottom: -30mm;
    left: -30mm;
    width: 80mm;
    height: 80mm;
    background: ${primary};
    opacity: 0.2;
    border-radius: 50%;
  }

  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .invoice-title-block {
    max-width: 60%;
  }

  .invoice-label {
    font-size: 9pt;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.85;
    margin-bottom: 6mm;
    font-weight: 600;
  }

  .invoice-number {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 32pt;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4mm;
  }

  .invoice-date {
    font-size: 10pt;
    opacity: 0.9;
  }

  .company-block {
    text-align: right;
    font-size: 9pt;
    line-height: 1.7;
  }

  .company-name {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 14pt;
    font-weight: 700;
    margin-bottom: 3mm;
  }

  .pattern-bg {
    background-image: ${patternBg};
  }

  .body-section {
    padding: 18mm;
    position: relative;
  }

  .addresses-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10mm;
    margin-bottom: 15mm;
  }

  .address-card {
    background: white;
    border-radius: 4mm;
    padding: 8mm;
    border-left: 4px solid ${primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .address-card.customer {
    border-left-color: ${secondary};
  }

  .address-label {
    font-size: 8pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${primary};
    font-weight: 700;
    margin-bottom: 3mm;
  }

  .address-card.customer .address-label {
    color: ${secondary};
  }

  .address-name {
    font-size: 12pt;
    font-weight: 700;
    color: ${accent};
    margin-bottom: 2mm;
  }

  .address-detail {
    font-size: 9pt;
    line-height: 1.6;
    color: ${accent};
    opacity: 0.8;
  }

  .items-section {
    margin-bottom: 12mm;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 4mm;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  .items-table thead {
    background: linear-gradient(135deg, ${primary}, ${accent});
    color: white;
  }

  .items-table th {
    padding: 4mm 5mm;
    text-align: left;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .items-table th.text-right {
    text-align: right;
  }

  .items-table td {
    padding: 5mm;
    border-bottom: 1px solid #F3F4F6;
    font-size: 10pt;
  }

  .items-table tbody tr:last-child td {
    border-bottom: none;
  }

  .items-table td.text-right {
    text-align: right;
  }

  .item-title {
    font-weight: 600;
    color: ${accent};
    margin-bottom: 1mm;
  }

  .item-details {
    font-size: 8pt;
    color: ${accent};
    opacity: 0.6;
  }

  .totals-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 8mm;
  }

  .totals-box {
    width: 85mm;
    background: white;
    border-radius: 4mm;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }

  .totals-row {
    display: flex;
    justify-content: space-between;
    padding: 3mm 6mm;
    font-size: 10pt;
  }

  .totals-row.subtotal {
    border-bottom: 1px solid #F3F4F6;
  }

  .totals-row.tax {
    border-bottom: 1px solid #F3F4F6;
    color: ${accent};
    opacity: 0.7;
  }

  .totals-row.total {
    background: linear-gradient(135deg, ${primary}, ${accent});
    color: white;
    padding: 5mm 6mm;
    font-size: 14pt;
    font-weight: 700;
  }

  .totals-row.total .amount {
    font-family: '${design.title_font || 'Playfair Display'}', serif;
    font-size: 18pt;
  }

  .payment-badge {
    display: inline-flex;
    align-items: center;
    gap: 2mm;
    margin-top: 8mm;
    padding: 2mm 4mm;
    background: rgba(74, 124, 89, 0.1);
    color: ${primary};
    border-radius: 999px;
    font-size: 9pt;
    font-weight: 600;
  }

  .payment-badge::before {
    content: '✓';
    display: inline-block;
    width: 4mm;
    height: 4mm;
    background: ${primary};
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 4mm;
    font-size: 7pt;
  }

  .footer {
    margin-top: 15mm;
    padding-top: 8mm;
    border-top: 2px solid #F3F4F6;
    font-size: 8pt;
    color: ${accent};
    opacity: 0.6;
    line-height: 1.6;
  }

  .footer-notes {
    margin-bottom: 6mm;
    font-style: italic;
    color: ${primary};
    opacity: 0.8;
    font-size: 9pt;
  }

  .legal-mentions {
    font-size: 7pt;
    line-height: 1.5;
  }

  .page-number {
    position: absolute;
    bottom: 8mm;
    right: 18mm;
    font-size: 8pt;
    color: ${accent};
    opacity: 0.5;
  }
</style>
</head>
<body>
<div class="page pattern-bg">

  <!-- HEADER -->
  <div class="modern-header">
    <div class="header-content">
      <div class="invoice-title-block">
        <div class="invoice-label">Facture</div>
        <div class="invoice-number">${data.invoiceNumber}</div>
        <div class="invoice-date">Émise le ${h.formatDate(data.issueDate)}</div>
      </div>
      <div class="company-block">
        <div class="company-name">${data.company.name}</div>
        <div>${data.company.addressLine1}</div>
        ${data.company.addressLine2 ? `<div>${data.company.addressLine2}</div>` : ''}
        <div>${data.company.postalCode} ${data.company.city}</div>
        <div>${data.company.country}</div>
        ${data.company.email ? `<div style="margin-top: 2mm;">${data.company.email}</div>` : ''}
        ${data.company.phone ? `<div>${data.company.phone}</div>` : ''}
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body-section">
    
    <!-- ADDRESSES -->
    <div class="addresses-grid">
      <div class="address-card">
        <div class="address-label">Émetteur</div>
        <div class="address-name">${data.company.legalName || data.company.name}</div>
        <div class="address-detail">
          ${data.company.addressLine1}<br/>
          ${data.company.addressLine2 ? `${data.company.addressLine2}<br/>` : ''}
          ${data.company.postalCode} ${data.company.city}<br/>
          ${data.company.country}
          ${data.company.siret ? `<br/><span style="font-size: 8pt;">SIRET : ${data.company.siret}</span>` : ''}
          ${data.company.vatNumber ? `<br/><span style="font-size: 8pt;">TVA : ${data.company.vatNumber}</span>` : ''}
        </div>
      </div>

      <div class="address-card customer">
        <div class="address-label">Facturé à</div>
        <div class="address-name">${data.customer.name}</div>
        <div class="address-detail">
          ${data.customer.addressLine1}<br/>
          ${data.customer.addressLine2 ? `${data.customer.addressLine2}<br/>` : ''}
          ${data.customer.postalCode} ${data.customer.city}<br/>
          ${data.customer.country}
          ${data.customer.email ? `<br/><span style="font-size: 8pt;">${data.customer.email}</span>` : ''}
        </div>
      </div>
    </div>

    <!-- ITEMS -->
    <div class="items-section">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 50%;">Description</th>
            <th class="text-right" style="width: 10%;">Qté</th>
            <th class="text-right" style="width: 20%;">Prix unitaire HT</th>
            <th class="text-right" style="width: 20%;">Total HT</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>
                <div class="item-title">${item.description}</div>
                <div class="item-details">${item.details || ''}</div>
              </td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${h.formatCurrency(item.unitPriceHT, data.currency)}</td>
              <td class="text-right">${h.formatCurrency(item.totalHT, data.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- TOTALS -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="totals-row subtotal">
          <span>Sous-total HT</span>
          <span class="font-semibold">${h.formatCurrency(data.subtotalHT, data.currency)}</span>
        </div>
        <div class="totals-row tax">
          <span>TVA (${data.taxRate}%)</span>
          <span>${h.formatCurrency(data.taxAmount, data.currency)}</span>
        </div>
        <div class="totals-row total">
          <span>Total TTC</span>
          <span class="amount">${h.formatCurrency(data.totalTTC, data.currency)}</span>
        </div>
      </div>
    </div>

    ${data.paymentStatus === 'paid' ? `
      <div class="payment-badge">
        Payée le ${h.formatDate(data.paymentDate)} · ${data.paymentMethod}
      </div>
    ` : ''}

    <!-- FOOTER -->
    <div class="footer">
      ${data.notes ? `<div class="footer-notes">${data.notes}</div>` : ''}
      
      <div class="legal-mentions">
        ${data.legalMentions || ''}
        ${data.company.siret ? `<br/>SIRET : ${data.company.siret}` : ''}
        ${data.company.rcs ? ` · RCS ${data.company.rcs}` : ''}
        ${data.company.capital ? ` · Capital : ${data.company.capital}` : ''}
        ${data.company.apeCode ? ` · APE ${data.company.apeCode}` : ''}
      </div>
    </div>
  </div>

  <div class="page-number">Page 1/1</div>
</div>
</body>
</html>
  `
}