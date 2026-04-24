import axios from 'axios'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const clientEmailService = {
  /**
   * Déclenche l'email de bienvenue
   */
  async sendWelcome({ userId, email, userName }) {
    try {
      const response = await axios.post(`${API_URL}/api/emails/welcome`, {
        userId,
        email,
        userName,
      })
      return response.data
    } catch (error) {
      console.error('Erreur envoi email bienvenue:', error)
      // On ne throw pas, c'est non-bloquant
      return { error: error.message }
    }
  },
}