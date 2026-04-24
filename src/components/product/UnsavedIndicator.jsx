import { motion, AnimatePresence } from 'framer-motion'
import { Save, Cloud, CloudOff, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

import { usePosterStore } from '../../store/posterStore'
import { useAuthStore } from '../../store/authStore'
import { usePosterSave } from '../../hooks/usePosterSave'
import { storageService } from '../../services/storageService'

const UnsavedIndicator = () => {
  const [status, setStatus] = useState('idle') // idle, saving, saved, unsaved
  const { user } = useAuthStore()
  const { saving, saveDraft } = usePosterSave()
  const {
    posterId,
    ghibliImageUrl,
    title,
    producers,
    description,
    format,
  } = usePosterStore()

  useEffect(() => {
    if (saving) {
      setStatus('saving')
    } else if (!ghibliImageUrl) {
      setStatus('idle')
    } else if (!user) {
      setStatus('unsaved')
    } else if (posterId && storageService.isSupabaseUrl(ghibliImageUrl)) {
      setStatus('saved')
    } else {
      setStatus('unsaved')
    }
  }, [saving, posterId, ghibliImageUrl, user])

  useEffect(() => {
    if (status === 'saved' && (title || producers || description)) {
      setStatus('unsaved')
    }
  }, [title, producers, description, format])

  if (status === 'idle') return null

  const handleManualSave = async () => {
    if (!user) return
    try {
      await saveDraft()
    } catch (error) {
      // Déjà géré
    }
  }

  const config = {
    saving: {
      icon: Cloud,
      label: 'Sauvegarde...',
      color: 'bg-ghibli-sky/10 text-ghibli-sky border-ghibli-sky/30',
      iconClass: 'animate-pulse',
    },
    saved: {
      icon: Check,
      label: 'Sauvegardé',
      color: 'bg-ghibli-forest/10 text-ghibli-forest border-ghibli-forest/30',
      iconClass: '',
    },
    unsaved: {
      icon: CloudOff,
      label: user ? 'Non sauvegardé' : 'Connexion requise',
      color: 'bg-ghibli-sunset/10 text-ghibli-sunset border-ghibli-sunset/30',
      iconClass: '',
    },
  }

  const current = config[status]
  const Icon = current.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-24 right-6 z-40"
      >
        <button
          onClick={handleManualSave}
          disabled={status === 'saving' || !user}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md shadow-lg text-xs font-semibold transition-all ${current.color} ${user ? 'hover:scale-105' : 'cursor-default'}`}
        >
          <Icon className={`w-3.5 h-3.5 ${current.iconClass}`} />
          <span>{current.label}</span>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default UnsavedIndicator