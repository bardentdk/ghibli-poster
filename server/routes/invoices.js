import express from 'express'
import { supabase, requireAuth } from '../services/supabase.js'
import { invoiceService } from '../services/invoiceService.js'
import { pdfService } from '../services/pdfService.js'
import { getTemplateList } from '../templates/invoices/index.js'

const router = express.Router()

const requireAdmin = async (req, res, next) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Accès admin requis' })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * POST /api/invoices/generate/:orderId
 * Génère une facture pour une commande
 */
router.post('/generate/:orderId', requireAuth, async (req, res) => {
  try {
    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', req.params.orderId)
      .single()

    if (!order) return res.status(404).json({ error: 'Commande introuvable' })

    // Vérifier les droits
    if (order.user_id !== req.user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single()

      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        return res.status(403).json({ error: 'Accès refusé' })
      }
    }

    const invoice = await invoiceService.generateForOrder(req.params.orderId)
    res.json({ invoice })
  } catch (error) {
    console.error('Erreur génération facture:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/invoices/download/:invoiceId
 * Récupère l'URL de téléchargement
 */
router.get('/download/:invoiceId', requireAuth, async (req, res) => {
  try {
    const url = await invoiceService.getDownloadUrl(req.params.invoiceId, req.user.id)
    res.json({ url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/invoices
 * Liste des factures (user ou admin)
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    const isAdmin = ['admin', 'super_admin'].includes(profile?.role)

    let query = supabase
      .from('invoices')
      .select('*, orders(*)')
      .order('created_at', { ascending: false })

    if (!isAdmin) {
      query = query.eq('user_id', req.user.id)
    }

    const { data, error } = await query

    if (error) throw error
    res.json({ invoices: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/invoices/preview
 * Génère une preview HTML (admin uniquement)
 */
router.post('/preview', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { templateSlug, designConfig } = req.body

    const html = await invoiceService.generatePreview({
      templateSlug,
      designConfig,
    })

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (error) {
    console.error('Erreur preview:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/invoices/preview-pdf
 * Génère une preview PDF (admin uniquement)
 */
router.post('/preview-pdf', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { templateSlug, designConfig } = req.body

    const html = await invoiceService.generatePreview({
      templateSlug,
      designConfig,
    })

    const pdfBuffer = await pdfService.generateFromHtml(html)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Erreur preview PDF:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/invoices/regenerate/:invoiceId
 * Régénère une facture (admin)
 */
router.post('/regenerate/:invoiceId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const invoice = await invoiceService.regenerate(req.params.invoiceId)
    res.json({ invoice })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/invoices/templates
 * Liste des templates disponibles
 */
router.get('/templates', (req, res) => {
  res.json({ templates: getTemplateList() })
})

export default router