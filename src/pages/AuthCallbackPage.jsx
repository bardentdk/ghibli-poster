import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

const AuthCallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (data.session) {
          setTimeout(() => navigate('/'), 1500)
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Erreur callback:', error)
        navigate('/login')
      }
    }

    handleAuth()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghibli-cream via-white to-ghibli-sand">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-ghibli-forest via-ghibli-sunset to-ghibli-sky mx-auto mb-6 flex items-center justify-center shadow-2xl"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl text-ghibli-deep mb-3"
        >
          Connexion en cours
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-ghibli-deep/70"
        >
          Préparation de votre espace personnel...
        </motion.p>
      </div>
    </div>
  )
}

export default AuthCallbackPage