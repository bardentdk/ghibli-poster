import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import FormInput from '../ui/FormInput'
import { loginSchema } from '../../utils/validationSchemas'
import { useAuthStore } from '../../store/authStore'

const LoginForm = ({ onSuccess, showTitle = true, compact = false }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const { signIn } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await signIn(data)
      toast.success('Bienvenue !')
      if (onSuccess) {
        onSuccess()
      } else {
        navigate(redirectTo)
      }
    } catch (error) {
      const message = error.message?.includes('Invalid login')
        ? 'Email ou mot de passe incorrect'
        : error.message || 'Erreur de connexion'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { supabase } = await import('../../lib/supabase')
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      toast.error('Erreur de connexion Google')
      setLoading(false)
    }
  }

  return (
    <div className={`w-full ${compact ? '' : 'max-w-md mx-auto'}`}>
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ghibli-forest/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-ghibli-forest" />
            <span className="text-xs font-semibold text-ghibli-forest uppercase tracking-wider">
              Connexion
            </span>
          </div>
          <h1 className="font-display text-5xl text-ghibli-deep mb-3">
            Ravis de vous revoir
          </h1>
          <p className="text-ghibli-deep/70">
            Connectez-vous pour continuer vos créations
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FormInput
            label="Adresse email"
            icon={Mail}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormInput
            label="Mot de passe"
            icon={Lock}
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-ghibli-deep/20 text-ghibli-forest focus:ring-ghibli-forest"
            />
            <span className="text-sm text-ghibli-deep/70 group-hover:text-ghibli-deep transition-colors">
              Se souvenir de moi
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-ghibli-forest hover:text-ghibli-moss font-semibold transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="group relative w-full py-4 bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden disabled:opacity-70"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ghibli-moss to-ghibli-forest opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative py-2"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ghibli-deep/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-xs font-semibold text-ghibli-deep/50 uppercase tracking-wider">
              ou
            </span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 bg-white border-2 border-ghibli-deep/10 text-ghibli-deep rounded-2xl font-semibold hover:border-ghibli-forest/30 hover:shadow-md transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center pt-4"
        >
          <span className="text-ghibli-deep/70 text-sm">
            Pas encore de compte ?{' '}
          </span>
          <Link
            to={`/signup${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
            className="text-ghibli-forest hover:text-ghibli-moss font-semibold text-sm transition-colors"
          >
            Créer un compte
          </Link>
        </motion.div>
      </form>
    </div>
  )
}

export default LoginForm