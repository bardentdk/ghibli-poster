import { supabase } from '../lib/supabase'
import { storageService } from './storageService'

export const posterService = {
  /**
   * Créer un nouveau poster (brouillon)
   */
  async create(posterData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const designConfig = posterData.designConfig || {}
    
    // On stocke releaseDate et credits dans design_config
    if (posterData.releaseDate !== undefined) {
      designConfig.releaseDate = posterData.releaseDate
    }
    if (posterData.credits !== undefined) {
      designConfig.credits = posterData.credits
    }

    const { data, error } = await supabase
      .from('posters')
      .insert({
        user_id: user.id,
        title: posterData.title || 'Sans titre',
        producers: posterData.directors || null, // directors → producers (colonne DB)
        description: posterData.tagline || null,  // tagline → description (colonne DB)
        original_image_url: posterData.originalImageUrl || null,
        ghibli_image_url: posterData.ghibliImageUrl || null,
        preview_image_url: posterData.previewImageUrl || null,
        format: posterData.format || 'A4',
        status: 'draft',
        design_config: designConfig,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour un poster existant
   */
  async update(posterId, updates) {
    const updateData = {}
    
    if (updates.title !== undefined) updateData.title = updates.title || 'Sans titre'
    if (updates.directors !== undefined) updateData.producers = updates.directors
    if (updates.tagline !== undefined) updateData.description = updates.tagline
    if (updates.originalImageUrl !== undefined) updateData.original_image_url = updates.originalImageUrl
    if (updates.ghibliImageUrl !== undefined) updateData.ghibli_image_url = updates.ghibliImageUrl
    if (updates.previewImageUrl !== undefined) updateData.preview_image_url = updates.previewImageUrl
    if (updates.format !== undefined) updateData.format = updates.format
    if (updates.status !== undefined) updateData.status = updates.status
    
    // Gestion du design_config avec merge des nouveaux champs
    if (updates.designConfig !== undefined || updates.releaseDate !== undefined || updates.credits !== undefined) {
      // Récupérer le design_config existant
      const { data: existing } = await supabase
        .from('posters')
        .select('design_config')
        .eq('id', posterId)
        .single()
      
      const mergedConfig = {
        ...(existing?.design_config || {}),
        ...(updates.designConfig || {}),
      }
      
      if (updates.releaseDate !== undefined) mergedConfig.releaseDate = updates.releaseDate
      if (updates.credits !== undefined) mergedConfig.credits = updates.credits
      
      updateData.design_config = mergedConfig
    }

    const { data, error } = await supabase
      .from('posters')
      .update(updateData)
      .eq('id', posterId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Créer ou mettre à jour un brouillon complet avec upload des images
   * Robuste face aux blob URLs expirés
   */
  async saveDraft({
    posterId,
    originalImage,
    originalImageUrl,
    ghibliImageUrl,
    title,
    directors,
    tagline,
    releaseDate,
    credits,
    format,
    designConfig,
    onProgress = () => {},
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    onProgress({ step: 'init', progress: 0 })

    let uploadedOriginalUrl = null
    let uploadedGhibliUrl = null

    // Récupérer le brouillon existant si on a un ID
    let existingPoster = null
    if (posterId) {
      try {
        const { data } = await supabase
          .from('posters')
          .select('*')
          .eq('id', posterId)
          .eq('user_id', user.id)
          .single()
        existingPoster = data
      } catch (err) {
        console.log('Brouillon non trouvé, création d\'un nouveau')
      }
    }

    // === GESTION IMAGE ORIGINALE ===
    const needsOriginalUpload = 
      originalImage instanceof File || 
      originalImage instanceof Blob ||
      (originalImageUrl && storageService.isBlobUrl(originalImageUrl))

    if (needsOriginalUpload) {
      onProgress({ step: 'uploading_original', progress: 20 })
      
      try {
        const source = originalImage || originalImageUrl
        const result = await storageService.uploadOriginalImage(source, user.id)
        uploadedOriginalUrl = result.url
      } catch (error) {
        // Si le blob est expiré, on garde l'URL existante
        if (error.message === 'BLOB_EXPIRED') {
          console.warn('Blob URL original expiré, on garde l\'URL existante')
          uploadedOriginalUrl = existingPoster?.original_image_url || null
        } else {
          console.error('Erreur upload original:', error)
          // On continue quand même, l'original n'est pas critique
          uploadedOriginalUrl = existingPoster?.original_image_url || null
        }
      }
    } else if (originalImageUrl && storageService.isSupabaseUrl(originalImageUrl)) {
      uploadedOriginalUrl = originalImageUrl
    } else if (existingPoster?.original_image_url) {
      uploadedOriginalUrl = existingPoster.original_image_url
    }

    // === GESTION IMAGE GHIBLI (critique) ===
    const needsGhibliUpload = ghibliImageUrl && storageService.isBlobUrl(ghibliImageUrl)

    if (needsGhibliUpload) {
      onProgress({ step: 'uploading_ghibli', progress: 50 })
      
      try {
        const result = await storageService.uploadGhibliImage(ghibliImageUrl, user.id)
        uploadedGhibliUrl = result.url
      } catch (error) {
        if (error.message === 'BLOB_EXPIRED') {
          // Si on a déjà une version Supabase, on la garde
          if (existingPoster?.ghibli_image_url && storageService.isSupabaseUrl(existingPoster.ghibli_image_url)) {
            console.warn('Blob expiré, utilisation de l\'URL existante')
            uploadedGhibliUrl = existingPoster.ghibli_image_url
          } else {
            throw new Error('L\'image générée n\'est plus accessible. Veuillez régénérer votre affiche.')
          }
        } else {
          console.error('Erreur upload Ghibli:', error)
          throw new Error('Erreur lors de l\'upload de l\'image Ghibli: ' + error.message)
        }
      }
    } else if (ghibliImageUrl && storageService.isSupabaseUrl(ghibliImageUrl)) {
      uploadedGhibliUrl = ghibliImageUrl
    } else if (existingPoster?.ghibli_image_url) {
      uploadedGhibliUrl = existingPoster.ghibli_image_url
    }

    // Vérification finale : on doit avoir une image Ghibli valide
    if (!uploadedGhibliUrl) {
      throw new Error('Aucune image Ghibli disponible pour la sauvegarde')
    }

    onProgress({ step: 'saving', progress: 80 })

    const posterData = {
      title: title || 'Sans titre',
      directors,
      tagline,
      originalImageUrl: uploadedOriginalUrl,
      ghibliImageUrl: uploadedGhibliUrl,
      format: format || 'A4',
      designConfig: designConfig || {},
      releaseDate,
      credits,
    }

    let result
    if (posterId && existingPoster) {
      result = await this.update(posterId, posterData)
    } else {
      result = await this.create(posterData)
    }

    onProgress({ step: 'completed', progress: 100 })
    return result
  },

  /**
   * Récupérer tous les posters
   */
  async getAll(filters = {}) {
    let query = supabase
      .from('posters')
      .select('*')
      .order('updated_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getDrafts() {
    return this.getAll({ status: 'draft' })
  },

  async getById(posterId) {
    const { data, error } = await supabase
      .from('posters')
      .select('*')
      .eq('id', posterId)
      .single()

    if (error) throw error
    return data
  },

  async delete(posterId) {
    const poster = await this.getById(posterId)
    
    const getPathFromUrl = (url, bucket) => {
      if (!url) return null
      try {
        const match = url.match(new RegExp(`${bucket}/(.+?)(?:\\?|$)`))
        return match ? match[1] : null
      } catch {
        return null
      }
    }

    const originalPath = getPathFromUrl(poster.original_image_url, 'original-images')
    const ghibliPath = getPathFromUrl(poster.ghibli_image_url, 'ghibli-images')
    const previewPath = getPathFromUrl(poster.preview_image_url, 'ghibli-images')

    await storageService.deletePosterImages({
      originalPath,
      ghibliPath,
      previewPath,
    })

    const { error } = await supabase
      .from('posters')
      .delete()
      .eq('id', posterId)

    if (error) throw error
  },

  async duplicate(posterId) {
    const original = await this.getById(posterId)
    
    const { data, error } = await supabase
      .from('posters')
      .insert({
        user_id: original.user_id,
        title: `${original.title} (copie)`,
        producers: original.producers,
        description: original.description,
        original_image_url: original.original_image_url,
        ghibli_image_url: original.ghibli_image_url,
        preview_image_url: original.preview_image_url,
        format: original.format,
        status: 'draft',
        design_config: original.design_config,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}