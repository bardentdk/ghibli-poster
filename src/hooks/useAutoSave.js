import { useEffect, useRef } from 'react'
import { usePosterStore } from '../store/posterStore'
import { useAuthStore } from '../store/authStore'
import { usePosterSave } from './usePosterSave'
import { storageService } from '../services/storageService'

/**
 * Auto-save du brouillon toutes les X secondes
 * Uniquement si l'utilisateur est connecté et a une image Ghibli valide
 */
export const useAutoSave = ({ enabled = true, delay = 30000 } = {}) => {
  const { user } = useAuthStore()
  const { saveDraft } = usePosterSave()
  const {
    posterId,
    ghibliImageUrl,
    title,
    directors,
    tagline,
    releaseDate,
    credits,
    format,
  } = usePosterStore()

  const lastSavedRef = useRef(null)
  const timeoutRef = useRef(null)
  const failureCountRef = useRef(0)
  const isBlockedRef = useRef(false)

  useEffect(() => {
    // Conditions de base
    if (!enabled || !user || !ghibliImageUrl) return

    // Si on a dépassé 3 échecs, on arrête pour ne pas spammer
    if (isBlockedRef.current) return

    // On n'auto-save QUE si on a une URL Supabase (pas un blob local)
    // Les blobs seront sauvegardés manuellement par l'utilisateur
    if (!storageService.isSupabaseUrl(ghibliImageUrl)) {
      return
    }

    // On n'auto-save que si on a déjà un posterId (premier save manuel obligatoire)
    if (!posterId) return

    const currentState = JSON.stringify({ 
      title, 
      directors, 
      tagline, 
      releaseDate, 
      credits, 
      format 
    })

    if (lastSavedRef.current === currentState) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await saveDraft({ silent: true })
        lastSavedRef.current = currentState
        failureCountRef.current = 0
      } catch (error) {
        console.error('Erreur auto-save:', error)
        failureCountRef.current += 1
        
        if (failureCountRef.current >= 3) {
          console.warn('Auto-save désactivé après 3 échecs')
          isBlockedRef.current = true
        }
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [
    enabled,
    user,
    posterId,
    ghibliImageUrl,
    title,
    directors,
    tagline,
    releaseDate,
    credits,
    format,
    delay,
    saveDraft,
  ])
}