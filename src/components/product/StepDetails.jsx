import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Type, ArrowRight, ArrowLeft, Film, Users, FileText, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { usePosterStore } from '../../store/posterStore'

const schema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(50, 'Maximum 50 caractères'),
  producers: z
    .string()
    .max(100, 'Maximum 100 caractères')
    .optional(),
  description: z
    .string()
    .max(200, 'Maximum 200 caractères')
    .optional(),
})

const StepDetails = () => {
  const {
    title,
    producers,
    description,
    ghibliImageUrl,
    setTitle,
    setProducers,
    setDescription,
    nextStep,
    prevStep,
  } = usePosterStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title,
      producers,
      description,
    },
  })

  const watchedTitle = watch('title')
  const watchedProducers = watch('producers')
  const watchedDescription = watch('description')

  useEffect(() => {
    setTitle(watchedTitle || '')
  }, [watchedTitle])

  useEffect(() => {
    setProducers(watchedProducers || '')
  }, [watchedProducers])

  useEffect(() => {
    setDescription(watchedDescription || '')
  }, [watchedDescription])

  const onSubmit = () => {
    nextStep()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ghibli-sky/10 rounded-full mb-4"
        >
          <Type className="w-4 h-4 text-ghibli-sky" />
          <span className="text-sm font-semibold text-ghibli-sky">Étape 3 sur 4</span>
        </motion.div>
        <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
          <span className="text-gradient">Personnalisez</span> votre affiche
        </h2>
        <p className="text-lg text-ghibli-deep/70 max-w-2xl mx-auto">
          Ajoutez un titre, les personnages et une description pour rendre votre affiche unique, comme une vraie affiche de film Ghibli.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="card-ghibli space-y-6">
            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2">
                <Film className="w-4 h-4 text-ghibli-forest" />
                Titre de l'affiche
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="Le Voyage d'Emma"
                maxLength={50}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl font-display text-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all ${
                  errors.title
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-2">
                {errors.title ? (
                  <span className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </span>
                ) : (
                  <span className="text-xs text-ghibli-deep/50">
                    Le grand titre de votre affiche
                  </span>
                )}
                <span className="text-xs text-ghibli-deep/50">
                  {watchedTitle?.length || 0}/50
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2">
                <Users className="w-4 h-4 text-ghibli-forest" />
                Personnages / Producteurs
              </label>
              <input
                type="text"
                {...register('producers')}
                placeholder="Emma, Lucas & Papa"
                maxLength={100}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all ${
                  errors.producers
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-2">
                {errors.producers ? (
                  <span className="text-sm text-red-500">{errors.producers.message}</span>
                ) : (
                  <span className="text-xs text-ghibli-deep/50">
                    Qui apparaît sur la photo ?
                  </span>
                )}
                <span className="text-xs text-ghibli-deep/50">
                  {watchedProducers?.length || 0}/100
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2">
                <FileText className="w-4 h-4 text-ghibli-forest" />
                Description / Sous-titre
              </label>
              <textarea
                {...register('description')}
                placeholder="Une aventure inoubliable sur les côtes bretonnes, été 2024..."
                maxLength={200}
                rows={4}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all resize-none ${
                  errors.description
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-2">
                {errors.description ? (
                  <span className="text-sm text-red-500">{errors.description.message}</span>
                ) : (
                  <span className="text-xs text-ghibli-deep/50">
                    Une petite phrase qui raconte votre histoire
                  </span>
                )}
                <span className="text-xs text-ghibli-deep/50">
                  {watchedDescription?.length || 0}/200
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-ghibli-sunset/10 border border-ghibli-sunset/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-ghibli-sunset flex-shrink-0 mt-0.5" />
            <div className="text-sm text-ghibli-deep/80">
              <strong>Astuce :</strong> Un titre court et poétique fonctionne mieux. Pensez aux vrais films Ghibli : "Mon Voisin Totoro", "Le Château Ambulant"...
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <div className="card-ghibli p-4">
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-ghibli-sunset animate-pulse" />
              <span className="text-sm font-semibold text-ghibli-deep/60 uppercase tracking-wider">
                Aperçu en direct
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-gradient-to-br from-ghibli-cream to-ghibli-sand shadow-2xl">
              {ghibliImageUrl && (
                <img
                  src={ghibliImageUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                {watchedProducers && (
                  <motion.div
                    key={watchedProducers}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/80 text-xs tracking-[0.3em] uppercase mb-2 font-semibold"
                  >
                    {watchedProducers}
                  </motion.div>
                )}

                {watchedTitle && (
                  <motion.h3
                    key={watchedTitle}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-display text-4xl md:text-5xl text-white text-shadow-lg leading-tight mb-3"
                  >
                    {watchedTitle}
                  </motion.h3>
                )}

                {watchedDescription && (
                  <motion.p
                    key={watchedDescription}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/90 text-sm italic max-w-xs mx-auto leading-relaxed"
                  >
                    {watchedDescription}
                  </motion.p>
                )}

                {!watchedTitle && !watchedDescription && !watchedProducers && (
                  <div className="text-white/40 text-sm italic">
                    Remplissez les champs pour voir l'aperçu
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-ghibli-deep/60">
                Le rendu final 3D sera disponible à l'étape suivante
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 flex justify-between items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="group flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-ghibli-deep/20 rounded-full font-semibold text-ghibli-deep hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour
        </motion.button>

        <motion.button
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          whileTap={{ scale: isValid ? 0.95 : 1 }}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          className={`group flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 ${
            isValid
              ? 'bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white hover:shadow-xl'
              : 'bg-ghibli-deep/10 text-ghibli-deep/40 cursor-not-allowed'
          }`}
        >
          Voir en 3D
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default StepDetails