import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const CTASection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-ghibli-forest via-ghibli-moss to-ghibli-deep" />

          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-ghibli-sunset rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-ghibli-sky rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-ghibli-cream" />
              <span className="text-sm font-semibold text-white">
                Offre de lancement : -20% sur votre première affiche
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-5xl md:text-7xl text-white mb-6 leading-tight"
            >
              Prêt à créer votre
              <br />
              chef-d'œuvre ?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            >
              En quelques minutes, transformez votre plus beau souvenir en une œuvre d'art
              intemporelle qui ornera vos murs pendant des générations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link
                to="/create"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-ghibli-deep rounded-full font-semibold shadow-2xl hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Voir la galerie
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection