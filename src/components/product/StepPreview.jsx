import { motion } from 'framer-motion'
import WebGLErrorBoundary from '../3d/WebGLErrorBoundary'
import { useState, useEffect } from 'react'
import { 
  Eye, 
  ArrowLeft, 
  Save, 
  ShoppingCart, 
  Ruler, 
  RotateCw, 
  Pause, 
  Play,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import { usePosterStore } from '../../store/posterStore'
import { useAuthStore } from '../../store/authStore'
import { pricingService } from '../../services/pricingService'
import PosterScene from '../3d/PosterScene'
import { useAuthModal } from '../auth/AuthModal'


const formats = [
  { value: 'A4', label: 'A4', dimensions: '21 × 29.7 cm', description: 'Format bureau' },
  { value: 'A3', label: 'A3', dimensions: '29.7 × 42 cm', description: 'Format salon' },
  { value: 'A2', label: 'A2', dimensions: '42 × 59.4 cm', description: 'Grand format' },
]

const StepPreview = () => {
  const {
    ghibliImageUrl,
    title,
    producers,
    description,
    format,
    setFormat,
    prevStep,
  } = usePosterStore()
  const { user } = useAuthStore()

  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const data = await pricingService.getAll()
        setPricing(data)
      } catch (error) {
        console.error('Erreur chargement tarifs:', error)
      }
    }
    loadPricing()
  }, [])

  const currentPrice = pricing.find((p) => p.format === format)?.price || 0

  const handleSaveDraft = async () => {
    if (!user) {
      useAuthModal.getState().open({
        mode: 'signup',
        title: <>Sauvegardez<br />votre <span className="italic">création</span></>,
        subtitle: 'Créez un compte pour ne pas perdre votre magnifique affiche et la retrouver plus tard.',
        onSuccess: () => {
          toast.success('Compte créé ! Sauvegarde en cours...')
          // TODO: implémenter la vraie sauvegarde
        },
      })
      return
    }
    
    setLoading(true)
    try {
      toast.success('Brouillon sauvegardé (à implémenter)')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!user) {
      useAuthModal.getState().open({
        mode: 'login',
        title: <>Finalisez<br />votre <span className="italic">commande</span></>,
        subtitle: 'Connectez-vous ou créez un compte pour passer commande en quelques clics.',
        onSuccess: () => {
          toast.success('Connexion réussie ! Redirection vers le paiement...')
          // TODO: implémenter la vraie commande
        },
      })
      return
    }
    toast.success(`Commande pour format ${format} (à implémenter)`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ghibli-moss/10 rounded-full mb-4"
        >
          <Eye className="w-4 h-4 text-ghibli-moss" />
          <span className="text-sm font-semibold text-ghibli-moss">Étape 4 sur 4</span>
        </motion.div>
        <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
          Votre <span className="text-gradient">chef-d'œuvre</span>
        </h2>
        <p className="text-lg text-ghibli-deep/70 max-w-2xl mx-auto">
          Admirez votre affiche en 3D. Faites-la tourner, changez le format, puis passez commande.
        </p>
      </div>

      <div className={`grid gap-8 ${
        isFullscreen 
          ? 'grid-cols-1' 
          : 'grid-cols-1 lg:grid-cols-[1fr_400px]'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`relative ${isFullscreen ? 'h-[80vh]' : 'h-[600px]'} rounded-3xl overflow-hidden shadow-2xl`}
          style={{
            background: 'linear-gradient(135deg, #FFE4B5 0%, #FFF8DC 50%, #F4E4BC 100%)',
          }}
        >
          <div className="absolute inset-0">
            <WebGLErrorBoundary>
              <PosterScene
                imageUrl={ghibliImageUrl}
                title={title}
                producers={producers}
                description={description}
                format={format}
                autoRotate={autoRotate}
                interactive={true}
              />
            </WebGLErrorBoundary>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-ghibli-sunset" />
            <span className="text-xs font-semibold text-ghibli-deep">Aperçu 3D interactif</span>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
              title={autoRotate ? 'Mettre en pause' : 'Démarrer la rotation'}
            >
              {autoRotate ? (
                <Pause className="w-4 h-4 text-ghibli-deep" />
              ) : (
                <Play className="w-4 h-4 text-ghibli-deep" />
              )}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
              title={isFullscreen ? 'Réduire' : 'Plein écran'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-ghibli-deep" />
              ) : (
                <Maximize2 className="w-4 h-4 text-ghibli-deep" />
              )}
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg">
            <RotateCw className="w-3 h-3 text-ghibli-deep/60" />
            <span className="text-xs text-ghibli-deep/70 font-medium">
              Glissez pour faire pivoter • Molette pour zoomer
            </span>
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-ghibli-deep/80 backdrop-blur-md rounded-full shadow-lg">
            <span className="text-xs font-semibold text-white font-display">
              Format {format}
            </span>
          </div>
        </motion.div>

        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="card-ghibli">
              <h3 className="font-display text-2xl text-ghibli-deep mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-ghibli-forest" />
                Choisir le format
              </h3>

              <div className="space-y-3">
                {formats.map((f) => {
                  const price = pricing.find((p) => p.format === f.value)?.price
                  const isSelected = format === f.value

                  return (
                    <motion.button
                      key={f.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormat(f.value)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-ghibli-forest bg-ghibli-forest/10 shadow-lg'
                          : 'border-ghibli-deep/10 bg-white/60 hover:border-ghibli-forest/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 ${
                            isSelected
                              ? 'border-ghibli-forest bg-ghibli-forest'
                              : 'border-ghibli-deep/30'
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full rounded-full flex items-center justify-center"
                            >
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </motion.div>
                          )}
                        </div>
                        <div>
                          <div className="font-display text-2xl text-ghibli-deep">
                            {f.label}
                          </div>
                          <div className="text-xs text-ghibli-deep/60">
                            {f.dimensions}
                          </div>
                        </div>
                      </div>
                      {price && (
                        <div className="text-right">
                          <div className="font-bold text-xl text-ghibli-forest">
                            {price.toFixed(2)} €
                          </div>
                          <div className="text-xs text-ghibli-deep/60">{f.description}</div>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="card-ghibli bg-gradient-to-br from-ghibli-forest/5 to-ghibli-moss/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-ghibli-deep/70">Total</span>
                <div className="text-right">
                  <div className="font-display text-4xl text-ghibli-deep">
                    {currentPrice.toFixed(2)} €
                  </div>
                  <div className="text-xs text-ghibli-deep/60">Livraison incluse</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-ghibli-deep/70 mb-4 pb-4 border-b border-ghibli-deep/10">
                <div className="flex justify-between">
                  <span>Affiche {format}</span>
                  <span>{currentPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison France</span>
                  <span className="text-ghibli-forest font-semibold">Offerte</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Commander maintenant
                </button>

                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder en brouillon
                </button>
              </div>

              {!user && (
                <div className="mt-4 p-3 bg-ghibli-sunset/10 border border-ghibli-sunset/30 rounded-xl text-xs text-ghibli-deep/80">
                  Créez un compte pour sauvegarder et passer commande
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="group flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-ghibli-deep/20 rounded-full font-semibold text-ghibli-deep hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Modifier
        </motion.button>
      </div>
    </motion.div>
  )
}

export default StepPreview