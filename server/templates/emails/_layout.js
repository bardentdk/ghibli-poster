/**
 * Layout de base pour tous les emails
 * Tous les styles sont inline pour la compatibilité email
 */
export const emailLayout = ({ title, previewText, content, company, footer }) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #FFF8DC; color: #283618; line-height: 1.6;">
  <!-- Preview text hidden -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${previewText || ''}
  </div>

  <div style="background: linear-gradient(135deg, #FFF8DC 0%, #F4E4BC 100%); padding: 40px 20px; min-height: 100vh;">
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
      
      <!-- Header -->
      <tr>
        <td style="padding: 0 0 32px 0; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 12px;">
            <img src="http://localhost:5173/assets/logo.png" alt="" width="50px" />
          </div>
        </td>
      </tr>

      <!-- Main content -->
      <tr>
        <td style="background-color: #FFFFFF; border-radius: 24px; padding: 48px 40px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); border: 1px solid rgba(255, 255, 255, 0.5);">
          ${content}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 32px 20px; text-align: center;">
          ${footer || `
            <p style="margin: 0 0 12px 0; color: #283618; opacity: 0.7; font-size: 13px;">
              ${company?.name || 'Ghibli Poster Studio'} - Transformons vos souvenirs en œuvres d'art
            </p>
            <p style="margin: 0 0 16px 0; color: #283618; opacity: 0.5; font-size: 12px;">
              ${company?.address_line1 || ''} ${company?.postal_code || ''} ${company?.city || ''}
            </p>
            <div style="margin: 16px 0;">
              <a href="${company?.website || '#'}" style="color: #4A7C59; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 8px;">Site web</a>
              <span style="color: #283618; opacity: 0.3;">•</span>
              <a href="mailto:${company?.email || 'contact@ghibliposter.com'}" style="color: #4A7C59; text-decoration: none; font-size: 12px; font-weight: 600; margin: 0 8px;">Contact</a>
            </div>
            <p style="margin: 24px 0 0 0; color: #283618; opacity: 0.4; font-size: 11px;">
              Vous recevez cet email car vous avez un compte sur notre service.
            </p>
          `}
        </td>
      </tr>

    </table>
  </div>
</body>
</html>
`