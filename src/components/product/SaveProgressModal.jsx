import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Wand2, Save, Check, Sparkles } from 'lucide-react'

const steps = [
  { key: 'init', icon: Sparkles, label: 'Préparation' },
  { key: 'uploading_original', icon: Upload, label: 'Upload de la photo originale' },
  { key: 'uploading_ghibli', icon: Wand2, label: 'Upload de l\'image Ghibli' },
  { key: 'saving', icon: Save, label: 'Enregistrement en base' },
  { key: 'completed', icon: Check, label: 'Sauvegardé avec succès !' },
]

const SaveProgressModal = ({ isOpen, progress }) => {
  const currentIndex = steps.findIndex((s) => s.key === progress.step)

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
                animate={{ rotate: progress.step === 'completed' ? 0 : 360 }}
                transition={{
                  duration: 2,
                  repeat: progress.step === 'completed' ? 0 : Infinity,
                  ease: 'linear',
                }}
                className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mx-auto mb-4 flex items-center justify-center"
              >
                {progress.step === 'completed' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <Save className="w-10 h-10 text-white" />
                )}
              </motion.div>

              <h3 className="font-display text-3xl text-white mb-2">
                {progress.step === 'completed' ? 'Sauvegardé !' : 'Sauvegarde en cours'}
              </h3>
              <p className="text-white/80 text-sm">
                {progress.step === 'completed' 
                  ? 'Votre brouillon a été enregistré avec succès'
                  : 'Merci de patienter quelques instants...'}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-ghibli-deep">Progression</span>
                  <span className="text-sm font-bold text-ghibli-forest">{progress.progress}%</span>
                </div>
                <div className="h-2 bg-ghibli-cream rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ghibli-forest via-ghibli-sunset to-ghibli-sky rounded-full"
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentIndex
                  const isDone = index < currentIndex || progress.step === 'completed'
                  
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: isActive || isDone ? 1 : 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-ghibli-forest text-white'
                          : isActive
                          ? 'bg-ghibli-sunset text-white'
                          : 'bg-ghibli-cream text-ghibli-deep/40'
                      }`}>
                        {isDone ? (
                          <Check className="w-4 h-4" strokeWidth={3} />
                        ) : (
                          <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-ghibli-deep'
                          : isDone
                          ? 'text-ghibli-forest'
                          : 'text-ghibli-deep/40'
                      }`}>
                        {step.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SaveProgressModal