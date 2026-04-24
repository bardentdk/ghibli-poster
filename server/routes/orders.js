import express from 'express'
import { supabase, requireAuth } from '../services/supabase.js'

const router = express.Router()

/**
 * GET /api/orders
 * Liste des commandes de l'utilisateur
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ orders: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/orders/:id
 * Détail d'une commande
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    res.json({ order: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/orders/by-session/:sessionId
 * Détail d'une commande par session Stripe
 */
router.get('/by-session/:sessionId', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .eq('stripe_session_id', req.params.sessionId)
      .eq('user_id', req.user.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    res.json({ order: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
/**
 * POST /api/orders/:id/print-ready
 * Enregistre l'URL du poster HD pour impression
 */
router.post('/:id/print-ready', requireAuth, async (req, res) => {
  try {
    const { printReadyUrl, printReadyPath } = req.body

    if (!printReadyUrl) {
      return res.status(400).json({ error: 'URL manquante' })
    }

    // Vérifier que la commande appartient bien à l'utilisateur et est payée
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single()

    if (fetchError || !order) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    if (order.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Commande non payée' })
    }

    // Update
    const { data, error } = await supabase
      .from('orders')
      .update({
        print_ready_url: printReadyUrl,
        print_ready_path: printReadyPath,
        status: 'processing',
      })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    res.json({ order: data, success: true })
  } catch (error) {
    console.error('Erreur print-ready:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/orders/:id/print-status
 * Vérifie si un poster print-ready a été généré
 */
router.get('/:id/print-status', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, print_ready_url, status, payment_status')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    res.json({
      hasPrintReady: !!data.print_ready_url,
      printReadyUrl: data.print_ready_url,
      status: data.status,
      paymentStatus: data.payment_status,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
export default router