import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const testimonials = [
  {
    name: 'Marie L.',
    role: 'Maman comblée',
    content: 'J\'ai offert une affiche Ghibli de mes enfants à mon mari pour notre anniversaire de mariage. Il a pleuré de bonheur. La qualité d\'impression est absolument exceptionnelle.',
    rating: 5,
  },
  {
    name: 'Thomas P.',
    role: 'Collectionneur',
    content: 'Le résultat dépasse toutes mes attentes. Le style Ghibli est parfaitement respecté et les détails sont incroyables. Je vais en commander d\'autres pour toute la maison.',
    rating: 5,
  },
  {
    name: 'Sophie D.',
    role: 'Designer',
    content: 'En tant que designer, je suis très exigeante sur la qualité visuelle. L\'IA est bluffante et le papier utilisé est premium. Livraison rapide et emballage soigné.',
    rating: 5,
  },
]

const TestimonialsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghibli-sky/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-ghibli-earth/10 rounded-full text-ghibli-earth font-semibold text-sm tracking-wider uppercase mb-4">
            Témoignages
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-6">
            Ils ont été
            <br />
            <span className="text-gradient">émerveillés</span>
          </h2>
          <p className="text-lg text-ghibli-deep/70">
            Rejoignez les milliers de clients qui ont transformé leurs souvenirs
            en véritables œuvres d'art.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="card-ghibli group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-ghibli-forest/10 group-hover:text-ghibli-forest/20 transition-colors" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-ghibli-sunset text-ghibli-sunset"
                  />
                ))}
              </div>

              <p className="text-ghibli-deep/80 leading-relaxed mb-6 italic">
                « {testimonial.content} »
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-ghibli-deep/10">
                <ImagePlaceholder
                  label={testimonial.name}
                  aspectRatio="1/1"
                  className="w-12 h-12 flex-shrink-0"
                  rounded="rounded-full"
                />
                <div>
                  <div className="font-semibold text-ghibli-deep">{testimonial.name}</div>
                  <div className="text-sm text-ghibli-deep/60">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection