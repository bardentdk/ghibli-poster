import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { posterService } from '../services/posterService'
import { pricingService } from '../services/pricingService'
import { stripeService } from '../services/stripeService'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import ShippingForm from '../components/checkout/ShippingForm'
import OrderSummary from '../components/checkout/OrderSummary'
import { useCheckoutStore } from '../store/checkoutStore'

const CheckoutContent = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const posterId = searchParams.get('poster')
  const format = searchParams.get('format') || 'A4'

  const [poster, setPoster] = useState(null)
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { shippingAddress, setShippingAddress } = useCheckoutStore()

  useEffect(() => {
    const load = async () => {
      if (!posterId) {
        toast.error('Aucune affiche sélectionnée')
        navigate('/create')
        return
      }

      try {
        const [posterData, priceData] = await Promise.all([
          posterService.getById(posterId),
          pricingService.getByFormat(format),
        ])

        if (!posterData.ghibli_image_url) {
          toast.error('Affiche incomplète')
          navigate('/drafts')
          return
        }

        setPoster(posterData)
        setPrice(priceData.price)
      } catch (error) {
        console.error('Erreur chargement:', error)
        toast.error('Impossible de charger l\'affiche')
        navigate('/drafts')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [posterId, format])

  const handleSubmit = async (address) => {
    setSubmitting(true)
    setShippingAddress(address)

    try {
      const { url, sessionId } = await stripeService.createCheckoutSession({
        posterId,
        format,
        shippingAddress: address,
      })

      if (url) {
        window.location.href = url
      } else if (sessionId) {
        await stripeService.redirectToCheckout(sessionId)
      }
    } catch (error) {
      console.error('Erreur checkout:', error)
      toast.error(error.response?.data?.error || error.message || 'Erreur de paiement')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-ghibli-forest/20 border-t-ghibli-forest animate-spin" />
          <p className="text-ghibli-deep/60 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute top-40 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-96 left-0 w-96 h-96 bg-ghibli-forest/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            to="/create"
            className="inline-flex items-center gap-2 text-ghibli-deep/70 hover:text-ghibli-forest transition-colors text-sm font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la création
          </Link>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ghibli-forest/10 rounded-full mb-4">
              <CreditCard className="w-4 h-4 text-ghibli-forest" />
              <span className="text-sm font-semibold text-ghibli-forest">
                Finalisation de commande
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
              Presque <span className="text-gradient">fini</span>
            </h1>
            <p className="text-lg text-ghibli-deep/70">
              Renseignez votre adresse de livraison pour recevoir votre affiche.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <ShippingForm
              onSubmit={handleSubmit}
              defaultValues={shippingAddress}
              loading={submitting}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2 text-xs text-ghibli-deep/60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Paiement 100% sécurisé par Stripe</span>
            </motion.div>
          </div>

          <OrderSummary poster={poster} format={format} price={price} />
        </div>
      </div>
    </div>
  )
}

const CheckoutPage = () => {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  )
}

export default CheckoutPage