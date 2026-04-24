import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Play } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import MagicParticles from '../effects/MagicParticles'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      <MagicParticles count={40} color="rgba(255, 215, 0, 0.6)" />

      <div className="absolute inset-0 bg-gradient-to-br from-ghibli-cream via-ghibli-sand/50 to-ghibli-sky/20 -z-10" />

      <div className="absolute top-20 right-0 w-96 h-96 bg-ghibli-sunset/20 rounded-full blur-3xl animate-pulse-slow -z-10" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ghibli-forest/20 rounded-full blur-3xl animate-pulse-slow -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-ghibli-forest/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-ghibli-sunset" />
              <span className="text-sm font-semibold text-ghibli-deep">
                Propulsé par l'Intelligence Artificielle
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-6xl md:text-7xl lg:text-8xl leading-none text-ghibli-deep"
            >
              Vos souvenirs,
              <br />
              <span className="text-gradient">magnifiés</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-ghibli-deep/80 leading-relaxed max-w-lg"
            >
              Transformez vos photos en œuvres d'art inspirées de l'univers poétique du Studio Ghibli.
              Une affiche unique, imprimée avec soin, qui racontera votre histoire.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/create" className="btn-primary group flex items-center gap-2">
                Créer mon affiche
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-secondary flex items-center gap-2 group">
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Voir la démo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex items-center gap-8 pt-4"
            >
              <div>
                <div className="font-display text-4xl text-ghibli-deep">10K+</div>
                <div className="text-sm text-ghibli-deep/70">Affiches créées</div>
              </div>
              <div className="w-px h-12 bg-ghibli-deep/20" />
              <div>
                <div className="font-display text-4xl text-ghibli-deep">4.9</div>
                <div className="text-sm text-ghibli-deep/70">Note moyenne</div>
              </div>
              <div className="w-px h-12 bg-ghibli-deep/20" />
              <div>
                <div className="font-display text-4xl text-ghibli-deep">48h</div>
                <div className="text-sm text-ghibli-deep/70">Livraison</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-ghibli-sunset via-ghibli-sky to-ghibli-forest rounded-3xl blur-2xl opacity-30" />

              <ImagePlaceholder
                label="Hero Image Principale"
                aspectRatio="3/4"
                className="relative shadow-2xl"
                rounded="rounded-3xl"
                src="/assets/img/7.jpg"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 -left-8 w-40 h-40 hidden md:block"
            >
              <ImagePlaceholder
                label="Detail 1"
                aspectRatio="1/1"
                className="shadow-2xl border-4 border-none"
                rounded="rounded-2xl"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQURXSVJcJLHRlQApPQ2jJBniDiuSsdos84MA&s"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-8 -right-8 w-32 h-32 hidden md:block"
            >
              <ImagePlaceholder
                src="https://upload.wikimedia.org/wikipedia/en/2/29/OpenAI_Sora_icon.png"
                label="Detail 2"
                aspectRatio="1/1"
                className="shadow-2xl border-4 border-none"
                rounded="rounded-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-ghibli-deep/40 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-ghibli-deep/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection