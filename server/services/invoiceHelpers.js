export const invoiceHelpers = {
  formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  },

  formatDate(date) {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  },

  formatDateShort(date) {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  },

  /**
   * Calcule le HT à partir du TTC (les prix Stripe sont en TTC)
   */
  calculateHT(ttc, taxRate) {
    return ttc / (1 + taxRate / 100)
  },

  /**
   * Calcule le montant de TVA
   */
  calculateTax(ttc, taxRate) {
    const ht = this.calculateHT(ttc, taxRate)
    return ttc - ht
  },

  /**
   * Prépare les données complètes de la facture
   */
  prepareInvoiceData({ order, poster, customer, company, invoiceSettings, designConfig, invoiceNumber, issueDate }) {
    const taxRate = invoiceSettings?.default_tax_rate || 20
    const totalTTC = order.total_amount
    const subtotalHT = this.calculateHT(totalTTC, taxRate)
    const taxAmount = totalTTC - subtotalHT

    const items = [
      {
        description: `Affiche Ghibli personnalisée - ${poster?.title || 'Sans titre'}`,
        details: this.getFormatDetails(order.format),
        quantity: order.quantity || 1,
        unitPriceHT: subtotalHT / (order.quantity || 1),
        unitPriceTTC: order.unit_price,
        totalHT: subtotalHT,
        totalTTC: totalTTC,
        taxRate,
      },
    ]

    return {
      invoiceNumber,
      issueDate: issueDate || new Date(),
      dueDate: issueDate || new Date(),
      paymentStatus: 'paid',
      paymentDate: order.paid_at || order.created_at,
      paymentMethod: 'Carte bancaire (Stripe)',

      company: {
        name: company?.name || 'Ghibli Poster Studio',
        legalName: company?.legal_name || company?.name,
        addressLine1: company?.address_line1 || '',
        addressLine2: company?.address_line2 || '',
        postalCode: company?.postal_code || '',
        city: company?.city || '',
        country: company?.country || 'France',
        phone: company?.phone || '',
        email: company?.email || '',
        website: company?.website || '',
        siret: company?.siret || '',
        vatNumber: company?.vat_number || '',
        capital: company?.capital || '',
        rcs: company?.rcs || '',
        apeCode: company?.ape_code || '',
      },

      customer: {
        name: customer?.name || order.shipping_name,
        email: customer?.email || order.shipping_email,
        phone: customer?.phone || order.shipping_phone || '',
        addressLine1: order.shipping_address_line1,
        addressLine2: order.shipping_address_line2 || '',
        postalCode: order.shipping_postal_code,
        city: order.shipping_city,
        country: order.shipping_country,
        vatNumber: customer?.vat_number || '',
      },

      items,
      subtotalHT,
      taxRate,
      taxAmount,
      totalTTC,
      currency: order.currency || 'EUR',

      orderNumber: order.order_number,
      orderDate: order.created_at,

      design: designConfig || {},
      notes: invoiceSettings?.footer_notes || '',
      legalMentions: invoiceSettings?.legal_mentions || '',
      showLogo: invoiceSettings?.show_logo !== false,
      logoUrl: invoiceSettings?.logo_url || null,
    }
  },

  getFormatDetails(format) {
    const dimensions = {
      A4: '21 × 29,7 cm',
      A3: '29,7 × 42 cm',
      A2: '42 × 59,4 cm',
    }
    return `Format ${format} (${dimensions[format] || ''}) - Impression 300 DPI`
  },
}