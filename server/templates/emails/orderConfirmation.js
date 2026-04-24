import { emailLayout } from './_layout.js'

const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export const orderConfirmationTemplate = ({ order, poster, company }) => {
  const dimensions = {
    A4: '21 × 29,7 cm',
    A3: '29,7 × 42 cm',
    A2: '42 × 59,4 cm',
  }

  const content = `
    <!-- Badge succès -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #4A7C59, #606C38); border-radius: 999px;">
        <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">✓ Commande confirmée</span>
      </div>
    </div>

    <!-- Titre -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', serif; font-size: 36px; color: #283618; text-align: center; line-height: 1.2;">
      Merci pour votre <em style="color: #FF8C69;">commande</em> !
    </h1>

    <p style="margin: 0 0 32px 0; color: #283618; opacity: 0.75; font-size: 16px; text-align: center;">
      Votre affiche est désormais en préparation. Nous vous tenons informé à chaque étape.
    </p>

    <!-- Numéro de commande -->
    <div style="background: linear-gradient(135deg, rgba(74, 124, 89, 0.1), rgba(255, 140, 105, 0.1)); border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
      <div style="font-size: 11px; color: #283618; opacity: 0.6; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">
        Numéro de commande
      </div>
      <div style="font-family: 'Playfair Display', serif; font-size: 28px; color: #283618; font-weight: 700;">
        ${order.order_number}
      </div>
      <div style="font-size: 13px; color: #283618; opacity: 0.6; margin-top: 8px;">
        Passée le ${formatDate(order.created_at)}
      </div>
    </div>

    <!-- Poster info -->
    ${poster ? `
    <div style="display: flex; gap: 16px; padding: 20px; background-color: #FFF8DC; border-radius: 16px; margin-bottom: 24px;">
      ${poster.ghibli_image_url ? `
        <div style="flex-shrink: 0;">
          <img src="${poster.ghibli_image_url}" alt="${poster.title || 'Affiche'}" style="width: 80px; height: 107px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        </div>
      ` : ''}
      <div style="flex: 1;">
        <div style="font-weight: 700; color: #283618; font-size: 16px; margin-bottom: 4px;">
          ${poster.title || 'Affiche Ghibli personnalisée'}
        </div>
        <div style="display: inline-block; padding: 2px 10px; background: rgba(74, 124, 89, 0.15); color: #4A7C59; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 6px;">
          Format ${order.format}
        </div>
        <div style="font-size: 12px; color: #283618; opacity: 0.6;">
          ${dimensions[order.format]} • Quantité : ${order.quantity}
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Détails prix -->
    <table role="presentation" style="width: 100%; margin-bottom: 32px; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(40, 54, 24, 0.1); color: #283618; opacity: 0.75; font-size: 14px;">
          Sous-total
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(40, 54, 24, 0.1); text-align: right; color: #283618; font-weight: 600;">
          ${formatCurrency(order.unit_price * order.quantity, order.currency)}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(40, 54, 24, 0.1); color: #283618; opacity: 0.75; font-size: 14px;">
          Livraison
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(40, 54, 24, 0.1); text-align: right; color: #4A7C59; font-weight: 700; font-size: 14px;">
          OFFERTE
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0; color: #283618; font-weight: 700; font-size: 16px;">
          Total TTC
        </td>
        <td style="padding: 16px 0; text-align: right; color: #4A7C59; font-weight: 700; font-size: 24px; font-family: 'Playfair Display', serif;">
          ${formatCurrency(order.total_amount, order.currency)}
        </td>
      </tr>
    </table>

    <!-- Adresse de livraison -->
    <div style="padding: 20px; background-color: #FFF8DC; border-radius: 16px; margin-bottom: 32px;">
      <div style="font-size: 11px; color: #283618; opacity: 0.6; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; margin-bottom: 10px;">
        📦 Livraison à
      </div>
      <div style="color: #283618; line-height: 1.6;">
        <div style="font-weight: 700; margin-bottom: 2px;">${order.shipping_name}</div>
        <div style="font-size: 14px;">${order.shipping_address_line1}</div>
        ${order.shipping_address_line2 ? `<div style="font-size: 14px;">${order.shipping_address_line2}</div>` : ''}
        <div style="font-size: 14px;">${order.shipping_postal_code} ${order.shipping_city}</div>
        <div style="font-size: 14px;">${order.shipping_country}</div>
      </div>
    </div>

    <!-- Timeline -->
    <div style="margin-bottom: 32px;">
      <h3 style="margin: 0 0 20px 0; font-family: 'Playfair Display', serif; font-size: 20px; color: #283618; text-align: center;">
        Prochaines étapes
      </h3>

      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 60px; padding: 8px 0; text-align: center; vertical-align: top;">
            <div style="width: 40px; height: 40px; background: rgba(74, 124, 89, 0.15); border-radius: 50%; display: inline-block; line-height: 40px; font-size: 16px;">🖨️</div>
          </td>
          <td style="padding: 8px 0 8px 12px; vertical-align: top;">
            <div style="font-weight: 600; color: #283618; margin-bottom: 2px;">Impression HD</div>
            <div style="font-size: 13px; color: #283618; opacity: 0.7;">Sous 24h ouvrées en qualité 300 DPI</div>
          </td>
        </tr>
        <tr>
          <td style="width: 60px; padding: 8px 0; text-align: center; vertical-align: top;">
            <div style="width: 40px; height: 40px; background: rgba(255, 140, 105, 0.15); border-radius: 50%; display: inline-block; line-height: 40px; font-size: 16px;">📬</div>
          </td>
          <td style="padding: 8px 0 8px 12px; vertical-align: top;">
            <div style="font-weight: 600; color: #283618; margin-bottom: 2px;">Expédition</div>
            <div style="font-size: 13px; color: #283618; opacity: 0.7;">Vous recevrez un email avec le numéro de suivi</div>
          </td>
        </tr>
        <tr>
          <td style="width: 60px; padding: 8px 0; text-align: center; vertical-align: top;">
            <div style="width: 40px; height: 40px; background: rgba(135, 206, 235, 0.15); border-radius: 50%; display: inline-block; line-height: 40px; font-size: 16px;">🎁</div>
          </td>
          <td style="padding: 8px 0 8px 12px; vertical-align: top;">
            <div style="font-weight: 600; color: #283618; margin-bottom: 2px;">Livraison à domicile</div>
            <div style="font-size: 13px; color: #283618; opacity: 0.7;">Sous 48h en France métropolitaine</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 16px;">
      <a href="${company?.website || 'https://ghibliposter.com'}/orders/${order.id}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4A7C59, #606C38); color: white; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 20px rgba(74, 124, 89, 0.3);">
        Suivre ma commande
      </a>
    </div>

    <p style="margin: 16px 0 0 0; text-align: center; font-size: 13px; color: #283618; opacity: 0.6;">
      Votre facture est jointe à cet email.
    </p>
  `

  return emailLayout({
    title: `Commande ${order.order_number} confirmée`,
    previewText: `Votre commande ${order.order_number} (${formatCurrency(order.total_amount, order.currency)}) est confirmée !`,
    content,
    company,
  })
}