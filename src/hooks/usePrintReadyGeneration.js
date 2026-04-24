import { useState } from 'react'
import { posterExportService } from '../services/posterExportService'
import { stripeService } from '../services/stripeService'
import { useAuthStore } from '../store/authStore'
import { preloadFonts } from '../utils/fontLoader'


export const usePrintReadyGeneration = () => {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState({ step: '', progress: 0 })
  const [error, setError] = useState(null)
  const { user } = useAuthStore()

  /**
   * Génère et upload la version HD sans filigrane
   */
  const generateAndUpload = async ({ order, poster }) => {
    if (!order || !poster || !user) {
      throw new Error('Données manquantes')
    }

    // Si déjà généré, on skip
    if (order.print_ready_url) {
      return { alreadyGenerated: true, order }
    }

    setGenerating(true)
    setError(null)

    try {
      await preloadFonts()
      // 1. Générer le blob HD sans filigrane
      setProgress({ step: 'Préparation du fichier d\'impression...', progress: 10 })

      const designConfig = poster.design_config || {}

      const blob = await posterExportService.generatePrintReady({
        imageUrl: poster.ghibli_image_url,
        title: poster.title,
        tagline: poster.description,
        directors: poster.producers,
        releaseDate: designConfig.releaseDate,
        credits: designConfig.credits,
        designConfig,
        format: order.format,
        onProgress: ({ progress: pct }) => {
          setProgress({ 
            step: 'Génération haute résolution...', 
            progress: 10 + Math.floor(pct * 0.5) 
          })
        },
      })

      // 2. Upload vers Supabase Storage
      setProgress({ step: 'Upload du fichier sécurisé...', progress: 70 })

      const { url, path } = await posterExportService.uploadPrintReady(
        blob,
        user.id,
        order.id,
        order.format
      )

      // 3. Enregistrer l'URL dans la commande
      setProgress({ step: 'Finalisation...', progress: 90 })

      const updatedOrder = await stripeService.savePrintReadyUrl(order.id, {
        printReadyUrl: url,
        printReadyPath: path,
      })

      setProgress({ step: 'Terminé !', progress: 100 })
      setGenerating(false)

      return { order: updatedOrder, printReadyUrl: url }
    } catch (err) {
      console.error('Erreur génération print-ready:', err)
      setError(err.message || 'Erreur lors de la génération')
      setGenerating(false)
      throw err
    }
  }

  return {
    generating,
    progress,
    error,
    generateAndUpload,
  }
}