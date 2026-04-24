import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AuthSideImage from '../components/auth/AuthSideImage'
import LoginForm from '../components/auth/LoginForm'
import Logo from '../components/ui/Logo'

const LoginPage = () => {
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

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white relative overflow-y-auto"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ghibli-sky/10 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 p-6 md:p-8 flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-2 text-ghibli-deep/70 hover:text-ghibli-forest transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
          <LoginForm />
        </div>

        <div className="relative z-10 p-6 md:p-8 text-center">
          <p className="text-xs text-ghibli-deep/50">
            © {new Date().getFullYear()} Ghibli Poster Studio. Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage