import express from 'express'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import { supabase, requireAuth } from '../services/supabase.js'

dotenv.config()

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
})

/**
 * POST /api/stripe/create-checkout-session
 * Créer une session de paiement Stripe
 */
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const { posterId, format, shippingAddress } = req.body

    if (!posterId || !format || !shippingAddress) {
      return res.status(400).json({ error: 'Paramètres manquants' })
    }

    // Vérifier que le poster appartient à l'utilisateur
    const { data: poster, error: posterError } = await supabase
      .from('posters')
      .select('*')
      .eq('id', posterId)
      .eq('user_id', req.user.id)
      .single()

    if (posterError || !poster) {
      return res.status(404).json({ error: 'Poster introuvable' })
    }

    // Récupérer le prix du format
    const { data: pricing, error: pricingError } = await supabase
      .from('pricing')
      .select('*')
      .eq('format', format)
      .eq('is_active', true)
      .single()

    if (pricingError || !pricing) {
      return res.status(400).json({ error: 'Format invalide' })
    }

    // Récupérer ou créer le customer Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single()

    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: req.user.id },
      })
      stripeCustomerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', req.user.id)
    }

    // Créer une commande en attente
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        poster_id: posterId,
        format,
        quantity: 1,
        unit_price: pricing.price,
        shipping_cost: 0,
        total_amount: pricing.price,
        currency: 'EUR',
        payment_status: 'pending',
        status: 'pending',
        shipping_name: shippingAddress.name,
        shipping_email: shippingAddress.email,
        shipping_phone: shippingAddress.phone || null,
        shipping_address_line1: shippingAddress.addressLine1,
        shipping_address_line2: shippingAddress.addressLine2 || null,
        shipping_city: shippingAddress.city,
        shipping_postal_code: shippingAddress.postalCode,
        shipping_country: shippingAddress.country || 'France',
        customer_notes: shippingAddress.notes || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Erreur création commande:', orderError)
      return res.status(500).json({ error: 'Impossible de créer la commande' })
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Affiche Ghibli ${format} - ${poster.title}`,
              description: `Format ${format} (${pricing.format === 'A4' ? '21×29.7cm' : pricing.format === 'A3' ? '29.7×42cm' : '42×59.4cm'})`,
              images: poster.ghibli_image_url ? [poster.ghibli_image_url] : [],
              metadata: {
                poster_id: posterId,
                format,
              },
            },
            unit_amount: Math.round(pricing.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/orders/cancel?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        user_id: req.user.id,
        poster_id: posterId,
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          user_id: req.user.id,
          order_number: order.order_number,
        },
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      locale: 'fr',
    })

    // Sauvegarder la session ID dans la commande
    await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
      })
      .eq('id', order.id)

    res.json({
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error('Erreur Stripe:', error)
    res.status(500).json({ error: error.message || 'Erreur de paiement' })
  }
})

/**
 * GET /api/stripe/session/:sessionId
 * Récupérer les détails d'une session Stripe
 */
router.get('/session/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    })

    if (session.metadata.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' })
    }

    res.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      orderId: session.metadata.order_id,
    })
  } catch (error) {
    console.error('Erreur récupération session:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/stripe/webhook
 * Webhook pour confirmer les paiements
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata.order_id

        console.log('Paiement confirmé pour commande:', orderId)

        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            stripe_payment_intent_id: session.payment_intent,
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        // Récupération de la commande mise à jour avec les détails
        const { data: order } = await supabase
          .from('orders')
          .select('*, posters(*)')
          .eq('id', orderId)
          .single()

        if (order?.poster_id) {
          await supabase
            .from('posters')
            .update({ status: 'ordered' })
            .eq('id', order.poster_id)
        }

        // Génération asynchrone de la facture et envoi des emails
        if (order) {
          // On ne bloque pas la réponse webhook
          Promise.resolve().then(async () => {
            try {
              // 1. Générer la facture
              const { invoiceService } = await import('../services/invoiceService.js')
              const invoice = await invoiceService.generateForOrder(order.id)
              console.log('Facture générée:', invoice.invoice_number)

              // 2. Envoyer l'email de confirmation avec facture en PJ
              const { emailService } = await import('../services/emailService.js')
              await emailService.sendOrderConfirmation({
                order,
                poster: order.posters,
                invoicePdfUrl: invoice.pdf_url,
              })
              console.log('Email de confirmation envoyé à:', order.shipping_email)
            } catch (err) {
              console.error('Erreur post-paiement (facture/email):', err.message)
            }
          })
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.order_id

        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
          })
          .eq('id', orderId)

        console.log('Paiement échoué pour commande:', orderId)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object
        const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent)
        const orderId = paymentIntent.metadata.order_id

        await supabase
          .from('orders')
          .update({
            payment_status: 'refunded',
            status: 'cancelled',
          })
          .eq('id', orderId)
        break
      }

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Erreur webhook:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router