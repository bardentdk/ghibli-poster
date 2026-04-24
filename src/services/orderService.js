import { supabase } from '../lib/supabase'

export const orderService = {
  /**
   * Créer une nouvelle commande
   */
  async create(orderData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté')

    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer toutes les commandes de l'utilisateur
   */
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Récupérer une commande par ID
   */
  async getById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer une commande par numéro
   */
  async getByOrderNumber(orderNumber) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    return data
  },
}