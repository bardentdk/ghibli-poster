import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export const storageService = {
  /**
   * Upload d'une image originale
   */
  async uploadOriginalImage(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { data, error } = await supabase.storage
      .from('original-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
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
  async uploadGhibliImage(blob, userId) {
    const fileName = `${uuidv4()}.png`
    const filePath = `${userId}/${fileName}`

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
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
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