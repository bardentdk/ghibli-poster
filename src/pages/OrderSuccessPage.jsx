import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Check, 
  Package, 
  Mail, 
  Truck, 
  ArrowRight,
  Sparkles,
  Home,
  Printer,
  FileImage
} from 'lucide-react'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import { stripeService } from '../services/stripeService'
import { posterService } from '../services/posterService'
import { usePrintReadyGeneration } from '../hooks/usePrintReadyGeneration'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import PrintReadyModal from '../components/checkout/PrintReadyModal'
import { useCheckoutStore } from '../store/checkoutStore'
import { usePosterStore } from '../store/posterStore'


const OrderSuccessContent = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState(null)
  const [poster, setPoster] = useState(null)
  const [loading, setLoading] = useState(true)
  const [printReady, setPrintReady] = useState(false)
  const resetCheckout = useCheckoutStore((state) => state.reset)
  const resetPoster = usePosterStore((state) => state.reset)
  const { generating, progress, error, generateAndUpload } = usePrintReadyGeneration()
  const hasGeneratedRef = useRef(false)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    const loadOrderAndGenerate = async () => {
      try {
        // Attente du webhook
        let attempts = 0
        let orderData = null

        while (attempts < 5 && (!orderData || orderData.payment_status !== 'paid')) {
          try {
            orderData = await stripeService.getOrderBySession(sessionId)
            if (orderData?.payment_status === 'paid') break
            await new Promise((resolve) => setTimeout(resolve, 1500))
          } catch (err) {
            // retry
          }
          attempts++
        }

        if (!orderData) {
          toast.error('Commande introuvable')
          setLoading(false)
          return
        }

        setOrder(orderData)

        // Charger les détails du poster
        if (orderData.poster_id) {
          const posterData = await posterService.getById(orderData.poster_id)
          setPoster(posterData)

          // Générer le print-ready une seule fois
          if (
            orderData.payment_status === 'paid' && 
            !orderData.print_ready_url && 
            !hasGeneratedRef.current
          ) {
            hasGeneratedRef.current = true
            try {
              const result = await generateAndUpload({ order: orderData, poster: posterData })
              if (result.order) {
                setOrder(result.order)
              }
              setPrintReady(true)
              toast.success('Fichier d\'impression généré avec succès')
            } catch (err) {
              console.error('Échec génération print-ready:', err)
              toast.error('La génération du fichier sera relancée automatiquement')
            }
          } else if (orderData.print_ready_url) {
            setPrintReady(true)
          }
        }

        resetCheckout()
        resetPoster() // Reset complet du poster pour repartir de zéro

        // Confettis
        const duration = 3000
        const end = Date.now() + duration
        const colors = ['#FF8C69', '#4A7C59', '#87CEEB', '#FFD700']

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors,
          })
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors,
          })
          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }
        frame()
      } catch (error) {
        console.error('Erreur chargement commande:', error)
        toast.error('Impossible de charger les détails')
      } finally {
        setLoading(false)
      }
    }

    loadOrderAndGenerate()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-ghibli-forest/20 border-t-ghibli-forest animate-spin" />
          <p className="text-ghibli-deep/60 font-medium">
            Confirmation de votre commande...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative min-h-screen pt-32 pb-20">
        <div className="absolute top-40 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-96 left-0 w-96 h-96 bg-ghibli-forest/10 rounded-full blur-3xl -z-10" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, damping: 10 }}
              className="relative inline-block mb-6"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-ghibli-forest to-ghibli-moss flex items-center justify-center shadow-2xl">
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>

              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-ghibli-forest"
              />

              <div className="absolute -top-4 -right-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-10 h-10 text-ghibli-sunset" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-ghibli-forest/10 rounded-full mb-4">
                <Check className="w-4 h-4 text-ghibli-forest" />
                <span className="text-sm font-semibold text-ghibli-forest">
                  Paiement confirmé
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
                Merci pour votre <span className="text-gradient">commande</span> !
              </h1>
              <p className="text-lg text-ghibli-deep/70 max-w-xl mx-auto">
                Votre affiche unique est désormais en cours de préparation. Nous vous tiendrons informé à chaque étape.
              </p>
            </motion.div>
          </motion.div>

          {/* Indicateur Print-Ready */}
          {printReady && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-ghibli mb-8 bg-gradient-to-br from-ghibli-forest/5 to-ghibli-moss/5 border-2 border-ghibli-forest/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-ghibli-forest flex items-center justify-center flex-shrink-0">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ghibli-deep">
                      Fichier d'impression haute résolution prêt
                    </h3>
                    <Check className="w-5 h-5 text-ghibli-forest" strokeWidth={3} />
                  </div>
                  <p className="text-sm text-ghibli-deep/70">
                    Votre poster a été préparé en 300 DPI (qualité professionnelle) et transmis à notre imprimeur.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card-ghibli mb-8 overflow-hidden p-0"
            >
              <div className="bg-gradient-to-br from-ghibli-forest/10 to-ghibli-moss/10 p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-xs text-ghibli-deep/60 uppercase tracking-wider font-semibold mb-1">
                      Numéro de commande
                    </div>
                    <div className="font-display text-2xl text-ghibli-deep">
                      {order.order_number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ghibli-deep/60 uppercase tracking-wider font-semibold mb-1">
                      Total payé
                    </div>
                    <div className="font-display text-2xl text-ghibli-forest">
                      {order.total_amount.toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {poster && (
                  <div className="flex gap-4 pb-4 border-b border-ghibli-deep/10">
                    <div className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden shadow-md flex-shrink-0">
                      {poster.ghibli_image_url && (
                        <img
                          src={poster.ghibli_image_url}
                          alt={poster.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-ghibli-deep mb-1">
                        {poster.title || 'Affiche Ghibli'}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-ghibli-forest/10 text-ghibli-forest text-xs font-bold rounded-full">
                          {order.format}
                        </span>
                        <span className="text-xs text-ghibli-deep/60">
                          Quantité : {order.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-ghibli-deep/60 uppercase tracking-wider font-semibold mb-2">
                    Livraison à
                  </div>
                  <div className="text-ghibli-deep">
                    <div className="font-semibold">{order.shipping_name}</div>
                    <div className="text-sm">{order.shipping_address_line1}</div>
                    {order.shipping_address_line2 && (
                      <div className="text-sm">{order.shipping_address_line2}</div>
                    )}
                    <div className="text-sm">
                      {order.shipping_postal_code} {order.shipping_city}
                    </div>
                    <div className="text-sm">{order.shipping_country}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="card-ghibli text-center p-6">
              <div className="w-12 h-12 rounded-full bg-ghibli-forest/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-ghibli-forest" />
              </div>
              <div className="font-semibold text-ghibli-deep text-sm mb-1">
                Confirmation envoyée
              </div>
              <div className="text-xs text-ghibli-deep/60">
                Par email
              </div>
            </div>

            <div className="card-ghibli text-center p-6">
              <div className="w-12 h-12 rounded-full bg-ghibli-sunset/10 flex items-center justify-center mx-auto mb-3">
                <FileImage className="w-6 h-6 text-ghibli-sunset" />
              </div>
              <div className="font-semibold text-ghibli-deep text-sm mb-1">
                Fichier HD
              </div>
              <div className="text-xs text-ghibli-deep/60">
                300 DPI préparé
              </div>
            </div>

            <div className="card-ghibli text-center p-6">
              <div className="w-12 h-12 rounded-full bg-ghibli-sky/10 flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-ghibli-sky" />
              </div>
              <div className="font-semibold text-ghibli-deep text-sm mb-1">
                Impression
              </div>
              <div className="text-xs text-ghibli-deep/60">
                Sous 24h ouvrées
              </div>
            </div>

            <div className="card-ghibli text-center p-6">
              <div className="w-12 h-12 rounded-full bg-ghibli-moss/10 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-ghibli-moss" />
              </div>
              <div className="font-semibold text-ghibli-deep text-sm mb-1">
                Livraison
              </div>
              <div className="text-xs text-ghibli-deep/60">
                Sous 48h
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            {order && (
              <Link
                to={`/orders/${order.id}`}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Voir ma commande
              </Link>
            )}
            <Link
              to="/create?new=true"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Créer une autre affiche
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 text-ghibli-deep/70 hover:text-ghibli-deep font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Link>
          </motion.div>
        </div>
      </div>

      <PrintReadyModal isOpen={generating} progress={progress} error={error} />
    </>
  )
}

const OrderSuccessPage = () => {
  return (
    <ProtectedRoute>
      <OrderSuccessContent />
    </ProtectedRoute>
  )
}

export default OrderSuccessPage