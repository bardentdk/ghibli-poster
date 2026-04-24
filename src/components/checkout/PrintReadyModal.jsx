import { motion, AnimatePresence } from 'framer-motion'
import { FileImage, Upload, Check, Sparkles, Printer } from 'lucide-react'

const PrintReadyModal = ({ isOpen, progress, error }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ghibli-deep/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-ghibli-forest via-ghibli-moss to-ghibli-deep p-8 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-ghibli-cream" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{ 
                  rotate: progress.progress === 100 ? 0 : 360 
                }}
                transition={{
                  duration: 2,
                  repeat: progress.progress === 100 ? 0 : Infinity,
                  ease: 'linear',
                }}
                className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mx-auto mb-4 flex items-center justify-center"
              >
                {progress.progress === 100 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <Printer className="w-10 h-10 text-white" />
                )}
              </motion.div>

              <h3 className="font-display text-3xl text-white mb-2">
                {progress.progress === 100 ? 'Fichier prêt !' : 'Préparation de l\'impression'}
              </h3>
              <p className="text-white/80 text-sm">
                {progress.progress === 100 
                  ? 'Votre affiche va être envoyée à notre imprimeur'
                  : 'Génération du fichier haute résolution en cours...'}
              </p>
            </div>

            <div className="p-6">
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <strong>Erreur :</strong> {error}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-ghibli-deep">
                        {progress.step || 'Initialisation...'}
                      </span>
                      <span className="text-sm font-bold text-ghibli-forest">
                        {progress.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-ghibli-cream rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-ghibli-forest via-ghibli-sunset to-ghibli-sky rounded-full"
                        animate={{ width: `${progress.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-ghibli-deep/60">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-3.5 h-3.5 text-ghibli-forest" />
                      <span>Résolution 300 DPI (qualité professionnelle)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-ghibli-forest" />
                      <span>Filigrane retiré pour l'impression</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-ghibli-forest" />
                      <span>Upload sécurisé vers nos serveurs</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PrintReadyModal