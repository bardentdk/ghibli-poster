import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Check, Sparkles } from 'lucide-react'

const plans = [
  {
    format: 'A4',
    dimensions: '21 × 29.7 cm',
    price: '19.90',
    description: 'Parfait pour un bureau ou un petit espace',
    features: [
      'Papier beaux-arts 250g',
      'Encres pigmentaires',
      'Livraison offerte',
      'Garantie 100 ans',
      'Emballage premium',
    ],
    popular: false,
  },
  {
    format: 'A3',
    dimensions: '29.7 × 42 cm',
    price: '29.90',
    description: 'Le format idéal pour un salon',
    features: [
      'Papier beaux-arts 250g',
      'Encres pigmentaires',
      'Livraison offerte',
      'Garantie 100 ans',
      'Emballage premium',
      'Certificat d\'authenticité',
    ],
    popular: true,
  },
  {
    format: 'A2',
    dimensions: '42 × 59.4 cm',
    price: '44.90',
    description: 'Pour un impact visuel maximal',
    features: [
      'Papier beaux-arts 250g',
      'Encres pigmentaires',
      'Livraison offerte',
      'Garantie 100 ans',
      'Emballage premium',
      'Certificat d\'authenticité',
      'Retouche gratuite',
    ],
    popular: false,
  },
]

const PricingSection = () => {
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-ghibli-moss/10 rounded-full text-ghibli-moss font-semibold text-sm tracking-wider uppercase mb-4">
            Tarifs
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-6">
            Choisissez votre
            <br />
            <span className="text-gradient">format parfait</span>
          </h2>
          <p className="text-lg text-ghibli-deep/70">
            Des prix transparents pour une qualité irréprochable. Livraison toujours offerte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-ghibli-sunset to-ghibli-earth rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Le plus populaire</span>
                  </div>
                </div>
              )}

              <div
                className={`card-ghibli h-full flex flex-col ${
                  plan.popular
                    ? 'border-2 border-ghibli-sunset shadow-2xl shadow-ghibli-sunset/20'
                    : 'hover:shadow-2xl'
                } transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="text-center pb-6 border-b border-ghibli-deep/10">
                  <div className="font-display text-6xl text-ghibli-deep mb-2">
                    {plan.format}
                  </div>
                  <div className="text-sm text-ghibli-deep/60 mb-4">
                    {plan.dimensions}
                  </div>
                  <p className="text-ghibli-deep/70 text-sm">{plan.description}</p>
                </div>

                <div className="py-6 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-6xl text-ghibli-deep">
                      {plan.price}
                    </span>
                    <span className="text-2xl text-ghibli-deep/70 font-semibold">€</span>
                  </div>
                  <div className="text-sm text-ghibli-deep/60 mt-1">TTC, livraison incluse</div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-ghibli-forest/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-ghibli-forest" strokeWidth={3} />
                      </div>
                      <span className="text-ghibli-deep/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/create"
                  className={
                    plan.popular
                      ? 'btn-primary text-center'
                      : 'btn-secondary text-center'
                  }
                >
                  Choisir {plan.format}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection