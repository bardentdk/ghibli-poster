import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const ShowcaseSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const showcaseItems = [
    { label: 'Affiche Exemple 1', size: 'large' },
    { label: 'Affiche Exemple 2', size: 'medium' },
    { label: 'Affiche Exemple 3', size: 'medium' },
    { label: 'Affiche Exemple 4', size: 'small' },
    { label: 'Affiche Exemple 5', size: 'medium' },
    { label: 'Affiche Exemple 6', size: 'large' },
  ]

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <span className="inline-block px-4 py-2 bg-ghibli-sky/10 rounded-full text-ghibli-sky font-semibold text-sm tracking-wider uppercase mb-4">
              Galerie
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep">
              Inspirez-vous de
              <br />
              <span className="text-gradient">nos créations</span>
            </h2>
          </div>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 text-ghibli-forest font-semibold hover:gap-3 transition-all"
          >
            Voir toute la galerie
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative ${
                item.size === 'large'
                  ? 'col-span-2 row-span-2'
                  : item.size === 'medium'
                  ? 'col-span-1 row-span-1'
                  : 'col-span-1 row-span-1'
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                <ImagePlaceholder
                  label={item.label}
                  aspectRatio={item.size === 'large' ? '1/1' : '3/4'}
                  rounded="rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ghibli-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="text-white">
                    <div className="font-display text-xl mb-1">Création unique</div>
                    <div className="text-sm text-white/80">Par la communauté</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShowcaseSection