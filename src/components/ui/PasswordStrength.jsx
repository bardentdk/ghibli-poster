import { motion } from 'framer-motion'
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react'

const calculateStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { score: 0, label: '', color: '', icon: Shield },
    { score: 1, label: 'Très faible', color: 'bg-red-500', textColor: 'text-red-500', icon: ShieldAlert },
    { score: 2, label: 'Faible', color: 'bg-orange-500', textColor: 'text-orange-500', icon: ShieldAlert },
    { score: 3, label: 'Moyen', color: 'bg-yellow-500', textColor: 'text-yellow-600', icon: Shield },
    { score: 4, label: 'Fort', color: 'bg-lime-500', textColor: 'text-lime-600', icon: ShieldCheck },
    { score: 5, label: 'Excellent', color: 'bg-ghibli-forest', textColor: 'text-ghibli-forest', icon: ShieldCheck },
  ]

  return levels[score]
}

const PasswordStrength = ({ password }) => {
  const strength = calculateStrength(password)
  const Icon = strength.icon

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2 px-2"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            className="flex-1 h-1 rounded-full bg-ghibli-deep/10 overflow-hidden"
          >
            <motion.div
              className={`h-full ${level <= strength.score ? strength.color : 'bg-transparent'}`}
              initial={{ width: 0 }}
              animate={{ width: level <= strength.score ? '100%' : 0 }}
              transition={{ duration: 0.3, delay: level * 0.05 }}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${strength.textColor}`} />
        <span className={`text-xs font-semibold ${strength.textColor}`}>
          {strength.label}
        </span>
      </div>
    </motion.div>
  )
}

export default PasswordStrength