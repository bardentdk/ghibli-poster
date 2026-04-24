import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, ShoppingBag, LogOut, Palette, Home, Package } from 'lucide-react'
// import Logo from '../ui/Logo'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'


const Navbar = () => {
  const Logo = '/assets/logo.png'
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, profile, signOut } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [location])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('À bientôt !')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/create?new=true', label: 'Créer', icon: Palette },
    ...(user ? [{ to: '/drafts', label: 'Mes brouillons', icon: Package }] : []),
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* <Logo /> */}
            <img src={Logo} alt="" width={150} />
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'text-white'
                        : 'text-ghibli-deep hover:text-ghibli-forest'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-ghibli-forest to-ghibli-moss rounded-full shadow-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ghibli-forest to-ghibli-moss flex items-center justify-center text-white font-semibold">
                      {profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                    <span className="text-ghibli-deep font-semibold">
                      {profile?.full_name?.split(' ')[0] || 'Mon compte'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden"
                      >
                        <Link
                          to="/account"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-ghibli-cream/50 transition-colors"
                        >
                          <User className="w-4 h-4 text-ghibli-forest" />
                          <span className="text-ghibli-deep font-medium">Mon profil</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-ghibli-cream/50 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-ghibli-forest" />
                          <span className="text-ghibli-deep font-medium">Mes commandes</span>
                        </Link>
                        <Link
                          to="/drafts"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-ghibli-cream/50 transition-colors"
                        >
                          <Palette className="w-4 h-4 text-ghibli-forest" />
                          <span className="text-ghibli-deep font-medium">Mes brouillons</span>
                        </Link>
                        <div className="border-t border-ghibli-sand/50" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Se déconnecter</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-ghibli-deep font-semibold hover:text-ghibli-forest transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-ghibli-deep" />
              ) : (
                <Menu className="w-6 h-6 text-ghibli-deep" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-ghibli-deep/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl p-6 pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-ghibli-cream/50 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-ghibli-forest" />
                      <span className="text-ghibli-deep font-semibold">{link.label}</span>
                    </Link>
                  )
                })}

                <div className="border-t border-ghibli-sand/50 my-4" />

                {user ? (
                  <>
                    <Link to="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-ghibli-cream/50">
                      <User className="w-5 h-5 text-ghibli-forest" />
                      <span className="text-ghibli-deep font-semibold">Mon profil</span>
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-ghibli-cream/50">
                      <ShoppingBag className="w-5 h-5 text-ghibli-forest" />
                      <span className="text-ghibli-deep font-semibold">Mes commandes</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Se déconnecter</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 pt-2">
                    <Link to="/login" className="block w-full btn-secondary text-center">
                      Connexion
                    </Link>
                    <Link to="/signup" className="block w-full btn-primary text-center">
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar