import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

let stripePromise = null

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

/**
 * Appel API authentifié
 */
const authFetch = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Non authentifié')
  }

  const response = await axios({
    url: `${API_URL}${endpoint}`,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  })

  return response.data
}

export const stripeService = {
  /**
   * Créer une session Stripe Checkout
   */
  async createCheckoutSession({ posterId, format, shippingAddress }) {
    const data = await authFetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      data: { posterId, format, shippingAddress },
    })
    return data
  },

  /**
   * Rediriger vers Stripe Checkout
   */
  async redirectToCheckout(sessionId) {
    const stripe = await getStripe()
    if (!stripe) throw new Error('Stripe non initialisé')

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) throw error
  },

  /**
   * Récupérer les détails d'une session
   */
  async getSession(sessionId) {
    const data = await authFetch(`/api/stripe/session/${sessionId}`)
    return data
  },

  /**
   * Récupérer une commande par session ID
   */
  async getOrderBySession(sessionId) {
    const data = await authFetch(`/api/orders/by-session/${sessionId}`)
    return data.order
  },

  /**
   * Récupérer toutes les commandes
   */
  async getOrders() {
    const data = await authFetch('/api/orders')
    return data.orders
  },

  /**
   * Récupérer une commande par ID
   */
  async getOrderById(orderId) {
    const data = await authFetch(`/api/orders/${orderId}`)
    return data.order
  },
    /**
   * Enregistre l'URL du poster HD auprès de l'API
   */
  async savePrintReadyUrl(orderId, { printReadyUrl, printReadyPath }) {
    const data = await authFetch(`/api/orders/${orderId}/print-ready`, {
      method: 'POST',
      data: { printReadyUrl, printReadyPath },
    })
    return data.order
  },
}