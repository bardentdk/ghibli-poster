import { motion } from 'framer-motion'
import { Sparkles, Quote, Star } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const AuthSideImage = ({ variant = 'login' }) => {
  const content = {
    login: {
      badge: 'Bon retour parmi nous',
      title: 'Vos créations vous attendent',
      subtitle: 'Retrouvez vos brouillons, suivez vos commandes et continuez à créer des affiches uniques.',
      testimonial: {
        quote: 'Une expérience magique de A à Z. Le résultat est à couper le souffle.',
        author: 'Marie L.',
        role: 'Cliente comblée',
      },
    },
    signup: {
      badge: 'Commencez votre aventure',
      title: 'Rejoignez la magie',
      subtitle: 'Créez votre compte et transformez vos souvenirs en œuvres d\'art intemporelles.',
      testimonial: {
        quote: 'J\'ai offert une affiche Ghibli à ma femme. Elle en pleure encore de bonheur.',
        author: 'Thomas P.',
        role: 'Client fidèle',
      },
    },
  }

  const data = content[variant]

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0">
        <ImagePlaceholder
          label="Auth Side Image"
          aspectRatio="auto"
          className="w-full h-full"
          rounded="rounded-none"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-ghibli-deep/60 via-ghibli-forest/40 to-ghibli-deep/80" />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Sparkles className="w-3 h-3 text-ghibli-cream" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-20 right-10 w-40 h-40 bg-ghibli-sunset/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-ghibli-sky/30 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 h-full flex flex-col justify-between p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-fit"
        >
          <Sparkles className="w-4 h-4 text-ghibli-cream" />
          <span className="text-sm font-semibold text-white">{data.badge}</span>
        </motion.div>

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="font-display text-6xl text-white leading-tight mb-6 text-shadow-lg">
              {data.title}
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-md">
              {data.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-2 -left-2">
              <Quote className="w-12 h-12 text-white/20 rotate-180" strokeWidth={1.5} />
            </div>

            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 pl-8">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-ghibli-sunset text-ghibli-sunset"
                  />
                ))}
              </div>

              <p className="text-white/95 italic leading-relaxed mb-4">
                « {data.testimonial.quote} »
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ghibli-sunset to-ghibli-earth flex items-center justify-center font-bold text-white">
                  {data.testimonial.author[0]}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    {data.testimonial.author}
                  </div>
                  <div className="text-white/70 text-xs">
                    {data.testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-6 text-white/80"
        >
          <div>
            <div className="font-display text-3xl text-white">10K+</div>
            <div className="text-xs">Affiches créées</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="font-display text-3xl text-white">4.9</div>
            <div className="text-xs">Note moyenne</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="font-display text-3xl text-white">48h</div>
            <div className="text-xs">Livraison</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthSideImage