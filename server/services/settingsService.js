import { supabase } from './supabase.js'

const cache = new Map()
const CACHE_TTL = 60 * 1000 // 1 minute

export const settingsService = {
  /**
   * Récupère un setting par clé avec cache
   */
  async get(key, forceRefresh = false) {
    if (!forceRefresh && cache.has(key)) {
      const cached = cache.get(key)
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.value
      }
    }

    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) {
      console.error(`Setting ${key} introuvable:`, error)
      return null
    }

    cache.set(key, { value: data.value, timestamp: Date.now() })
    return data.value
  },

  /**
   * Récupère plusieurs settings
   */
  async getMultiple(keys) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', keys)

    if (error) throw error

    const result = {}
    data.forEach(item => {
      result[item.key] = item.value
      cache.set(item.key, { value: item.value, timestamp: Date.now() })
    })
    return result
  },

  /**
   * Met à jour un setting
   */
  async update(key, value) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single()

    if (error) throw error

    cache.set(key, { value: data.value, timestamp: Date.now() })
    return data.value
  },

  /**
   * Vide le cache (utile après une mise à jour)
   */
  clearCache() {
    cache.clear()
  },
}