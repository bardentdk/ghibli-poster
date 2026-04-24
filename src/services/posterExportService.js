import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

/**
 * Génère un poster HD sans filigrane pour l'impression
 * Utilise un canvas offscreen en haute résolution
 */
export const posterExportService = {
  /**
   * Dimensions physiques exactes pour chaque format (en pixels à 300 DPI)
   */
  PRINT_DIMENSIONS: {
    A4: { width: 2480, height: 3508 },    // 21 × 29.7 cm à 300 DPI
    A3: { width: 3508, height: 4961 },    // 29.7 × 42 cm à 300 DPI
    A2: { width: 4961, height: 7016 },    // 42 × 59.4 cm à 300 DPI
  },

  /**
   * Dimensions pour preview web (basse res)
   */
  PREVIEW_DIMENSIONS: {
    width: 1414,
    height: 2000,
  },

  /**
   * Génère un poster en HD pour l'impression (sans filigrane)
   * Retourne un Blob PNG haute qualité
   */
  async generatePrintReady({
    imageUrl,
    title,
    tagline,
    directors,
    releaseDate,
    credits,
    designConfig = {},
    format = 'A4',
    onProgress = () => {},
  }) {
    onProgress({ step: 'init', progress: 0 })

    const dimensions = this.PRINT_DIMENSIONS[format]
    if (!dimensions) {
      throw new Error(`Format ${format} non supporté`)
    }

    const canvas = document.createElement('canvas')
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    const ctx = canvas.getContext('2d', { alpha: false })

    onProgress({ step: 'drawing', progress: 20 })

    // Dessine tout le poster sans filigrane
    await this.drawPosterOnCanvas(ctx, {
      width: dimensions.width,
      height: dimensions.height,
      imageUrl,
      title,
      tagline,
      directors,
      releaseDate,
      credits,
      designConfig,
      withWatermark: false, // IMPORTANT : pas de filigrane pour l'impression
    })

    onProgress({ step: 'exporting', progress: 80 })

    // Convertir en blob PNG haute qualité
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onProgress({ step: 'completed', progress: 100 })
            resolve(blob)
          } else {
            reject(new Error('Export impossible'))
          }
        },
        'image/png',
        1.0 // qualité max
      )
    })
  },

  /**
   * Génère une preview HD pour affichage (avec filigrane)
   */
  async generatePreview({
    imageUrl,
    title,
    tagline,
    directors,
    releaseDate,
    credits,
    designConfig = {},
  }) {
    const canvas = document.createElement('canvas')
    canvas.width = this.PREVIEW_DIMENSIONS.width
    canvas.height = this.PREVIEW_DIMENSIONS.height
    const ctx = canvas.getContext('2d')

    await this.drawPosterOnCanvas(ctx, {
      width: this.PREVIEW_DIMENSIONS.width,
      height: this.PREVIEW_DIMENSIONS.height,
      imageUrl,
      title,
      tagline,
      directors,
      releaseDate,
      credits,
      designConfig,
      withWatermark: true,
    })

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Export impossible')),
        'image/png',
        0.9
      )
    })
  },

  /**
   * Fonction de dessin centralisée (utilisée pour preview et impression)
   */
  async drawPosterOnCanvas(ctx, options) {
    const {
      width,
      height,
      imageUrl,
      title,
      tagline,
      directors,
      releaseDate,
      credits,
      designConfig = {},
      withWatermark = false,
    } = options

    const {
      titleFont = 'condensed',
      accentColor = '#E74C3C',
      rating = 'none',
      audioBadge = 'none',
      studioLogo = 'none',
      showParentalAdvisory = false,
      showDateVertical = true,
    } = designConfig

    // Facteur d'échelle basé sur la largeur
    const baseWidth = 1414
    const scale = width / baseWidth

    // === FOND NOIR ===
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // === IMAGE DE FOND ===
    if (imageUrl) {
      const img = await this.loadImage(imageUrl)
      const imgRatio = img.width / img.height
      const canvasRatio = width / height
      let drawWidth, drawHeight, offsetX, offsetY

      if (imgRatio > canvasRatio) {
        drawHeight = height
        drawWidth = height * imgRatio
        offsetX = (width - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = width
        drawHeight = width / imgRatio
        offsetX = 0
        offsetY = (height - drawHeight) / 2
      }
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    // === DÉGRADÉ HAUT ===
    const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.4)
    topGradient.addColorStop(0, 'rgba(0,0,0,0.7)')
    topGradient.addColorStop(0.4, 'rgba(0,0,0,0.3)')
    topGradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = topGradient
    ctx.fillRect(0, 0, width, height * 0.4)

    // === DÉGRADÉ BAS ===
    const bottomGradient = ctx.createLinearGradient(0, height * 0.4, 0, height)
    bottomGradient.addColorStop(0, 'rgba(0,0,0,0)')
    bottomGradient.addColorStop(0.35, 'rgba(0,0,0,0.3)')
    bottomGradient.addColorStop(0.7, 'rgba(0,0,0,0.75)')
    bottomGradient.addColorStop(1, 'rgba(0,0,0,0.95)')
    ctx.fillStyle = bottomGradient
    ctx.fillRect(0, height * 0.4, width, height * 0.6)

    // === FILIGRANE (seulement si demandé) ===
    if (withWatermark) {
      await this.drawWatermark(ctx, width, height)
    }

    // === FROM THE DIRECTORY OF ===
    const directorsParts = directors
      ? directors.split(/\s*&\s*|\s+et\s+|\s*,\s*/).filter(Boolean).slice(0, 2)
      : []

    if (directorsParts.length > 0) {
      ctx.save()
      ctx.font = `bold ${28 * scale}px "Oswald", sans-serif`
      
      const prefix = 'FROM THE DIRECTORY OF '
      const prefixWidth = ctx.measureText(prefix).width
      const namesText = directorsParts.join(' & ').toUpperCase()
      const namesWidth = ctx.measureText(namesText).width
      const totalWidth = prefixWidth + namesWidth
      const startX = (width - totalWidth) / 2
      const y = 80 * scale
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.textAlign = 'left'
      ctx.fillText(prefix, startX, y)
      
      let currentX = startX + prefixWidth
      directorsParts.forEach((name, i) => {
        const nameText = name.toUpperCase().trim()
        ctx.fillStyle = accentColor
        ctx.fillText(nameText, currentX, y)
        currentX += ctx.measureText(nameText).width
        
        if (i < directorsParts.length - 1) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          ctx.fillText(' & ', currentX, y)
          currentX += ctx.measureText(' & ').width
        }
      })
      ctx.restore()
    }

    // === TITRE PRINCIPAL ===
    let titleEndY = 0
    if (title) {
      ctx.save()
      ctx.textAlign = 'center'
      ctx.fillStyle = 'white'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
      ctx.shadowBlur = 20 * scale
      ctx.shadowOffsetY = 4 * scale

      const fontMap = {
        condensed: `bold ${220 * scale}px "Oswald", sans-serif`,
        elegant: `400 ${200 * scale}px "Playfair Display", serif`,
        display: `bold ${240 * scale}px "Bebas Neue", sans-serif`,
        handwritten: `400 ${220 * scale}px "Caveat", cursive`,
      }
      ctx.font = fontMap[titleFont] || fontMap.condensed

      const maxWidth = width * 0.85
      const words = title.split(' ')
      let lines = []
      let currentLine = words[0] || ''
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)

      const lineHeight = (titleFont === 'condensed' ? 200 : 220) * scale
      const startY = (200 + (directorsParts.length > 0 ? 40 : 0)) * scale
      
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight)
      })
      
      titleEndY = startY + lines.length * lineHeight
      ctx.restore()

      // === TAGLINE ===
      if (tagline) {
        ctx.save()
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = `italic 600 ${36 * scale}px "Quicksand", sans-serif`
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
        ctx.shadowBlur = 8 * scale
        
        ctx.fillText(tagline.toUpperCase(), width / 2, titleEndY + (40 * scale))
        ctx.restore()
      }
    }

    // === DATE VERTICALE ===
    if (showDateVertical && releaseDate) {
      ctx.save()
      ctx.translate(70 * scale, height - (500 * scale))
      ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = 'white'
      ctx.font = `bold ${44 * scale}px "Oswald", sans-serif`
      ctx.textAlign = 'left'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 10 * scale
      ctx.fillText(releaseDate.toUpperCase(), 0, 0)
      ctx.restore()
    }

    // === RATING BADGE ===
    if (rating !== 'none') {
      await this.drawRatingBadge(ctx, rating, width - (130 * scale), height - (440 * scale), scale)
    }

    // === CRÉDITS ===
    if (credits) {
      ctx.save()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.font = `300 ${26 * scale}px "Oswald", sans-serif`
      ctx.textAlign = 'center'
      
      const creditsMaxWidth = width * 0.75
      const words = credits.toUpperCase().split(' ')
      let lines = []
      let currentLine = words[0] || ''
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        if (ctx.measureText(testLine).width > creditsMaxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)

      const creditsY = height - (220 * scale)
      const lineHeight = 34 * scale
      lines.slice(0, 5).forEach((line, i) => {
        ctx.fillText(line, width / 2, creditsY + i * lineHeight)
      })
      ctx.restore()
    }

    // === PARENTAL ADVISORY ===
    if (showParentalAdvisory) {
      this.drawParentalAdvisory(ctx, 80 * scale, height - (140 * scale), scale)
    }

    // === AUDIO BADGE ===
    if (audioBadge !== 'none') {
      this.drawAudioBadge(ctx, audioBadge, width / 2, height - (90 * scale), scale)
    }

    // === STUDIO LOGO ===
    if (studioLogo !== 'none') {
      this.drawStudioLogo(ctx, studioLogo, width - (140 * scale), height - (140 * scale), scale)
    }
  },

  /**
   * Charge une image en Promise
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  },

  /**
   * Dessine le filigrane
   */
  async drawWatermark(ctx, width, height, logoUrl = '/assets/logo.png') {
    try {
      const logoImg = await this.loadImage(logoUrl)
      
      ctx.save()
      ctx.globalAlpha = 0.15
      ctx.filter = 'grayscale(100%) brightness(1.5)'
      
      ctx.translate(width / 2, height / 2)
      ctx.rotate(-Math.PI / 6)
      ctx.translate(-width / 2, -height / 2)
      
      const scale = width / 1414
      const logoSize = 200 * scale
      const spacing = 280 * scale
      
      for (let y = -height; y < height * 2; y += spacing) {
        for (let x = -width; x < width * 2; x += spacing) {
          ctx.drawImage(logoImg, x, y, logoSize, logoSize)
        }
      }
      ctx.restore()
    } catch (error) {
      console.warn('Logo filigrane introuvable, skip')
    }
  },

  /**
   * Dessine le badge rating
   */
  async drawRatingBadge(ctx, rating, x, y, scale) {
    const { RATINGS } = await import('../config/posterBadges')
    const ratingConfig = RATINGS.find((r) => r.value === rating)
    if (!ratingConfig) return

    const badgeRadius = 60 * scale

    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, badgeRadius, 0, Math.PI * 2)
    ctx.fillStyle = ratingConfig.color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 3 * scale
    ctx.stroke()

    ctx.fillStyle = 'white'
    ctx.font = `bold ${42 * scale}px "Oswald", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(ratingConfig.label, x, y)
    ctx.restore()
  },

  /**
   * Dessine le Parental Advisory
   */
  drawParentalAdvisory(ctx, x, y, scale) {
    const paWidth = 100 * scale
    const paHeight = 120 * scale

    ctx.save()
    ctx.fillStyle = 'black'
    ctx.fillRect(x, y, paWidth, paHeight)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2 * scale
    ctx.strokeRect(x, y, paWidth, paHeight)

    ctx.fillStyle = 'white'
    ctx.font = `bold ${14 * scale}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('PARENTAL', x + paWidth / 2, y + (25 * scale))
    ctx.fillText('ADVISORY', x + paWidth / 2, y + (45 * scale))

    ctx.font = `bold ${10 * scale}px sans-serif`
    ctx.fillText('EXPLICIT', x + paWidth / 2, y + (85 * scale))
    ctx.fillText('CONTENT', x + paWidth / 2, y + (100 * scale))
    ctx.restore()
  },

  /**
   * Dessine le badge audio
   */
  drawAudioBadge(ctx, badge, x, y, scale) {
    ctx.save()
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    switch (badge) {
      case 'dolby_atmos':
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 3 * scale
        ctx.strokeRect(x - (90 * scale), y - (30 * scale), 50 * scale, 60 * scale)
        
        ctx.font = `bold ${30 * scale}px sans-serif`
        ctx.fillText('DD', x - (65 * scale), y)
        
        ctx.font = `bold ${28 * scale}px "Oswald", sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText('ATMOS', x - (20 * scale), y)
        break
      
      case 'dolby_digital':
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 3 * scale
        ctx.strokeRect(x - (80 * scale), y - (30 * scale), 50 * scale, 60 * scale)
        
        ctx.font = `bold ${30 * scale}px sans-serif`
        ctx.fillText('DD', x - (55 * scale), y)
        
        ctx.font = `bold ${26 * scale}px "Oswald", sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText('DIGITAL', x - (15 * scale), y)
        break
      
      case 'dts_x':
        ctx.fillStyle = 'white'
        ctx.fillRect(x - (70 * scale), y - (20 * scale), 50 * scale, 40 * scale)
        ctx.fillStyle = 'black'
        ctx.font = `bold ${22 * scale}px sans-serif`
        ctx.fillText('DTS', x - (45 * scale), y)
        
        ctx.fillStyle = 'white'
        ctx.font = `bold ${28 * scale}px "Oswald", sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText('DTS:X', x - (10 * scale), y)
        break
      
      case 'imax':
        ctx.fillStyle = 'white'
        ctx.fillRect(x - (60 * scale), y - (25 * scale), 120 * scale, 50 * scale)
        ctx.fillStyle = 'black'
        ctx.font = `bold ${32 * scale}px "Oswald", sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('IMAX', x, y)
        break
    }
    ctx.restore()
  },

  /**
   * Dessine le logo studio
   */
  drawStudioLogo(ctx, logo, x, y, scale) {
    const size = 55 * scale

    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)

    switch (logo) {
      case 'wb': {
        const gradient = ctx.createLinearGradient(x, y - size, x, y + size)
        gradient.addColorStop(0, '#D4A840')
        gradient.addColorStop(1, '#8B6914')
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = '#FFE5A3'
        ctx.lineWidth = 2 * scale
        ctx.stroke()
        
        ctx.fillStyle = 'white'
        ctx.font = `bold italic ${40 * scale}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 3 * scale
        ctx.shadowOffsetY = 1 * scale
        ctx.fillText('WB', x, y)
        break
      }
      case 'universal': {
        const gradient = ctx.createLinearGradient(x, y - size, x, y + size)
        gradient.addColorStop(0, '#2563EB')
        gradient.addColorStop(1, '#1E3A8A')
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2 * scale
        ctx.stroke()
        
        ctx.fillStyle = 'white'
        ctx.font = `bold ${20 * scale}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('UNIV', x, y)
        break
      }
      case 'netflix': {
        ctx.fillStyle = 'black'
        ctx.fill()
        ctx.strokeStyle = '#DC2626'
        ctx.lineWidth = 3 * scale
        ctx.stroke()
        
        ctx.fillStyle = '#DC2626'
        ctx.font = `bold ${48 * scale}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('N', x, y)
        break
      }
      case 'sony': {
        ctx.fillStyle = 'black'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2 * scale
        ctx.stroke()
        
        ctx.fillStyle = 'white'
        ctx.font = `bold ${22 * scale}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('SONY', x, y)
        break
      }
      case 'paramount': {
        const gradient = ctx.createLinearGradient(x, y - size, x, y + size)
        gradient.addColorStop(0, '#60A5FA')
        gradient.addColorStop(1, '#1E40AF')
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2 * scale
        ctx.stroke()
        
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2 * scale
        ctx.beginPath()
        ctx.moveTo(x, y - (25 * scale))
        ctx.lineTo(x + (25 * scale), y + (20 * scale))
        ctx.lineTo(x - (25 * scale), y + (20 * scale))
        ctx.closePath()
        ctx.stroke()
        break
      }
      case 'disney': {
        const gradient = ctx.createLinearGradient(x, y - size, x, y + size)
        gradient.addColorStop(0, '#3B82F6')
        gradient.addColorStop(1, '#6B21A8')
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2 * scale
        ctx.stroke()
        
        ctx.fillStyle = 'white'
        ctx.font = `bold italic ${16 * scale}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('DISNEY', x, y)
        break
      }
    }
    ctx.restore()
  },

  /**
   * Upload du poster print-ready vers Supabase
   */
  async uploadPrintReady(blob, userId, orderId, format) {
    const fileName = `print-${orderId}-${format}-${uuidv4()}.png`
    const filePath = `${userId}/print-ready/${fileName}`

    const { data, error } = await supabase.storage
      .from('ghibli-images')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/png',
      })

    if (error) throw error

    const { data: publicUrl } = supabase.storage
      .from('ghibli-images')
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: publicUrl.publicUrl,
    }
  },
}