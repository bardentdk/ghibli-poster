import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RATINGS } from '../config/posterBadges'

/**
 * Génère une texture Three.js qui reproduit fidèlement le style affiche de film
 */
export const usePosterTexture = ({
  imageUrl,
  title,
  tagline,
  directors,
  releaseDate,
  credits,
  designConfig = {},
  logoUrl = '/assets/logo.png',
  width = 1414,
  height = 2000,
}) => {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!imageUrl) return

    const {
      titleFont = 'condensed',
      accentColor = '#E74C3C',
      rating = 'none',
      audioBadge = 'none',
      studioLogo = 'none',
      showParentalAdvisory = false,
      showDateVertical = true,
    } = designConfig

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = async () => {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // === IMAGE DE FOND (cover) ===
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

      // === FILIGRANE ===
      await drawWatermark(ctx, width, height, logoUrl)

      // === FROM THE DIRECTORY OF ===
      const directorsParts = directors
        ? directors.split(/\s*&\s*|\s+et\s+|\s*,\s*/).filter(Boolean).slice(0, 2)
        : []

      if (directorsParts.length > 0) {
        ctx.save()
        ctx.textAlign = 'center'
        ctx.font = 'bold 28px "Oswald", sans-serif'
        
        const prefix = 'FROM THE DIRECTORY OF '
        const prefixWidth = ctx.measureText(prefix).width
        
        const namesText = directorsParts.join(' & ').toUpperCase()
        const namesWidth = ctx.measureText(namesText).width
        
        const totalWidth = prefixWidth + namesWidth
        const startX = (width - totalWidth) / 2
        const y = 80
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.textAlign = 'left'
        ctx.letterSpacing = '0.25em'
        ctx.fillText(prefix, startX, y)
        
        ctx.fillStyle = accentColor
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
      if (title) {
        ctx.save()
        ctx.textAlign = 'center'
        ctx.fillStyle = 'white'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
        ctx.shadowBlur = 20
        ctx.shadowOffsetY = 4

        const fontMap = {
          condensed: 'bold 220px "Oswald", sans-serif',
          elegant: '400 200px "Playfair Display", serif',
          display: 'bold 240px "Bebas Neue", sans-serif',
          handwritten: '400 220px "Caveat", cursive',
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

        const lineHeight = titleFont === 'condensed' ? 200 : 220
        const startY = 200 + (directorsParts.length > 0 ? 40 : 0)
        
        lines.forEach((line, i) => {
          ctx.fillText(line, width / 2, startY + i * lineHeight)
        })
        ctx.restore()

        // === TAGLINE (juste après le titre) ===
        if (tagline) {
          ctx.save()
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          ctx.font = 'italic 600 36px "Quicksand", sans-serif'
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
          ctx.shadowBlur = 8
          
          const taglineY = startY + lines.length * lineHeight + 40
          ctx.fillText(tagline.toUpperCase(), width / 2, taglineY)
          ctx.restore()
        }
      }

      // === DATE VERTICALE À GAUCHE ===
      if (showDateVertical && releaseDate) {
        ctx.save()
        ctx.translate(70, height - 500)
        ctx.rotate(-Math.PI / 2)
        ctx.fillStyle = 'white'
        ctx.font = 'bold 44px "Oswald", sans-serif'
        ctx.textAlign = 'left'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 10
        ctx.fillText(releaseDate.toUpperCase(), 0, 0)
        ctx.restore()
      }

      // === RATING BADGE À DROITE ===
      if (rating !== 'none') {
        const ratingConfig = RATINGS.find((r) => r.value === rating)
        if (ratingConfig) {
          const badgeX = width - 130
          const badgeY = height - 440
          const badgeRadius = 60

          ctx.save()
          ctx.beginPath()
          ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2)
          ctx.fillStyle = ratingConfig.color
          ctx.fill()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 3
          ctx.stroke()

          ctx.fillStyle = 'white'
          ctx.font = 'bold 42px "Oswald", sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(ratingConfig.label, badgeX, badgeY)
          ctx.restore()
        }
      }

      // === CRÉDITS (texte long en bas) ===
      if (credits) {
        ctx.save()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.font = '300 26px "Oswald", sans-serif'
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

        const creditsY = height - 220
        const lineHeight = 34
        lines.slice(0, 5).forEach((line, i) => {
          ctx.fillText(line, width / 2, creditsY + i * lineHeight)
        })
        ctx.restore()
      }

      // === PARENTAL ADVISORY (en bas à gauche) ===
      if (showParentalAdvisory) {
        const paX = 80
        const paY = height - 140
        const paWidth = 100
        const paHeight = 120

        ctx.save()
        ctx.fillStyle = 'black'
        ctx.fillRect(paX, paY, paWidth, paHeight)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.strokeRect(paX, paY, paWidth, paHeight)

        ctx.fillStyle = 'white'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('PARENTAL', paX + paWidth / 2, paY + 25)
        ctx.fillText('ADVISORY', paX + paWidth / 2, paY + 45)

        ctx.font = 'bold 10px sans-serif'
        ctx.fillText('EXPLICIT', paX + paWidth / 2, paY + 85)
        ctx.fillText('CONTENT', paX + paWidth / 2, paY + 100)
        ctx.restore()
      }

      // === AUDIO BADGE (en bas au centre) ===
      if (audioBadge !== 'none') {
        drawAudioBadge(ctx, audioBadge, width / 2, height - 90)
      }

      // === STUDIO LOGO (en bas à droite) ===
      if (studioLogo !== 'none') {
        drawStudioLogo(ctx, studioLogo, width - 140, height - 140)
      }

      // === CRÉATION TEXTURE ===
      const newTexture = new THREE.CanvasTexture(canvas)
      newTexture.anisotropy = 16
      newTexture.colorSpace = THREE.SRGBColorSpace
      newTexture.needsUpdate = true
      setTexture(newTexture)
    }

    img.onerror = () => {
      console.error('Erreur chargement image')
    }

    img.src = imageUrl

    return () => {
      if (texture) texture.dispose()
    }
  }, [imageUrl, title, tagline, directors, releaseDate, credits, JSON.stringify(designConfig), logoUrl, width, height])

  return texture
}

// === HELPER : Dessin du filigrane ===
const drawWatermark = async (ctx, width, height, logoUrl) => {
  return new Promise((resolve) => {
    const logoImg = new Image()
    logoImg.crossOrigin = 'anonymous'
    
    logoImg.onload = () => {
      ctx.save()
      ctx.globalAlpha = 0.15
      ctx.filter = 'grayscale(100%) brightness(1.5)'
      
      ctx.translate(width / 2, height / 2)
      ctx.rotate(-Math.PI / 6) // -30 degrés
      ctx.translate(-width / 2, -height / 2)
      
      const logoSize = 200
      const spacing = 280
      
      for (let y = -height; y < height * 2; y += spacing) {
        for (let x = -width; x < width * 2; x += spacing) {
          ctx.drawImage(logoImg, x, y, logoSize, logoSize)
        }
      }
      ctx.restore()
      resolve()
    }
    
    logoImg.onerror = () => {
      // Si pas de logo, on ignore et on continue
      console.warn('Logo filigrane introuvable:', logoUrl)
      resolve()
    }
    
    logoImg.src = logoUrl
  })
}

// === HELPER : Dessin du badge audio ===
const drawAudioBadge = (ctx, badge, x, y) => {
  ctx.save()
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  switch (badge) {
    case 'dolby_atmos':
      // Icône Dolby
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.strokeRect(x - 90, y - 30, 50, 60)
      
      ctx.font = 'bold 30px sans-serif'
      ctx.fillText('DD', x - 65, y)
      
      // Texte ATMOS
      ctx.font = 'bold 28px "Oswald", sans-serif'
      ctx.textAlign = 'left'
      ctx.letterSpacing = '0.15em'
      ctx.fillText('ATMOS', x - 20, y)
      break
    
    case 'dolby_digital':
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.strokeRect(x - 80, y - 30, 50, 60)
      
      ctx.font = 'bold 30px sans-serif'
      ctx.fillText('DD', x - 55, y)
      
      ctx.font = 'bold 26px "Oswald", sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('DIGITAL', x - 15, y)
      break
    
    case 'dts_x':
      ctx.fillStyle = 'white'
      ctx.fillRect(x - 70, y - 20, 50, 40)
      ctx.fillStyle = 'black'
      ctx.font = 'bold 22px sans-serif'
      ctx.fillText('DTS', x - 45, y)
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold 28px "Oswald", sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('DTS:X', x - 10, y)
      break
    
    case 'imax':
      ctx.fillStyle = 'white'
      ctx.fillRect(x - 60, y - 25, 120, 50)
      ctx.fillStyle = 'black'
      ctx.font = 'bold 32px "Oswald", sans-serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '0.2em'
      ctx.fillText('IMAX', x, y)
      break
  }
  ctx.restore()
}

// === HELPER : Dessin du logo studio ===
const drawStudioLogo = (ctx, logo, x, y) => {
  const size = 55

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
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold italic 40px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 3
      ctx.shadowOffsetY = 1
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
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('UNIV', x, y)
      break
    }
    case 'netflix': {
      ctx.fillStyle = 'black'
      ctx.fill()
      ctx.strokeStyle = '#DC2626'
      ctx.lineWidth = 3
      ctx.stroke()
      
      ctx.fillStyle = '#DC2626'
      ctx.font = 'bold 48px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('N', x, y)
      break
    }
    case 'sony': {
      ctx.fillStyle = 'black'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold 22px sans-serif'
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
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, y - 25)
      ctx.lineTo(x + 25, y + 20)
      ctx.lineTo(x - 25, y + 20)
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
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = 'white'
      ctx.font = 'bold italic 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('DISNEY', x, y)
      break
    }
  }
  ctx.restore()
}