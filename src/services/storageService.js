import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

/**
 * Convertit une URL (blob, data URL, ou HTTP) en Blob
 * Avec gestion robuste des erreurs
 */
const urlToBlob = async (url) => {
  if (!url) {
    throw new Error('URL vide')
  }

  // Si c'est déjà un Blob ou File, on retourne directement
  if (url instanceof Blob || url instanceof File) {
    return url
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Impossible de récupérer l'image: ${response.status}`)
    }
    return await response.blob()
  } catch (error) {
    // Blob URL expiré ou invalide
    if (url.startsWith('blob:')) {
      throw new Error('BLOB_EXPIRED')
    }
    throw new Error(`Erreur chargement image: ${error.message}`)
  }
}

/**
 * Vérifie si une URL Supabase est accessible
 */
const isSupabaseUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  return url.includes('supabase.co/storage') || url.includes('supabase.in/storage')
}

/**
 * Vérifie si une URL est un blob local (temporaire)
 */
const isBlobUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  return url.startsWith('blob:') || url.startsWith('data:')
}

export const storageService = {
  isSupabaseUrl,
  isBlobUrl,

  /**
   * Upload d'une image originale (fichier ou URL)
   */
  async uploadOriginalImage(fileOrUrl, userId) {
    let blob
    let ext = 'jpg'

    if (fileOrUrl instanceof File) {
      blob = fileOrUrl
      ext = fileOrUrl.name.split('.').pop() || 'jpg'
    } else if (fileOrUrl instanceof Blob) {
      blob = fileOrUrl
      ext = blob.type.split('/')[1] || 'jpg'
    } else if (typeof fileOrUrl === 'string') {
      blob = await urlToBlob(fileOrUrl)
      ext = blob.type.split('/')[1] || 'jpg'
    } else {
      throw new Error('Type de fichier non supporté')
    }

    const fileName = `${uuidv4()}.${ext}`
    const filePath = `${userId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('original-images')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type,
      })

    if (error) throw error

    const { data: signedUrl } = await supabase.storage
      .from('original-images')
      .createSignedUrl(filePath, 3600 * 24 * 7)

    return {
      path: data.path,
      url: signedUrl?.signedUrl,
    }
  },

  /**
   * Upload d'une image Ghibli générée
   */
  async uploadGhibliImage(blobOrUrl, userId) {
    let blob
    
    if (blobOrUrl instanceof Blob) {
      blob = blobOrUrl
    } else if (typeof blobOrUrl === 'string') {
      blob = await urlToBlob(blobOrUrl)
    } else {
      throw new Error('Type non supporté')
    }

    const ext = blob.type.split('/')[1] || 'png'
    const fileName = `${uuidv4()}.${ext}`
    const filePath = `${userId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('ghibli-images')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type,
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

  /**
   * Upload d'une preview
   */
  async uploadPreview(blob, userId) {
    const fileName = `preview-${uuidv4()}.png`
    const filePath = `${userId}/previews/${fileName}`

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

  /**
   * Suppression d'une image
   */
  async deleteImage(bucket, filePath) {
    if (!filePath) return
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Erreur suppression image:', error)
    }
  },

  /**
   * Suppression groupée des images d'un poster
   */
  async deletePosterImages({ originalPath, ghibliPath, previewPath }) {
    const promises = []
    
    if (originalPath) {
      promises.push(this.deleteImage('original-images', originalPath))
    }
    if (ghibliPath) {
      promises.push(this.deleteImage('ghibli-images', ghibliPath))
    }
    if (previewPath) {
      promises.push(this.deleteImage('ghibli-images', previewPath))
    }

    await Promise.allSettled(promises)
  },

  /**
   * Génération d'une URL signée temporaire
   */
  async getSignedUrl(bucket, filePath, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)

    if (error) throw error
    return data.signedUrl
  },
}