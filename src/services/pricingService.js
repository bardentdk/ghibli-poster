import { supabase } from '../lib/supabase'

export const pricingService = {
  /**
   * Récupérer tous les prix actifs
   */
  async getAll() {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * Récupérer le prix d'un format spécifique
   */
  async getByFormat(format) {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('format', format)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },
}