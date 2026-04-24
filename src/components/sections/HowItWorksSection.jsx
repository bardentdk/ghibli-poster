import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Upload, Wand2, Eye, Package } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Partagez votre photo',
    description: 'Téléchargez la photo qui vous tient à cœur. Famille, voyage, animal de compagnie, tout est possible.',
    color: 'from-ghibli-sky to-blue-400',
  },
  {
    icon: Wand2,
    number: '02',
    title: 'Magie Ghibli',
    description: 'Notre IA transforme votre photo en illustration poétique dans le style du Studio Ghibli.',
    color: 'from-ghibli-sunset to-orange-400',
  },
  {
    icon: Eye,
    number: '03',
    title: 'Personnalisez',
    description: 'Ajoutez un titre, des noms, une description. Prévisualisez le résultat en 3D en temps réel.',
    color: 'from-ghibli-forest to-emerald-500',
  },
  {
    icon: Package,
    number: '04',
    title: 'Recevez chez vous',
    description: 'Commandez en A4, A3 ou A2. Impression premium et livraison sous 48h en France.',
    color: 'from-ghibli-earth to-amber-600',
  },
]

const HowItWorksSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-2 bg-ghibli-forest/10 rounded-full text-ghibli-forest font-semibold text-sm tracking-wider uppercase mb-4">
            Comment ça marche
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-6">
            Créez votre chef-d'œuvre
            <br />
            en <span className="text-gradient">quatre étapes</span>
          </h2>
          <p className="text-lg text-ghibli-deep/70">
            De la photo brute à l'affiche imprimée, nous transformons vos souvenirs
            en œuvres d'art uniques avec facilité et élégance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="card-ghibli h-full hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <span className="font-display text-5xl text-ghibli-deep/10 group-hover:text-ghibli-deep/20 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl text-ghibli-deep mb-3">
                    {step.title}
                  </h3>
                  <p className="text-ghibli-deep/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-ghibli-forest/30 to-transparent" />
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <ImagePlaceholder
            label="Étape Illustration 1"
            aspectRatio="4/3"
            className="shadow-xl"
          />
          <ImagePlaceholder
            label="Étape Illustration 2"
            aspectRatio="4/3"
            className="shadow-xl md:mt-8"
          />
          <ImagePlaceholder
            label="Étape Illustration 3"
            aspectRatio="4/3"
            className="shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorksSection