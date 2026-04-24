import { motion } from 'framer-motion'
import { Package, Truck, ShieldCheck, Sparkles } from 'lucide-react'

const OrderSummary = ({ poster, format, price }) => {
  if (!poster) return null

  const dimensions = {
    A4: '21 × 29.7 cm',
    A3: '29.7 × 42 cm',
    A2: '42 × 59.4 cm',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:sticky lg:top-24 space-y-6"
    >
      <div className="card-ghibli overflow-hidden p-0">
        <div className="bg-gradient-to-br from-ghibli-forest/10 to-ghibli-moss/10 p-6 pb-4">
          <h3 className="font-display text-2xl text-ghibli-deep flex items-center gap-2">
            <Package className="w-5 h-5 text-ghibli-forest" />
            Votre commande
          </h3>
        </div>

        <div className="p-6 pt-4">
          <div className="flex gap-4 mb-6">
            <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              {poster.ghibli_image_url ? (
                <img
                  src={poster.ghibli_image_url}
                  alt={poster.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-ghibli-cream" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ghibli-deep/60 to-transparent" />
              {poster.title && (
                <div className="absolute bottom-1 left-1 right-1 text-center">
                  <div className="text-white text-[8px] font-display leading-tight">
                    {poster.title}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-ghibli-deep mb-1 truncate">
                {poster.title || 'Affiche Ghibli'}
              </h4>
              {poster.producers && (
                <p className="text-xs text-ghibli-deep/60 mb-2 truncate">
                  {poster.producers}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-ghibli-forest/10 text-ghibli-forest text-xs font-bold rounded-full">
                  {format}
                </span>
                <span className="text-xs text-ghibli-deep/60">
                  {dimensions[format]}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pb-4 border-b border-ghibli-deep/10">
            <div className="flex justify-between text-sm">
              <span className="text-ghibli-deep/70">Affiche {format}</span>
              <span className="font-semibold text-ghibli-deep">{price.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ghibli-deep/70">Livraison</span>
              <span className="font-semibold text-ghibli-forest">Offerte</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-4">
            <span className="font-display text-xl text-ghibli-deep">Total TTC</span>
            <div className="text-right">
              <div className="font-display text-4xl text-ghibli-deep">
                {price.toFixed(2)} €
              </div>
              <div className="text-xs text-ghibli-deep/50">TVA incluse</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-ghibli space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ghibli-forest/10 flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4 text-ghibli-forest" />
          </div>
          <div>
            <div className="font-semibold text-ghibli-deep text-sm">
              Livraison sous 48h
            </div>
            <div className="text-xs text-ghibli-deep/60">
              En France métropolitaine
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ghibli-forest/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-ghibli-forest" />
          </div>
          <div>
            <div className="font-semibold text-ghibli-deep text-sm">
              Paiement sécurisé
            </div>
            <div className="text-xs text-ghibli-deep/60">
              Transaction chiffrée par Stripe
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ghibli-forest/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-ghibli-forest" />
          </div>
          <div>
            <div className="font-semibold text-ghibli-deep text-sm">
              Satisfait ou remboursé
            </div>
            <div className="text-xs text-ghibli-deep/60">
              Garantie 30 jours
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default OrderSummary