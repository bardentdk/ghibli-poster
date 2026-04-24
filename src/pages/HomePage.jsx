import HeroSection from '../components/sections/HeroSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import ShowcaseSection from '../components/sections/ShowcaseSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import PricingSection from '../components/sections/PricingSection'
import CTASection from '../components/sections/CTASection'

const HomePage = () => {
  return (
    <div className="relative">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  )
}

export default HomePage