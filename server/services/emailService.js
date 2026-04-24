import { resend, RESEND_CONFIG } from './resend.js'
import { supabase } from './supabase.js'
import { settingsService } from './settingsService.js'
import { welcomeEmailTemplate } from '../templates/emails/welcome.js'
import { orderConfirmationTemplate } from '../templates/emails/orderConfirmation.js'
import { shippedEmailTemplate } from '../templates/emails/shipped.js'
import { deliveredEmailTemplate } from '../templates/emails/delivered.js'

export const emailService = {
  /**
   * Log d'un email dans la base
   */
  async logEmail({ userId, orderId, invoiceId, type, recipient, subject, status, providerId, error, metadata = {} }) {
    try {
      await supabase.from('email_logs').insert({
        user_id: userId || null,
        order_id: orderId || null,
        invoice_id: invoiceId || null,
        email_type: type,
        recipient_email: recipient,
        subject: subject || null,
        status,
        provider: 'resend',
        provider_id: providerId || null,
        error_message: error || null,
        metadata,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
      })
    } catch (err) {
      console.error('Erreur log email:', err)
    }
  },

  /**
   * Envoi générique via Resend
   */
  async send({ to, subject, html, attachments, replyTo, logData = {} }) {
    const emailSettings = await settingsService.get('email_settings')
    
    if (!emailSettings?.enabled) {
      console.log('Emails désactivés dans les settings, skip')
      return { skipped: true }
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY manquante !')
      throw new Error('Configuration email manquante (RESEND_API_KEY)')
    }

    try {
      const fromName = emailSettings?.from_name || 'Ghibli Poster Studio'
      const fromEmail = emailSettings?.from_email || 'contact@velt.re'
      const from = process.env.RESEND_FROM || `${fromName} <${fromEmail}>`

      console.log('Envoi email:', { from, to, subject })

      // Paramètres Resend (API v2+)
      const emailParams = {
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }

      // replyTo en camelCase (SDK v3+) OU reply_to (SDK v2)
      const replyAddress = replyTo || emailSettings?.reply_to || RESEND_CONFIG.defaultReplyTo
      if (replyAddress) {
        emailParams.replyTo = replyAddress
      }

      if (attachments && attachments.length > 0) {
        emailParams.attachments = attachments
      }

      const { data, error } = await resend.emails.send(emailParams)

      if (error) {
        console.error('Erreur Resend API:', error)
        throw new Error(error.message || 'Erreur Resend')
      }

      console.log('Email envoyé avec succès:', data?.id)

      await this.logEmail({
        ...logData,
        recipient: Array.isArray(to) ? to[0] : to,
        subject,
        status: 'sent',
        providerId: data?.id,
      })

      return { success: true, id: data?.id }
    } catch (error) {
      console.error('Erreur envoi email:', error.message)
      console.error('Stack:', error.stack)

      await this.logEmail({
        ...logData,
        recipient: Array.isArray(to) ? to[0] : to,
        subject,
        status: 'failed',
        error: error.message,
      })

      throw error
    }
  },

  /**
   * Email de bienvenue
   */
  async sendWelcome({ userId, email, userName }) {
    try {
      const [emailSettings, company] = await Promise.all([
        settingsService.get('email_settings'),
        settingsService.get('company_info'),
      ])

      if (!emailSettings?.send_welcome) {
        console.log('Email de bienvenue désactivé dans les settings')
        return { skipped: true }
      }

      const html = welcomeEmailTemplate({ userName, company })
      const subject = `Bienvenue chez ${company?.name || 'Ghibli Poster Studio'}${userName ? `, ${userName}` : ''} !`

      return await this.send({
        to: email,
        subject,
        html,
        logData: {
          userId,
          type: 'welcome',
          metadata: { userName },
        },
      })
    } catch (error) {
      console.error('sendWelcome error:', error.message)
      throw error
    }
  },

  /**
   * Email de confirmation de commande
   */
  async sendOrderConfirmation({ order, poster, invoicePdfUrl }) {
    try {
      const [emailSettings, company] = await Promise.all([
        settingsService.get('email_settings'),
        settingsService.get('company_info'),
      ])

      if (!emailSettings?.send_order_confirmation) {
        return { skipped: true }
      }

      const html = orderConfirmationTemplate({ order, poster, company })
      const subject = `Commande ${order.order_number} confirmée - ${company?.name || 'Ghibli Poster Studio'}`

      let attachments = undefined
      if (invoicePdfUrl) {
        try {
          const response = await fetch(invoicePdfUrl)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          
          attachments = [{
            filename: `Facture-${order.order_number}.pdf`,
            content: buffer,
          }]
        } catch (err) {
          console.warn('Impossible de joindre la facture:', err.message)
        }
      }

      return await this.send({
        to: order.shipping_email,
        subject,
        html,
        attachments,
        logData: {
          userId: order.user_id,
          orderId: order.id,
          type: 'order_confirmation',
        },
      })
    } catch (error) {
      console.error('sendOrderConfirmation error:', error.message)
      throw error
    }
  },

  /**
   * Email d'expédition
   */
  async sendShipped({ order, trackingNumber, carrier }) {
    try {
      const [emailSettings, company] = await Promise.all([
        settingsService.get('email_settings'),
        settingsService.get('company_info'),
      ])

      if (!emailSettings?.send_shipped) return { skipped: true }

      const html = shippedEmailTemplate({ order, trackingNumber, carrier, company })
      const subject = `Votre commande ${order.order_number} est expédiée`

      return await this.send({
        to: order.shipping_email,
        subject,
        html,
        logData: {
          userId: order.user_id,
          orderId: order.id,
          type: 'shipped',
          metadata: { trackingNumber, carrier },
        },
      })
    } catch (error) {
      console.error('sendShipped error:', error.message)
      throw error
    }
  },

  /**
   * Email de livraison
   */
  async sendDelivered({ order }) {
    try {
      const [emailSettings, company] = await Promise.all([
        settingsService.get('email_settings'),
        settingsService.get('company_info'),
      ])

      if (!emailSettings?.send_delivered) return { skipped: true }

      const html = deliveredEmailTemplate({ order, company })
      const subject = `Votre affiche ${order.order_number} est arrivée !`

      return await this.send({
        to: order.shipping_email,
        subject,
        html,
        logData: {
          userId: order.user_id,
          orderId: order.id,
          type: 'delivered',
        },
      })
    } catch (error) {
      console.error('sendDelivered error:', error.message)
      throw error
    }
  },
}