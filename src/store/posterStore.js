import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const getInitialState = () => ({
  currentStep: 1,
  originalImage: null,
  originalImageUrl: null,
  originalImagePath: null,
  ghibliImageUrl: null,
  ghibliImagePath: null,
  isGenerating: false,
  generationProgress: 0,
  
  title: '',
  tagline: '',
  directors: '',
  releaseDate: '',
  credits: '',
  
  format: 'A4',
  
  designConfig: {
    titleFont: 'condensed',
    accentColor: '#E74C3C',
    rating: 'none',
    audioBadge: 'none',
    studioLogo: 'none',
    showParentalAdvisory: false,
    showDateVertical: true,
  },
  
  posterId: null,
})

export const usePosterStore = create(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => {
        const current = get().currentStep
        if (current < 4) set({ currentStep: current + 1 })
      },
      
      prevStep: () => {
        const current = get().currentStep
        if (current > 1) set({ currentStep: current - 1 })
      },

      setOriginalImage: (file, url, path) => set({
        originalImage: file,
        originalImageUrl: url,
        originalImagePath: path,
      }),

      setGhibliImage: (url, path) => set({
        ghibliImageUrl: url,
        ghibliImagePath: path,
      }),

      setGenerating: (isGenerating, progress = 0) => set({
        isGenerating,
        generationProgress: progress,
      }),

      setTitle: (title) => set({ title }),
      setTagline: (tagline) => set({ tagline }),
      setDirectors: (directors) => set({ directors }),
      setReleaseDate: (releaseDate) => set({ releaseDate }),
      setCredits: (credits) => set({ credits }),
      setFormat: (format) => set({ format }),
      setPosterId: (posterId) => set({ posterId }),
      
      setProducers: (directors) => set({ directors }),
      setDescription: (tagline) => set({ tagline }),
      
      updateDesignConfig: (config) => set((state) => ({
        designConfig: { ...state.designConfig, ...config }
      })),

      /**
       * Reset complet du store (retour à l'étape 1 avec tout vide)
       */
      reset: () => {
        // Nettoyage du blob URL si présent (éviter les fuites mémoire)
        const state = get()
        if (state.ghibliImageUrl && state.ghibliImageUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(state.ghibliImageUrl)
          } catch (e) {
            console.warn('Impossible de revoke le blob URL:', e)
          }
        }
        if (state.originalImageUrl && state.originalImageUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(state.originalImageUrl)
          } catch (e) {}
        }

        // Reset de l'état
        set(getInitialState())
        
        // Force la suppression du localStorage
        try {
          localStorage.removeItem('ghibli-poster-draft')
        } catch (e) {
          console.warn('Impossible de nettoyer le localStorage:', e)
        }
      },
    }),
    {
      name: 'ghibli-poster-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        // On NE persiste PAS les blob URLs (ils sont invalides après reload)
        ghibliImageUrl: state.ghibliImageUrl && !state.ghibliImageUrl.startsWith('blob:') 
          ? state.ghibliImageUrl 
          : null,
        ghibliImagePath: state.ghibliImagePath,
        originalImageUrl: state.originalImageUrl && !state.originalImageUrl.startsWith('blob:')
          ? state.originalImageUrl
          : null,
        originalImagePath: state.originalImagePath,
        title: state.title,
        tagline: state.tagline,
        directors: state.directors,
        releaseDate: state.releaseDate,
        credits: state.credits,
        format: state.format,
        designConfig: state.designConfig,
        posterId: state.posterId,
      }),
      onRehydrateStorage: () => (state) => {
        // Si on a un état hydraté mais pas d'image Ghibli valide, on reset au step 1
        if (state && (!state.ghibliImageUrl || state.ghibliImageUrl.startsWith('blob:'))) {
          if (state.currentStep > 1) {
            state.currentStep = 1
            state.ghibliImageUrl = null
            state.originalImageUrl = null
          }
        }
      },
    }
  )
)