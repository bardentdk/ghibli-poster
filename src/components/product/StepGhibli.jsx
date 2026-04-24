import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Sparkles, ArrowRight, ArrowLeft, RefreshCw, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePosterStore } from '../../store/posterStore'
import { aiService } from '../../services/aiService'

const StepGhibli = () => {
  const {
    originalImageUrl,
    ghibliImageUrl,
    isGenerating,
    generationProgress,
    originalImage,
    setGhibliImage,
    setGenerating,
    nextStep,
    prevStep,
  } = usePosterStore()

  const [hasStarted, setHasStarted] = useState(!!ghibliImageUrl)

  const handleGenerate = async () => {
    if (!originalImage && !originalImageUrl) {
      toast.error('Aucune image à transformer')
      return
    }

    setHasStarted(true)
    setGenerating(true, 0)

    try {
      const imageSource = originalImage || await fetchImageAsBlob(originalImageUrl)
      
      const generatedBlob = await aiService.transformToGhibli(
        imageSource,
        (progress) => {
          setGenerating(true, progress)
        }
      )

      const generatedUrl = URL.createObjectURL(generatedBlob)
      setGhibliImage(generatedUrl, null)
      setGenerating(false, 100)
      
      toast.success('Votre affiche Ghibli est prête !')
    } catch (error) {
      console.error('Erreur transformation:', error)
      toast.error('La transformation a échoué. Réessayez.')
      setGenerating(false, 0)
      setHasStarted(false)
    }
  }

  const fetchImageAsBlob = async (url) => {
    const response = await fetch(url)
    return await response.blob()
  }

  const handleRegenerate = () => {
    setGhibliImage(null, null)
    setHasStarted(false)
    handleGenerate()
  }

  useEffect(() => {
    if (!hasStarted && !ghibliImageUrl && originalImageUrl) {
      handleGenerate()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ghibli-sunset/10 rounded-full mb-4"
        >
          <Wand2 className="w-4 h-4 text-ghibli-sunset" />
          <span className="text-sm font-semibold text-ghibli-sunset">Étape 2 sur 4</span>
        </motion.div>
        <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
          La <span className="text-gradient">magie opère</span>
        </h2>
        <p className="text-lg text-ghibli-deep/70 max-w-2xl mx-auto">
          Notre IA transforme votre photo en illustration poétique dans le style du Studio Ghibli.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="card-ghibli p-4"
        >
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-2 h-2 rounded-full bg-ghibli-deep/40" />
            <span className="text-sm font-semibold text-ghibli-deep/60 uppercase tracking-wider">
              Avant
            </span>
          </div>
          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-ghibli-cream">
            {originalImageUrl && (
              <img
                src={originalImageUrl}
                alt="Original"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="card-ghibli p-4 relative"
        >
          <div className="flex items-center gap-2 mb-3 px-2">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-ghibli-sunset"
            />
            <span className="text-sm font-semibold text-ghibli-sunset uppercase tracking-wider">
              Après (Ghibli)
            </span>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-gradient-to-br from-ghibli-cream via-ghibli-sand to-ghibli-sky/20">
            <AnimatePresence mode="wait">
              {ghibliImageUrl && !isGenerating ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full"
                >
                  <img
                    src={ghibliImageUrl}
                    alt="Style Ghibli"
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ghibli-forest flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6"
                >
                  {isGenerating ? (
                    <>
                      <div className="relative w-24 h-24 mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-4 border-ghibli-sunset/20 border-t-ghibli-sunset"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-2 rounded-full border-4 border-ghibli-forest/20 border-b-ghibli-forest"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-ghibli-sunset" />
                        </div>
                      </div>

                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-ghibli-deep">
                            Transformation en cours
                          </span>
                          <span className="text-sm font-bold text-ghibli-sunset">
                            {generationProgress}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-ghibli-forest via-ghibli-sunset to-ghibli-sky rounded-full"
                            animate={{ width: `${generationProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <div className="mt-6 space-y-2 text-center">
                        <motion.p
                          key={Math.floor(generationProgress / 25)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-ghibli-deep/80"
                        >
                          {generationProgress < 25 && 'Analyse de votre photo...'}
                          {generationProgress >= 25 && generationProgress < 50 && 'Application du style Ghibli...'}
                          {generationProgress >= 50 && generationProgress < 75 && 'Création des détails magiques...'}
                          {generationProgress >= 75 && generationProgress < 100 && 'Touches finales...'}
                          {generationProgress >= 100 && 'Presque prêt !'}
                        </motion.p>
                      </div>

                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -30, 0],
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                          >
                            <Sparkles className="w-3 h-3 text-ghibli-sunset" />
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-ghibli-deep/5 flex items-center justify-center mx-auto mb-4">
                        <Wand2 className="w-8 h-8 text-ghibli-deep/30" />
                      </div>
                      <p className="text-ghibli-deep/50">
                        En attente de génération
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {ghibliImageUrl && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={handleRegenerate}
            className="group flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-ghibli-deep/20 rounded-full font-semibold text-ghibli-deep hover:bg-white hover:border-ghibli-forest transition-all"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Régénérer
          </button>
        </motion.div>
      )}

      <div className="flex justify-between items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="group flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-ghibli-deep/20 rounded-full font-semibold text-ghibli-deep hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour
        </motion.button>

        <motion.button
          whileHover={{ scale: ghibliImageUrl ? 1.05 : 1 }}
          whileTap={{ scale: ghibliImageUrl ? 0.95 : 1 }}
          onClick={nextStep}
          disabled={!ghibliImageUrl || isGenerating}
          className={`group flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 ${
            ghibliImageUrl && !isGenerating
              ? 'bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white hover:shadow-xl'
              : 'bg-ghibli-deep/10 text-ghibli-deep/40 cursor-not-allowed'
          }`}
        >
          Personnaliser
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default StepGhibli