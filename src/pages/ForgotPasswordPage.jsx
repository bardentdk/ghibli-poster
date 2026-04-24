import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, Check, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import FormInput from '../components/ui/FormInput'
import Logo from '../components/ui/Logo'
import AuthSideImage from '../components/auth/AuthSideImage'
import { resetPasswordSchema } from '../utils/validationSchemas'
import { authService } from '../services/authService'

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.resetPassword(data.email)
      setEmail(data.email)
      setSent(true)
      toast.success('Email envoyé !')
    } catch (error) {
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 relative"
      >
        <AuthSideImage variant="login" />
      </motion.div>

      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ghibli-sky/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-6 md:p-8 flex items-center justify-between">
          <Logo />
          <Link
            to="/login"
            className="flex items-center gap-2 text-ghibli-deep/70 hover:text-ghibli-forest transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Connexion</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-ghibli-forest to-ghibli-moss flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </motion.div>

                <h2 className="font-display text-4xl text-ghibli-deep mb-3">
                  Email envoyé !
                </h2>
                <p className="text-ghibli-deep/70 mb-6">
                  Nous avons envoyé un lien de réinitialisation à
                </p>
                <p className="font-semibold text-ghibli-deep mb-8">{email}</p>

                <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-10"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ghibli-forest to-ghibli-moss flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="font-display text-4xl text-ghibli-deep mb-3">
                    Mot de passe oublié ?
                  </h1>
                  <p className="text-ghibli-deep/70">
                    Pas de panique, on vous envoie un lien pour le réinitialiser.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <FormInput
                    label="Adresse email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full py-4 bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Envoyer le lien</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-ghibli-forest hover:text-ghibli-moss font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Retour à la connexion
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage