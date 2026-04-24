import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn('Variables Supabase manquantes dans server/.env')
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * Vérifie le token JWT de l'utilisateur
 */
export const verifyUser = async (token) => {
  if (!token) throw new Error('Token manquant')
  
  const { data, error } = await supabase.auth.getUser(token)
  
  if (error || !data.user) {
    throw new Error('Utilisateur non authentifié')
  }
  
  return data.user
}

/**
 * Middleware Express pour vérifier l'authentification
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const token = authHeader.substring(7)
    const user = await verifyUser(token)
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}