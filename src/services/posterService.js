import { supabase } from '../lib/supabase'

export const posterService = {
  /**
   * Créer un nouveau poster (brouillon)
   */
  async create(posterData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('posters')
      .insert({
        ...posterData,
        user_id: user.id,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour un poster
   */
  async update(posterId, updates) {
    const { data, error } = await supabase
      .from('posters')
      .update(updates)
      .eq('id', posterId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer tous les posters de l'utilisateur
   */
  async getAll() {
    const { data, error } = await supabase
      .from('posters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Récupérer les brouillons uniquement
   */
  async getDrafts() {
    const { data, error } = await supabase
      .from('posters')
      .select('*')
      .eq('status', 'draft')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Récupérer un poster par ID
   */
  async getById(posterId) {
    const { data, error } = await supabase
      .from('posters')
      .select('*')
      .eq('id', posterId)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer un poster
   */
  async delete(posterId) {
    const { error } = await supabase
      .from('posters')
      .delete()
      .eq('id', posterId)

    if (error) throw error
  },
}