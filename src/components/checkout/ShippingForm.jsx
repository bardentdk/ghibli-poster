import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Building, 
  Globe,
  MessageSquare,
  ArrowRight
} from 'lucide-react'
import { useEffect } from 'react'
import FormInput from '../ui/FormInput'
import { shippingAddressSchema } from '../../utils/validationSchemas'
import { useAuthStore } from '../../store/authStore'

const ShippingForm = ({ onSubmit, defaultValues, loading }) => {
  const { profile, user } = useAuthStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: defaultValues?.name || profile?.full_name || '',
      email: defaultValues?.email || user?.email || '',
      phone: defaultValues?.phone || profile?.phone || '',
      addressLine1: defaultValues?.addressLine1 || profile?.address_line1 || '',
      addressLine2: defaultValues?.addressLine2 || profile?.address_line2 || '',
      city: defaultValues?.city || profile?.city || '',
      postalCode: defaultValues?.postalCode || profile?.postal_code || '',
      country: defaultValues?.country || profile?.country || 'France',
      notes: defaultValues?.notes || '',
    },
  })

  useEffect(() => {
    if (profile && !defaultValues) {
      reset({
        name: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        addressLine1: profile.address_line1 || '',
        addressLine2: profile.address_line2 || '',
        city: profile.city || '',
        postalCode: profile.postal_code || '',
        country: profile.country || 'France',
        notes: '',
      })
    }
  }, [profile, user])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-ghibli"
      >
        <h3 className="font-display text-2xl text-ghibli-deep mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-ghibli-forest" />
          Vos coordonnées
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nom complet"
            icon={User}
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <FormInput
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="mt-4">
          <FormInput
            label="Téléphone (optionnel)"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            helper="Pour le suivi de livraison"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-ghibli"
      >
        <h3 className="font-display text-2xl text-ghibli-deep mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-ghibli-forest" />
          Adresse de livraison
        </h3>

        <div className="space-y-4">
          <FormInput
            label="Adresse"
            icon={Home}
            autoComplete="address-line1"
            placeholder="12 rue des Châtaigniers"
            error={errors.addressLine1?.message}
            {...register('addressLine1')}
          />

          <FormInput
            label="Complément d'adresse (optionnel)"
            icon={Building}
            autoComplete="address-line2"
            placeholder="Bâtiment B, 3ème étage"
            error={errors.addressLine2?.message}
            {...register('addressLine2')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Code postal"
              icon={MapPin}
              autoComplete="postal-code"
              error={errors.postalCode?.message}
              className="md:col-span-1"
              {...register('postalCode')}
            />
            <FormInput
              label="Ville"
              icon={Building}
              autoComplete="address-level2"
              error={errors.city?.message}
              className="md:col-span-2"
              {...register('city')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ghibli-deep mb-2 ml-2">
              Pays
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghibli-deep/40" />
              <select
                {...register('country')}
                className="w-full pl-12 pr-4 py-5 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-ghibli-deep/10 focus:ring-2 focus:ring-ghibli-forest focus:outline-none text-ghibli-deep font-medium appearance-none cursor-pointer"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Monaco">Monaco</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-ghibli"
      >
        <h3 className="font-display text-2xl text-ghibli-deep mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-ghibli-forest" />
          Instructions (optionnel)
        </h3>

        <div>
          <textarea
            {...register('notes')}
            placeholder="Code d'accès, horaires préférés, précisions pour le livreur..."
            rows={3}
            className="w-full px-4 py-3 bg-white/90 border-2 border-ghibli-deep/10 rounded-2xl text-ghibli-deep placeholder:text-ghibli-deep/30 focus:outline-none focus:border-ghibli-forest transition-all resize-none"
          />
          {errors.notes && (
            <p className="text-xs text-red-500 font-medium mt-2 ml-2">
              {errors.notes.message}
            </p>
          )}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        type="submit"
        disabled={loading}
        className="group relative w-full py-4 bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden disabled:opacity-70"
      >
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Préparation du paiement...</span>
            </>
          ) : (
            <>
              <span>Procéder au paiement sécurisé</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>
      </motion.button>
    </form>
  )
}

export default ShippingForm