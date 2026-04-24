import axios from 'axios'
import { supabase } from '../lib/supabase'

/**
 * Service pour la transformation IA en style Ghibli
 * À configurer avec ton API de choix (Replicate, OpenAI, Stability AI, etc.)
 */
export const aiService = {
  /**
   * Transforme une image en style Ghibli
   * @param {File|Blob} imageFile - Le fichier image à transformer
   * @param {Function} onProgress - Callback de progression (0-100)
   * @returns {Promise<Blob>} - L'image transformée en blob
   */
  async transformToGhibli(imageFile, onProgress = () => {}) {
    // ========================================
    // MODE SIMULATION (pour dev sans API)
    // ========================================
    // On simule le processus pour pouvoir tester l'UX
    // À remplacer par ton vrai appel API
    
    return new Promise((resolve, reject) => {
      try {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15
          if (progress >= 100) {
            progress = 100
            onProgress(100)
            clearInterval(interval)
            
            // Retourne l'image originale pour le moment
            // En production : retourne l'image transformée par l'IA
            setTimeout(() => {
              resolve(imageFile)
            }, 500)
          } else {
            onProgress(Math.floor(progress))
          }
        }, 300)
      } catch (error) {
        reject(error)
      }
    })

    // ========================================
    // VRAIE IMPLÉMENTATION (à décommenter)
    // ========================================
    /*
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('style', 'ghibli')

      onProgress(10)

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/transform`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 30) / progressEvent.total)
            onProgress(10 + percent)
          },
        }
      )

      onProgress(70)

      // Si l'API retourne une URL, on télécharge le résultat
      if (response.data.imageUrl) {
        const imageResponse = await axios.get(response.data.imageUrl, {
          responseType: 'blob',
        })
        onProgress(100)
        return imageResponse.data
      }

      // Si l'API retourne directement le blob en base64
      if (response.data.imageBase64) {
        onProgress(100)
        const byteCharacters = atob(response.data.imageBase64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: 'image/png' })
      }

      throw new Error('Format de réponse IA invalide')
    } catch (error) {
      console.error('Erreur transformation IA:', error)
      throw new Error(error.response?.data?.message || 'La transformation a échoué')
    }
    */
  },

  /**
   * Enregistre la génération dans la base de données
   */
  async logGeneration({ userId, posterId, originalUrl, generatedUrl, status, processingTime }) {
    const { data, error } = await supabase
      .from('ai_generations')
      .insert({
        user_id: userId,
        poster_id: posterId,
        original_image_url: originalUrl,
        generated_image_url: generatedUrl,
        status,
        processing_time_ms: processingTime,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}