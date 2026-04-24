/**
 * Précharge les polices Google Fonts pour que le Canvas les utilise correctement
 */
export const preloadFonts = async () => {
  const fonts = [
    '700 16px "Oswald"',
    '400 16px "Playfair Display"',
    '700 16px "Playfair Display"',
    '400 16px "Bebas Neue"',
    '400 16px "Caveat"',
    '600 16px "Quicksand"',
  ]

  if (!document.fonts) {
    return Promise.resolve()
  }

  try {
    await Promise.all(fonts.map(font => document.fonts.load(font)))
    await document.fonts.ready
    return true
  } catch (error) {
    console.warn('Erreur préchargement polices:', error)
    return false
  }
}