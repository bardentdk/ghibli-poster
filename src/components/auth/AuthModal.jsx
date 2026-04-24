import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { create } from 'zustand'

export const useAuthModal = create((set) => ({
  isOpen: false,
  mode: 'login',
  onSuccess: null,
  title: null,
  subtitle: null,
  open: (options = {}) => set({
    isOpen: true,
    mode: options.mode || 'login',
    onSuccess: options.onSuccess || null,
    title: options.title || null,
    subtitle: options.subtitle || null,
  }),
  close: () => set({ isOpen: false, onSuccess: null, title: null, subtitle: null }),
  switchMode: (mode) => set({ mode }),
}))

const AuthModal = () => {
  const { isOpen, mode, onSuccess, title, subtitle, close, switchMode } = useAuthModal()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSuccess = () => {
    if (onSuccess) onSuccess()
    close()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-ghibli-deep/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <div className="relative w-full md:w-5/12 bg-gradient-to-br from-ghibli-forest via-ghibli-moss to-ghibli-deep p-8 md:p-10 overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[600px]">
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
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
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-ghibli-cream" />
                  </motion.div>
                ))}
              </div>

              <div className="absolute top-10 right-10 w-32 h-32 bg-ghibli-sunset/30 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-ghibli-sky/30 rounded-full blur-3xl animate-pulse-slow" />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-ghibli-cream" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  {mode === 'login' ? 'Bon retour' : 'Bienvenue'}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative z-10 hidden md:block"
              >
                <h2 className="font-display text-5xl lg:text-6xl text-white leading-tight mb-4 text-shadow-lg">
                  {title || (mode === 'login' ? (
                    <>
                      Ravis de vous<br />
                      <span className="italic">revoir</span>
                    </>
                  ) : (
                    <>
                      Commencez<br />
                      votre <span className="italic">aventure</span>
                    </>
                  ))}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {subtitle || (mode === 'login' 
                    ? 'Connectez-vous pour retrouver vos créations et continuer votre voyage créatif.'
                    : 'Rejoignez notre communauté et donnez vie à vos souvenirs les plus précieux.')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 hidden md:flex items-center gap-4 pt-6 border-t border-white/10"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-ghibli-sunset to-ghibli-sky border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">10,000+ créateurs</div>
                  <div className="text-white/60 text-xs">nous ont rejoints</div>
                </div>
              </motion.div>

              <div className="relative z-10 md:hidden text-center">
                <h2 className="font-display text-3xl text-white mb-2">
                  {mode === 'login' ? 'Connexion' : 'Inscription'}
                </h2>
              </div>
            </div>

            <div className="relative w-full md:w-7/12 flex flex-col overflow-y-auto">
              <button
                onClick={close}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:rotate-90"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-ghibli-deep" />
              </button>

              <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
                <div className="flex gap-2 p-1 bg-ghibli-cream rounded-2xl mb-8 max-w-xs mx-auto">
                  <button
                    onClick={() => switchMode('login')}
                    className={`relative flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      mode === 'login' ? 'text-white' : 'text-ghibli-deep/60 hover:text-ghibli-deep'
                    }`}
                  >
                    {mode === 'login' && (
                      <motion.div
                        layoutId="modalTab"
                        className="absolute inset-0 bg-gradient-to-r from-ghibli-forest to-ghibli-moss rounded-xl shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <LogIn className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Connexion</span>
                  </button>
                  <button
                    onClick={() => switchMode('signup')}
                    className={`relative flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      mode === 'signup' ? 'text-white' : 'text-ghibli-deep/60 hover:text-ghibli-deep'
                    }`}
                  >
                    {mode === 'signup' && (
                      <motion.div
                        layoutId="modalTab"
                        className="absolute inset-0 bg-gradient-to-r from-ghibli-sunset to-ghibli-earth rounded-xl shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <UserPlus className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Inscription</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mode === 'login' ? (
                      <LoginForm
                        onSuccess={handleSuccess}
                        showTitle={false}
                        compact
                      />
                    ) : (
                      <SignupForm
                        onSuccess={handleSuccess}
                        showTitle={false}
                        compact
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal