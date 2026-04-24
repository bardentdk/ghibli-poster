import express from 'express'
import { supabase, requireAuth } from '../services/supabase.js'
import { emailService } from '../services/emailService.js'

const router = express.Router()

/**
 * POST /api/emails/welcome
 * Route publique car déclenchée juste après le signup
 */
router.post('/welcome', async (req, res) => {
  try {
    const { userId, email, userName } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email requis' })
    }

    console.log('Envoi email bienvenue à:', email)

    const result = await emailService.sendWelcome({ userId, email, userName })
    
    if (result.skipped) {
      return res.json({ skipped: true, message: 'Email désactivé' })
    }

    res.json(result)
  } catch (error) {
    console.error('Erreur email welcome:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

/**
 * POST /api/emails/order-confirmation/:orderId
 */
router.post('/order-confirmation/:orderId', requireAuth, async (req, res) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, posters(*)')
      .eq('id', req.params.orderId)
      .single()

    if (orderError || !order) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
    const isOwner = order.user_id === req.user.id

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    const { data: invoice } = await supabase
      .from('invoices')
      .select('pdf_url')
      .eq('order_id', order.id)
      .maybeSingle()

    const result = await emailService.sendOrderConfirmation({
      order,
      poster: order.posters,
      invoicePdfUrl: invoice?.pdf_url,
    })

    res.json(result)
  } catch (error) {
    console.error('Erreur renvoi email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/emails/shipped/:orderId
 */
router.post('/shipped/:orderId', requireAuth, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Accès admin requis' })
    }

    const { trackingNumber, carrier } = req.body

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.orderId)
      .single()

    if (error || !order) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    await supabase
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber,
        carrier,
        shipped_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    const result = await emailService.sendShipped({
      order: { ...order, tracking_number: trackingNumber, carrier },
      trackingNumber,
      carrier,
    })

    res.json(result)
  } catch (error) {
    console.error('Erreur email shipped:', error.message)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/emails/delivered/:orderId
 */
router.post('/delivered/:orderId', requireAuth, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Accès admin requis' })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.orderId)
      .single()

    if (error || !order) {
      return res.status(404).json({ error: 'Commande introuvable' })
    }

    await supabase
      .from('orders')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    const result = await emailService.sendDelivered({ order })
    res.json(result)
  } catch (error) {
    console.error('Erreur email delivered:', error.message)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/emails/test
 * Route de test pour vérifier la config
 */
router.get('/test', async (req, res) => {
  const config = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM || 'contact@velt.re',
    replyTo: process.env.RESEND_REPLY_TO || 'contact@velt.re',
  }
  res.json(config)
})

export default router