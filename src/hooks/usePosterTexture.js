import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Hook qui génère une texture Three.js à partir d'un canvas HTML
 * contenant l'image Ghibli + les textes superposés
 */
export const usePosterTexture = ({
  imageUrl,
  title,
  producers,
  description,
  width = 1200,
  height = 1600,
}) => {
  const [texture, setTexture] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!imageUrl) return

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvasRef.current = canvas
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      ctx.clearRect(0, 0, width, height)

      // Dessiner l'image de fond (cover)
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

      // Overlay dégradé sombre en bas
      const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Textes
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetY = 4

      // Producteurs (au-dessus du titre)
      if (producers) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.font = '600 28px Quicksand, sans-serif'
        const spacing = 8
        const text = producers.toUpperCase().split('').join(String.fromCharCode(8201))
        ctx.fillText(text, width / 2, height - 280)
      }

      // Titre principal
      if (title) {
        ctx.fillStyle = 'white'
        ctx.font = '400 110px "Playfair Display", serif'
        
        // Wrap text si trop long
        const maxWidth = width * 0.85
        const words = title.split(' ')
        let lines = []
        let currentLine = words[0] || ''
        
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth) {
            lines.push(currentLine)
            currentLine = words[i]
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine)

        const lineHeight = 120
        const startY = height - 200 - (lines.length - 1) * lineHeight / 2
        lines.forEach((line, i) => {
          ctx.fillText(line, width / 2, startY + i * lineHeight)
        })
      }

      // Description
      if (description) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.font = 'italic 400 32px Quicksand, sans-serif'
        
        const maxWidth = width * 0.75
        const words = description.split(' ')
        let lines = []
        let currentLine = words[0] || ''
        
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth) {
            lines.push(currentLine)
            currentLine = words[i]
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine)

        const lineHeight = 42
        lines.forEach((line, i) => {
          ctx.fillText(line, width / 2, height - 90 + i * lineHeight)
        })
      }

      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0

      const newTexture = new THREE.CanvasTexture(canvas)
      newTexture.anisotropy = 16
      newTexture.colorSpace = THREE.SRGBColorSpace
      newTexture.needsUpdate = true
      
      setTexture(newTexture)
    }

    img.onerror = () => {
      console.error('Erreur chargement image pour texture')
    }

    img.src = imageUrl

    return () => {
      if (texture) {
        texture.dispose()
      }
    }
  }, [imageUrl, title, producers, description, width, height])

  return texture
}