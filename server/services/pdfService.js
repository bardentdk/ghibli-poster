import puppeteer from 'puppeteer'

let browserInstance = null

/**
 * Retourne une instance Puppeteer réutilisée
 */
const getBrowser = async () => {
  if (browserInstance) {
    try {
      const isConnected = browserInstance.isConnected()
      if (isConnected) return browserInstance
    } catch (e) {
      browserInstance = null
    }
  }

  browserInstance = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  })
  return browserInstance
}

export const pdfService = {
  /**
   * Génère un PDF à partir d'un HTML
   */
  async generateFromHtml(html, options = {}) {
    const {
      format = 'A4',
      landscape = false,
      margin = { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground = true,
      preferCSSPageSize = true,
    } = options

    const browser = await getBrowser()
    const page = await browser.newPage()

    try {
      // Injection du HTML
      await page.setContent(html, {
        waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
        timeout: 30000,
      })

      // Attendre que les polices soient chargées
      await page.evaluateHandle('document.fonts.ready')

      // Attendre que les images soient chargées
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete)
            .map((img) => new Promise((resolve) => {
              img.onload = img.onerror = resolve
            }))
        )
      })

      const pdfBuffer = await page.pdf({
        format,
        landscape,
        margin,
        printBackground,
        preferCSSPageSize,
      })

      return pdfBuffer
    } finally {
      await page.close()
    }
  },

  /**
   * Ferme proprement Puppeteer
   */
  async close() {
    if (browserInstance) {
      await browserInstance.close()
      browserInstance = null
    }
  },
}

// Fermeture propre à l'arrêt du serveur
process.on('SIGTERM', async () => {
  await pdfService.close()
})

process.on('SIGINT', async () => {
  await pdfService.close()
  process.exit(0)
})