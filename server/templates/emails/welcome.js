import { emailLayout } from './_layout.js'

export const welcomeEmailTemplate = ({ userName, company }) => {
  const content = `
    <!-- Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #4A7C59, #606C38); border-radius: 999px;">
        <span style="color: white; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Bienvenue</span>
      </div>
    </div>

    <!-- Titre -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', serif; font-size: 42px; color: #283618; text-align: center; line-height: 1.1;">
      Ravis de vous compter<br/>parmi nous, <em style="color: #FF8C69;">${userName || 'cher créateur'}</em> !
    </h1>

    <p style="margin: 0 0 32px 0; color: #283618; opacity: 0.75; font-size: 17px; text-align: center; line-height: 1.6;">
      Votre aventure créative commence maintenant. Préparez-vous à transformer vos plus beaux souvenirs en œuvres d'art uniques inspirées de l'univers Ghibli.
    </p>

    <!-- Illustration zone (dégradé coloré) -->
    <div style="background: linear-gradient(135deg, #87CEEB 0%, #FF8C69 50%, #4A7C59 100%); border-radius: 20px; padding: 48px 32px; text-align: center; margin-bottom: 32px; color: white;">
      <div style="font-family: 'Playfair Display', serif; font-size: 48px; margin-bottom: 8px; line-height: 1;">✨</div>
      <h2 style="margin: 0 0 12px 0; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400;">
        Donnez vie à vos souvenirs
      </h2>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">
        Photos, moments précieux, voyages... Notre IA les sublime.
      </p>
    </div>

    <!-- Étapes -->
    <div style="margin-bottom: 32px;">
      <h3 style="margin: 0 0 20px 0; font-family: 'Playfair Display', serif; font-size: 22px; color: #283618; text-align: center;">
        Comment ça marche ?
      </h3>

      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <div style="display: inline-block; width: 32px; height: 32px; background: #4A7C59; border-radius: 50%; color: white; text-align: center; line-height: 32px; font-weight: 700; font-size: 14px; margin-right: 16px; vertical-align: top;">1</div>
            <div style="display: inline-block; width: calc(100% - 60px); vertical-align: top;">
              <div style="font-weight: 600; color: #283618; margin-bottom: 4px;">Uploadez votre photo</div>
              <div style="font-size: 13px; color: #283618; opacity: 0.7;">Choisissez l'image qui vous tient à cœur</div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <div style="display: inline-block; width: 32px; height: 32px; background: #FF8C69; border-radius: 50%; color: white; text-align: center; line-height: 32px; font-weight: 700; font-size: 14px; margin-right: 16px; vertical-align: top;">2</div>
            <div style="display: inline-block; width: calc(100% - 60px); vertical-align: top;">
              <div style="font-weight: 600; color: #283618; margin-bottom: 4px;">L'IA opère sa magie</div>
              <div style="font-size: 13px; color: #283618; opacity: 0.7;">Transformation en style Ghibli en quelques secondes</div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <div style="display: inline-block; width: 32px; height: 32px; background: #87CEEB; border-radius: 50%; color: white; text-align: center; line-height: 32px; font-weight: 700; font-size: 14px; margin-right: 16px; vertical-align: top;">3</div>
            <div style="display: inline-block; width: calc(100% - 60px); vertical-align: top;">
              <div style="font-weight: 600; color: #283618; margin-bottom: 4px;">Personnalisez & commandez</div>
              <div style="font-size: 13px; color: #283618; opacity: 0.7;">Ajoutez textes, badges et choisissez votre format</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${company?.website || 'https://ghibliposter.com'}/create?new=true" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #4A7C59, #606C38); color: white; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 20px rgba(74, 124, 89, 0.3);">
        Créer ma première affiche →
      </a>
    </div>

    <!-- Message -->
    <div style="padding: 20px; background-color: #FFF8DC; border-radius: 16px; border-left: 4px solid #FF8C69;">
      <p style="margin: 0; color: #283618; font-size: 14px; line-height: 1.6;">
        <strong style="color: #FF8C69;">Offre de bienvenue :</strong> profitez de -20% sur votre première commande avec le code <code style="padding: 2px 8px; background: white; border-radius: 4px; font-weight: 700; color: #4A7C59;">BIENVENUE20</code>
      </p>
    </div>
  `

  return emailLayout({
    title: 'Bienvenue chez Ghibli Poster Studio',
    previewText: `${userName || 'Bienvenue'} ! Transformez vos souvenirs en œuvres d'art avec -20% sur votre première commande.`,
    content,
    company,
  })
}