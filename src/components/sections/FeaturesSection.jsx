import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Palette, Shield, Truck, Clock, Award, Heart } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const features = [
  {
    icon: Palette,
    title: 'Style authentique',
    description: 'IA entraînée spécifiquement pour reproduire la magie du Studio Ghibli avec fidélité.',
  },
  {
    icon: Award,
    title: 'Qualité premium',
    description: 'Papier beaux-arts 250g avec encres pigmentaires archivistiques pour une durabilité de 100 ans.',
  },
  {
    icon: Shield,
    title: 'Satisfaction garantie',
    description: 'Non satisfait ? Nous refaisons ou remboursons, sans poser de question.',
  },
  {
    icon: Truck,
    title: 'Livraison express',
    description: 'Expédition sous 48h en France métropolitaine, emballage sécurisé et écologique.',
  },
  {
    icon: Clock,
    title: 'Création rapide',
    description: 'De la photo à l\'affiche finale en moins de 5 minutes grâce à notre interface fluide.',
  },
  {
    icon: Heart,
    title: 'Fait avec passion',
    description: 'Chaque affiche est vérifiée manuellement avant impression par notre équipe.',
  },
]

const FeaturesSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghibli-forest/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <ImagePlaceholder
                  label="Feature 1"
                  aspectRatio="3/4"
                  className="shadow-2xl"
                />
                <ImagePlaceholder
                  label="Feature 2"
                  aspectRatio="1/1"
                  className="shadow-2xl"
                />
              </div>
              <div className="space-y-4 pt-12">
                <ImagePlaceholder
                  label="Feature 3"
                  aspectRatio="1/1"
                  className="shadow-2xl"
                />
                <ImagePlaceholder
                  label="Feature 4"
                  aspectRatio="3/4"
                  className="shadow-2xl"
                />
              </div>
            </div>

            <div className="absolute -top-10 -left-10 w-64 h-64 bg-ghibli-sunset/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-ghibli-sky/20 rounded-full blur-3xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-block px-4 py-2 bg-ghibli-sunset/10 rounded-full text-ghibli-sunset font-semibold text-sm tracking-wider uppercase mb-4">
                Pourquoi nous choisir
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-6">
                L'art, la qualité,
                <br />
                <span className="text-gradient">l'émotion</span>
              </h2>
              <p className="text-lg text-ghibli-deep/70 leading-relaxed">
                Nous ne faisons pas que produire des affiches. Nous créons des objets précieux
                qui traverseront le temps et vous accompagneront dans votre quotidien.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-ghibli-forest to-ghibli-moss flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-ghibli-deep mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-ghibli-deep/70 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection