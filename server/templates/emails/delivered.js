import { emailLayout } from './_layout.js'

export const deliveredEmailTemplate = ({ order, company }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #4A7C59, #606C38); border-radius: 999px;">
        <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">🎉 Livré</span>
      </div>
    </div>

    <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', serif; font-size: 36px; color: #283618; text-align: center; line-height: 1.2;">
      Votre affiche est <em style="color: #4A7C59;">arrivée</em> !
    </h1>

    <p style="margin: 0 0 32px 0; color: #283618; opacity: 0.75; font-size: 16px; text-align: center;">
      On espère que vous êtes aussi émerveillé(e) que nous. N'hésitez pas à partager le résultat !
    </p>

    <!-- Illustration -->
    <div style="background: linear-gradient(135deg, #4A7C59 0%, #87CEEB 100%); border-radius: 20px; padding: 48px 32px; text-align: center; margin-bottom: 32px; color: white;">
      <div style="font-size: 64px; margin-bottom: 12px; line-height: 1;">🖼️</div>
      <h2 style="margin: 0 0 8px 0; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400;">
        Merci d'avoir choisi Ghibli Poster Studio
      </h2>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">
        Nous serions ravis d'avoir votre avis
      </p>
    </div>

    <!-- Actions -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${company?.website || 'https://ghibliposter.com'}/orders/${order.id}/review" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #4A7C59, #606C38); color: white; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 14px; margin: 0 4px 8px 4px;">
        ⭐ Laisser un avis
      </a>
      <a href="${company?.website || 'https://ghibliposter.com'}/create?new=true" style="display: inline-block; padding: 14px 28px; background: white; color: #4A7C59; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 14px; border: 2px solid #4A7C59; margin: 0 4px 8px 4px;">
        Créer une autre affiche
      </a>
    </div>

    <div style="padding: 20px; background-color: #FFF8DC; border-radius: 16px; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Playfair Display', serif; font-size: 18px; color: #283618;">
        Partagez votre création
      </p>
      <p style="margin: 0; font-size: 13px; color: #283618; opacity: 0.7; line-height: 1.6;">
        Taguez-nous sur Instagram <strong style="color: #FF8C69;">@ghibliposter</strong> pour apparaître sur notre page !
      </p>
    </div>
  `

  return emailLayout({
    title: 'Votre affiche est arrivée',
    previewText: 'Votre commande a été livrée avec succès. Merci de votre confiance !',
    content,
    company,
  })
}