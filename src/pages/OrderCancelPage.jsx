import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react'

const OrderCancelPage = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="relative min-h-screen pt-32 pb-20 flex items-center">
      <div className="absolute top-40 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
            Paiement <span className="text-gradient">annulé</span>
          </h1>
          <p className="text-lg text-ghibli-deep/70 mb-8 max-w-xl mx-auto">
            Pas de souci ! Votre affiche est toujours sauvegardée dans vos brouillons.
            Vous pouvez reprendre la commande quand vous le souhaitez.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/drafts"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Retour aux brouillons
          </Link>
          <Link
            to="/create"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Nouvelle création
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
  )
}

export default OrderCancelPage