import { emailLayout } from './_layout.js'

export const shippedEmailTemplate = ({ order, trackingNumber, carrier, company }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #FF8C69, #8B7355); border-radius: 999px;">
        <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">📬 Expédié</span>
      </div>
    </div>

    <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', serif; font-size: 36px; color: #283618; text-align: center; line-height: 1.2;">
      Votre affiche est en <em style="color: #FF8C69;">route</em> !
    </h1>

    <p style="margin: 0 0 32px 0; color: #283618; opacity: 0.75; font-size: 16px; text-align: center;">
      Préparez vos plus beaux murs, votre commande ${order.order_number} vient d'être confiée à ${carrier || 'notre transporteur'}.
    </p>

    <!-- Tracking -->
    ${trackingNumber ? `
    <div style="background: linear-gradient(135deg, rgba(255, 140, 105, 0.1), rgba(139, 115, 85, 0.1)); border: 2px dashed rgba(255, 140, 105, 0.3); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <div style="font-size: 11px; color: #283618; opacity: 0.6; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">
        Numéro de suivi
      </div>
      <div style="font-family: 'Courier New', monospace; font-size: 24px; color: #283618; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px;">
        ${trackingNumber}
      </div>
      <div style="font-size: 13px; color: #283618; opacity: 0.7;">
        Transporteur : <strong>${carrier || 'La Poste'}</strong>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${company?.website || 'https://ghibliposter.com'}/orders/${order.id}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF8C69, #8B7355); color: white; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 14px;">
        Suivre mon colis
      </a>
    </div>
    ` : ''}

    <div style="padding: 20px; background-color: #FFF8DC; border-radius: 16px; border-left: 4px solid #FF8C69;">
      <p style="margin: 0; color: #283618; font-size: 14px; line-height: 1.6;">
        <strong>Estimation de livraison :</strong> sous 48h en France métropolitaine. Vous recevrez un nouvel email dès la livraison.
      </p>
    </div>
  `

  return emailLayout({
    title: `Commande ${order.order_number} expédiée`,
    previewText: `Votre affiche est en route ! Numéro de suivi : ${trackingNumber || 'disponible bientôt'}`,
    content,
    company,
  })
}