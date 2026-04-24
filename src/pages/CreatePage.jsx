import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePosterStore } from '../store/posterStore'
import ProductStepper from '../components/product/ProductStepper'
import StepUpload from '../components/product/StepUpload'
import StepGhibli from '../components/product/StepGhibli'
import StepDetails from '../components/product/StepDetails'
import StepPreview from '../components/product/StepPreview'

const CreatePage = () => {
  const currentStep = usePosterStore((state) => state.currentStep)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute top-40 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-96 left-0 w-96 h-96 bg-ghibli-forest/10 rounded-full blur-3xl -z-10" />

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