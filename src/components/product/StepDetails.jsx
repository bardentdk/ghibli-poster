import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Type, 
  ArrowRight, 
  ArrowLeft, 
  Film, 
  Users, 
  FileText, 
  Calendar,
  ScrollText,
  Palette,
  AlertCircle,
  ChevronDown,
  Settings2
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePosterStore } from '../../store/posterStore'
import PosterRenderer from '../poster/PosterRenderer'
import { 
  RATINGS, 
  AUDIO_BADGES, 
  STUDIO_LOGOS, 
  ACCENT_COLORS,
  TITLE_FONTS
} from '../../config/posterBadges'

const schema = z.object({
  directors: z.string().max(100, 'Maximum 100 caractères').optional(),
  title: z.string().min(1, 'Le titre est requis').max(50, 'Maximum 50 caractères'),
  tagline: z.string().max(120, 'Maximum 120 caractères').optional(),
  releaseDate: z.string().max(30, 'Maximum 30 caractères').optional(),
  credits: z.string().max(500, 'Maximum 500 caractères').optional(),
})

const StepDetails = () => {
  const {
    title,
    tagline,
    directors,
    releaseDate,
    credits,
    ghibliImageUrl,
    designConfig,
    setTitle,
    setTagline,
    setDirectors,
    setReleaseDate,
    setCredits,
    updateDesignConfig,
    nextStep,
    prevStep,
  } = usePosterStore()

  const [showAdvanced, setShowAdvanced] = useState(false)

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
      tagline,
      directors,
      releaseDate,
      credits,
    },
  })

  const watched = watch()

  useEffect(() => { setTitle(watched.title || '') }, [watched.title])
  useEffect(() => { setTagline(watched.tagline || '') }, [watched.tagline])
  useEffect(() => { setDirectors(watched.directors || '') }, [watched.directors])
  useEffect(() => { setReleaseDate(watched.releaseDate || '') }, [watched.releaseDate])
  useEffect(() => { setCredits(watched.credits || '') }, [watched.credits])

  const onSubmit = () => {
    nextStep()
  }

  const handleDesignChange = (key, value) => {
    updateDesignConfig({ [key]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
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
          Créez une véritable affiche de film avec tous les éléments cinématographiques.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8">
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* SECTION 1 : Informations principales */}
          <div className="card-ghibli space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-ghibli-deep/10">
              <Film className="w-5 h-5 text-ghibli-forest" />
              <h3 className="font-display text-xl text-ghibli-deep">Informations principales</h3>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2 text-sm">
                <Users className="w-4 h-4 text-ghibli-forest" />
                Réalisateurs
                <span className="text-xs text-ghibli-deep/50 font-normal">(2 max)</span>
              </label>
              <input
                type="text"
                {...register('directors')}
                placeholder="Vincent Pelops & Marie Dupont"
                maxLength={100}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all ${
                  errors.directors ? 'border-red-400' : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-ghibli-deep/50">Apparaît en haut : "FROM THE DIRECTORY OF"</span>
                <span className="text-ghibli-deep/50">{watched.directors?.length || 0}/100</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2 text-sm">
                <Film className="w-4 h-4 text-ghibli-forest" />
                Titre du film
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="MACRO NO-JUSTU"
                maxLength={50}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-xl font-bold text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all uppercase ${
                  errors.title ? 'border-red-400' : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-1.5 text-xs">
                {errors.title ? (
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </span>
                ) : (
                  <span className="text-ghibli-deep/50">Le titre principal (automatiquement en majuscules)</span>
                )}
                <span className="text-ghibli-deep/50">{watched.title?.length || 0}/50</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2 text-sm">
                <FileText className="w-4 h-4 text-ghibli-forest" />
                Sous-titre / Tagline
              </label>
              <input
                type="text"
                {...register('tagline')}
                placeholder="Hier on avait un frèro, aujourd'hui on a un macro"
                maxLength={120}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all ${
                  errors.tagline ? 'border-red-400' : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-ghibli-deep/50">Phrase d'accroche sous le titre</span>
                <span className="text-ghibli-deep/50">{watched.tagline?.length || 0}/120</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2 text-sm">
                <Calendar className="w-4 h-4 text-ghibli-forest" />
                Date de sortie
              </label>
              <input
                type="text"
                {...register('releaseDate')}
                placeholder="16 FÉVRIER 2026"
                maxLength={30}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all ${
                  errors.releaseDate ? 'border-red-400' : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-ghibli-deep/50">Affichée verticalement à gauche</span>
                <span className="text-ghibli-deep/50">{watched.releaseDate?.length || 0}/30</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-ghibli-deep font-semibold mb-2 text-sm">
                <ScrollText className="w-4 h-4 text-ghibli-forest" />
                Crédits du film
              </label>
              <textarea
                {...register('credits')}
                placeholder="Film réalisé par Vincent Pelops, responsable communication..."
                maxLength={500}
                rows={4}
                className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none transition-all resize-none text-sm ${
                  errors.credits ? 'border-red-400' : 'border-ghibli-deep/10 focus:border-ghibli-forest'
                }`}
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-ghibli-deep/50">Texte long en bas de l'affiche</span>
                <span className="text-ghibli-deep/50">{watched.credits?.length || 0}/500</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 : Badges et ratings */}
          <div className="card-ghibli space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-ghibli-deep/10">
              <Settings2 className="w-5 h-5 text-ghibli-forest" />
              <h3 className="font-display text-xl text-ghibli-deep">Badges & Classifications</h3>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-ghibli-deep font-semibold mb-2 text-sm">
                Classification d'âge
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleDesignChange('rating', r.value)}
                    className={`relative py-3 rounded-xl text-sm font-bold transition-all ${
                      designConfig.rating === r.value
                        ? 'ring-2 ring-offset-2 ring-ghibli-forest shadow-lg scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: r.value === 'none' ? '#E5E7EB' : r.color,
                      color: r.value === 'none' ? '#6B7280' : 'white',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Badge */}
            <div>
              <label className="block text-ghibli-deep font-semibold mb-2 text-sm">
                Badge audio
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {AUDIO_BADGES.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => handleDesignChange('audioBadge', a.value)}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all ${
                      designConfig.audioBadge === a.value
                        ? 'bg-ghibli-forest text-white shadow-lg scale-105'
                        : 'bg-white/60 text-ghibli-deep hover:bg-white'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Logo */}
            <div>
              <label className="block text-ghibli-deep font-semibold mb-2 text-sm">
                Logo studio
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {STUDIO_LOGOS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleDesignChange('studioLogo', s.value)}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all ${
                      designConfig.studioLogo === s.value
                        ? 'bg-ghibli-forest text-white shadow-lg scale-105'
                        : 'bg-white/60 text-ghibli-deep hover:bg-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parental Advisory */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={designConfig.showParentalAdvisory}
                  onChange={(e) => handleDesignChange('showParentalAdvisory', e.target.checked)}
                  className="w-5 h-5 rounded border-ghibli-deep/20 text-ghibli-forest focus:ring-ghibli-forest"
                />
                <div>
                  <div className="text-ghibli-deep font-semibold text-sm">
                    Afficher "Parental Advisory - Explicit Content"
                  </div>
                  <div className="text-xs text-ghibli-deep/60">
                    Badge noir et blanc en bas à gauche
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 3 : Options avancées */}
          <div className="card-ghibli">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-ghibli-forest" />
                <h3 className="font-display text-xl text-ghibli-deep">Design avancé</h3>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-ghibli-deep/60 transition-transform ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
              />
            </button>

            <motion.div
              initial={false}
              animate={{ 
                height: showAdvanced ? 'auto' : 0,
                opacity: showAdvanced ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-5 pt-5 mt-5 border-t border-ghibli-deep/10">
                {/* Police du titre */}
                <div>
                  <label className="block text-ghibli-deep font-semibold mb-2 text-sm">
                    Style du titre
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TITLE_FONTS.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => handleDesignChange('titleFont', f.value)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all text-left ${
                          designConfig.titleFont === f.value
                            ? 'bg-ghibli-forest text-white shadow-lg'
                            : 'bg-white/60 text-ghibli-deep hover:bg-white'
                        }`}
                        style={{ fontFamily: f.fontFamily }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleur d'accent */}
                <div>
                  <label className="block text-ghibli-deep font-semibold mb-2 text-sm">
                    Couleur d'accent (nom des réalisateurs)
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => handleDesignChange('accentColor', c.value)}
                        className={`aspect-square rounded-xl transition-all ${
                          designConfig.accentColor === c.value
                            ? 'ring-2 ring-offset-2 ring-ghibli-forest scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Date verticale */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={designConfig.showDateVertical}
                      onChange={(e) => handleDesignChange('showDateVertical', e.target.checked)}
                      className="w-5 h-5 rounded border-ghibli-deep/20 text-ghibli-forest focus:ring-ghibli-forest"
                    />
                    <div>
                      <div className="text-ghibli-deep font-semibold text-sm">
                        Afficher la date verticalement
                      </div>
                      <div className="text-xs text-ghibli-deep/60">
                        Sur le côté gauche de l'affiche
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.form>

        {/* PRÉVISUALISATION */}
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

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: '1414/2000' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ transform: `scale(${0.3})`, transformOrigin: 'center' }}>
                  <PosterRenderer
                    imageUrl={ghibliImageUrl}
                    title={watched.title}
                    tagline={watched.tagline}
                    directors={watched.directors}
                    releaseDate={watched.releaseDate}
                    credits={watched.credits}
                    designConfig={designConfig}
                    scale={1}
                    withWatermark={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-ghibli-deep/60">
                Le filigrane disparaît une fois la commande validée
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