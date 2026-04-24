import { motion } from 'framer-motion'
import { Upload, Wand2, Type, Eye, Check } from 'lucide-react'
import { usePosterStore } from '../../store/posterStore'

const steps = [
  { number: 1, label: 'Photo', icon: Upload },
  { number: 2, label: 'Magie IA', icon: Wand2 },
  { number: 3, label: 'Détails', icon: Type },
  { number: 4, label: 'Aperçu', icon: Eye },
]

const ProductStepper = () => {
  const currentStep = usePosterStore((state) => state.currentStep)

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-6 left-0 right-0 h-1 bg-ghibli-deep/10 rounded-full -z-10" />
        <motion.div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-ghibli-forest via-ghibli-sunset to-ghibli-sky rounded-full -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {steps.map((step) => {
          const Icon = step.icon
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number

          return (
            <div key={step.number} className="flex flex-col items-center gap-3">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? '#4A7C59'
                    : isActive
                    ? '#FF8C69'
                    : '#FFF8DC',
                }}
                transition={{ duration: 0.3 }}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  isActive || isCompleted
                    ? 'border-transparent'
                    : 'border-ghibli-deep/20'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-ghibli-deep/40'
                    }`}
                    strokeWidth={2}
                  />
                )}

                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-ghibli-sunset"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <span
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-ghibli-deep'
                    : isCompleted
                    ? 'text-ghibli-forest'
                    : 'text-ghibli-deep/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductStepper