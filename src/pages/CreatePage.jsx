import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSearchParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePosterStore } from '../store/posterStore'
import { usePosterSave } from '../hooks/usePosterSave'
import { useAutoSave } from '../hooks/useAutoSave'
import { storageService } from '../services/storageService'
import ProductStepper from '../components/product/ProductStepper'
import StepUpload from '../components/product/StepUpload'
import StepGhibli from '../components/product/StepGhibli'
import StepDetails from '../components/product/StepDetails'
import StepPreview from '../components/product/StepPreview'
import UnsavedIndicator from '../components/product/UnsavedIndicator'

const CreatePage = () => {
  const currentStep = usePosterStore((state) => state.currentStep)
  const ghibliImageUrl = usePosterStore((state) => state.ghibliImageUrl)
  const resetPoster = usePosterStore((state) => state.reset)
  const setStep = usePosterStore((state) => state.setStep)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const { loadDraft } = usePosterSave()

  useAutoSave({ enabled: true, delay: 30000 })

  // Gestion de l'état initial selon les paramètres d'URL
  useEffect(() => {
    const draftId = searchParams.get('draft')
    const isNew = searchParams.get('new')

    if (draftId) {
      const load = async () => {
        try {
          await loadDraft(draftId)
          toast.success('Brouillon chargé')
        } catch (error) {
          toast.error('Brouillon introuvable')
          resetPoster()
        }
      }
      load()
    } else if (isNew === 'true') {
      resetPoster()
      // Retirer le paramètre de l'URL pour éviter le reset infini
      window.history.replaceState({}, '', '/create')
    } else {
      // Vérification de cohérence : si on est à un step > 1 mais sans image valide, on reset
      const hasValidGhibli = ghibliImageUrl && storageService.isSupabaseUrl(ghibliImageUrl)
      
      if (currentStep > 1 && !hasValidGhibli) {
        console.log('État incohérent détecté, retour à l\'étape 1')
        resetPoster()
      }
    }
  }, [searchParams.toString()])

  // Scroll en haut à chaque changement d'étape
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute top-40 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-96 left-0 w-96 h-96 bg-ghibli-forest/10 rounded-full blur-3xl -z-10" />

      <UnsavedIndicator />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductStepper />

        <AnimatePresence mode="wait">
          {currentStep === 1 && <StepUpload key="step1" />}
          {currentStep === 2 && <StepGhibli key="step2" />}
          {currentStep === 3 && <StepDetails key="step3" />}
          {currentStep === 4 && <StepPreview key="step4" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CreatePage