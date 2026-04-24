import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  currentStep: 1,
  originalImage: null,
  originalImageUrl: null,
  originalImagePath: null,
  ghibliImageUrl: null,
  ghibliImagePath: null,
  isGenerating: false,
  generationProgress: 0,
  title: '',
  producers: '',
  description: '',
  format: 'A4',
  designConfig: {
    theme: 'classic',
    titleFont: 'display',
    titleColor: '#283618',
    backgroundColor: '#FFF8DC',
  },
  posterId: null,
}

export const usePosterStore = create(
  persist(
    (set, get) => ({
      ...initialState,

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
      setProducers: (producers) => set({ producers }),
      setDescription: (description) => set({ description }),
      setFormat: (format) => set({ format }),
      setPosterId: (posterId) => set({ posterId }),
      
      updateDesignConfig: (config) => set((state) => ({
        designConfig: { ...state.designConfig, ...config }
      })),

      reset: () => set(initialState),
    }),
    {
      name: 'ghibli-poster-draft',
      partialize: (state) => ({
        currentStep: state.currentStep,
        ghibliImageUrl: state.ghibliImageUrl,
        ghibliImagePath: state.ghibliImagePath,
        title: state.title,
        producers: state.producers,
        description: state.description,
        format: state.format,
        designConfig: state.designConfig,
        posterId: state.posterId,
      }),
    }
  )
)