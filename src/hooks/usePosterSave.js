import { useState } from 'react'
import toast from 'react-hot-toast'
import { posterService } from '../services/posterService'
import { usePosterStore } from '../store/posterStore'

export const usePosterSave = () => {
  const [saving, setSaving] = useState(false)
  const [saveProgress, setSaveProgress] = useState({ step: '', progress: 0 })

  const {
    posterId,
    originalImage,
    originalImageUrl,
    ghibliImageUrl,
    title,
    directors,
    tagline,
    releaseDate,
    credits,
    format,
    designConfig,
    setPosterId,
    setOriginalImage,
    setGhibliImage,
  } = usePosterStore()

  const saveDraft = async ({ silent = false } = {}) => {
    setSaving(true)
    setSaveProgress({ step: 'init', progress: 0 })

    const toastId = silent ? null : toast.loading('Sauvegarde en cours...')

    try {
      const saved = await posterService.saveDraft({
        posterId,
        originalImage,
        originalImageUrl,
        ghibliImageUrl,
        title,
        directors,
        tagline,
        releaseDate,
        credits,
        format,
        designConfig,
        onProgress: (p) => setSaveProgress(p),
      })

      setPosterId(saved.id)
      
      if (saved.original_image_url) {
        setOriginalImage(null, saved.original_image_url, null)
      }
      if (saved.ghibli_image_url) {
        setGhibliImage(saved.ghibli_image_url, null)
      }

      if (!silent) {
        toast.success('Brouillon sauvegardé !', { id: toastId })
      }
      
      setSaving(false)
      return saved
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      if (!silent) {
        toast.error(error.message || 'Erreur de sauvegarde', { id: toastId })
      }
      setSaving(false)
      throw error
    }
  }

  const loadDraft = async (draftId) => {
    try {
      const draft = await posterService.getById(draftId)
      
      usePosterStore.setState({
        posterId: draft.id,
        originalImage: null,
        originalImageUrl: draft.original_image_url,
        originalImagePath: null,
        ghibliImageUrl: draft.ghibli_image_url,
        ghibliImagePath: null,
        title: draft.title === 'Sans titre' ? '' : draft.title,
        directors: draft.producers || '',
        tagline: draft.description || '',
        releaseDate: draft.design_config?.releaseDate || '',
        credits: draft.design_config?.credits || '',
        format: draft.format,
        designConfig: draft.design_config || {},
        currentStep: 4,
        isGenerating: false,
        generationProgress: 0,
      })

      return draft
    } catch (error) {
      console.error('Erreur chargement:', error)
      throw error
    }
  }

  return {
    saving,
    saveProgress,
    saveDraft,
    loadDraft,
  }
}