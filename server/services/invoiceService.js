import { supabase } from './supabase.js'
import { pdfService } from './pdfService.js'
import { settingsService } from './settingsService.js'
import { invoiceHelpers } from './invoiceHelpers.js'
import { getTemplate } from '../templates/invoices/index.js'

export const invoiceService = {
  /**
   * Génère une facture complète à partir d'une commande
   */
  async generateForOrder(orderId) {
    // 1. Récupérer la commande et les données associées
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, posters(*), profiles:user_id(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Commande introuvable')
    }

    // 2. Vérifier si une facture existe déjà
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle()

    if (existingInvoice?.pdf_url) {
      console.log('Facture existante pour commande:', orderId)
      return existingInvoice
    }

    // 3. Récupérer les settings
    const [company, invoiceSettings, invoiceDesign] = await Promise.all([
      settingsService.get('company_info'),
      settingsService.get('invoice_settings'),
      settingsService.get('invoice_design'),
    ])

    const templateSlug = invoiceSettings?.default_template || 'modern'
    const template = getTemplate(templateSlug)

    // 4. Créer l'entrée facture en base (pour obtenir le numéro auto)
    let invoice = existingInvoice
    if (!invoice) {
      const invoiceData = invoiceHelpers.prepareInvoiceData({
        order,
        poster: order.posters,
        customer: {
          name: order.shipping_name,
          email: order.shipping_email,
          phone: order.shipping_phone,
        },
        company,
        invoiceSettings,
        designConfig: invoiceDesign,
        invoiceNumber: '', // sera généré par le trigger
        issueDate: new Date(),
      })

      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          order_id: order.id,
          user_id: order.user_id,
          issuer_data: invoiceData.company,
          customer_data: invoiceData.customer,
          items: invoiceData.items,
          subtotal_ht: invoiceData.subtotalHT,
          tax_rate: invoiceData.taxRate,
          tax_amount: invoiceData.taxAmount,
          total_ttc: invoiceData.totalTTC,
          currency: invoiceData.currency,
          template_slug: templateSlug,
          design_config: invoiceDesign,
          issue_date: new Date().toISOString().split('T')[0],
          status: order.payment_status === 'paid' ? 'paid' : 'draft',
          paid_date: order.paid_at ? new Date(order.paid_at).toISOString().split('T')[0] : null,
          notes: invoiceSettings?.footer_notes,
          legal_mentions: invoiceSettings?.legal_mentions,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError
      invoice = newInvoice
    }

    // 5. Préparer les données finales avec le numéro de facture
    const finalData = invoiceHelpers.prepareInvoiceData({
      order,
      poster: order.posters,
      customer: {
        name: order.shipping_name,
        email: order.shipping_email,
        phone: order.shipping_phone,
      },
      company,
      invoiceSettings,
      designConfig: invoiceDesign,
      invoiceNumber: invoice.invoice_number,
      issueDate: new Date(invoice.issue_date),
    })

    // 6. Générer le HTML
    const html = template.render(finalData)

    // 7. Générer le PDF via Puppeteer
    console.log('Génération PDF facture:', invoice.invoice_number)
    const pdfBuffer = await pdfService.generateFromHtml(html, {
      format: 'A4',
      printBackground: true,
    })

    // 8. Upload du PDF vers Supabase Storage
    const fileName = `${invoice.invoice_number}.pdf`
    const filePath = `${order.user_id}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Erreur upload facture:', uploadError)
      throw new Error(`Impossible d'uploader la facture: ${uploadError.message}`)
    }

    // 9. Créer une URL signée (valide 1 an)
    const { data: signedUrl } = await supabase.storage
      .from('invoices')
      .createSignedUrl(filePath, 365 * 24 * 3600)

    // 10. Mettre à jour la facture avec l'URL
    const { data: finalInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({
        pdf_url: signedUrl?.signedUrl,
        pdf_path: filePath,
      })
      .eq('id', invoice.id)
      .select()
      .single()

    if (updateError) throw updateError

    // 11. Mettre à jour la commande avec l'URL de la facture
    await supabase
      .from('orders')
      .update({
        invoice_url: signedUrl?.signedUrl,
        invoice_number: invoice.invoice_number,
      })
      .eq('id', order.id)

    return finalInvoice
  },

  /**
   * Régénère une facture (après changement de template par exemple)
   */
  async regenerate(invoiceId) {
    const { data: invoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (!invoice) throw new Error('Facture introuvable')

    // Supprimer le PDF existant
    if (invoice.pdf_path) {
      await supabase.storage.from('invoices').remove([invoice.pdf_path])
    }

    // Reset et régénérer
    await supabase
      .from('invoices')
      .update({ pdf_url: null, pdf_path: null })
      .eq('id', invoiceId)

    return await this.generateForOrder(invoice.order_id)
  },

  /**
   * Récupère une URL signée fraîche pour une facture
   */
  async getDownloadUrl(invoiceId, userId) {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error || !invoice) throw new Error('Facture introuvable')

    // Vérifier les droits
    if (invoice.user_id !== userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        throw new Error('Accès refusé')
      }
    }

    if (!invoice.pdf_path) {
      throw new Error('PDF non généré')
    }

    const { data: signedUrl } = await supabase.storage
      .from('invoices')
      .createSignedUrl(invoice.pdf_path, 3600)

    return signedUrl?.signedUrl
  },

  /**
   * Génère une preview HTML d'une facture (pour affichage admin)
   */
  async generatePreview({ templateSlug, designConfig, sampleData = null }) {
    const template = getTemplate(templateSlug)
    const [company, invoiceSettings] = await Promise.all([
      settingsService.get('company_info'),
      settingsService.get('invoice_settings'),
    ])

    // Données d'exemple pour la preview
    const data = sampleData || {
      invoiceNumber: 'FAC-2026-00042',
      issueDate: new Date(),
      paymentStatus: 'paid',
      paymentDate: new Date(),
      paymentMethod: 'Carte bancaire (Stripe)',
      orderNumber: 'GHB-20260424-0042',
      orderDate: new Date(),
      company,
      customer: {
        name: 'Marie Dupont',
        email: 'marie.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        addressLine1: '12 rue des Lilas',
        postalCode: '75011',
        city: 'Paris',
        country: 'France',
      },
      items: [
        {
          description: 'Affiche Ghibli personnalisée - Le Voyage d\'Emma',
          details: 'Format A3 (29,7 × 42 cm) - Impression 300 DPI',
          quantity: 1,
          unitPriceHT: 24.92,
          unitPriceTTC: 29.90,
          totalHT: 24.92,
          totalTTC: 29.90,
          taxRate: 20,
        },
      ],
      subtotalHT: 24.92,
      taxRate: 20,
      taxAmount: 4.98,
      totalTTC: 29.90,
      currency: 'EUR',
      design: designConfig || {},
      notes: invoiceSettings?.footer_notes || 'Merci pour votre confiance !',
      legalMentions: invoiceSettings?.legal_mentions || '',
    }

    return template.render(data)
  },
}