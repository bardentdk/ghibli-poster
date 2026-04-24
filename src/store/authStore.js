import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { authService } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      loading: true,
      initialized: false,

      /**
       * Initialiser l'état d'authentification
       */
      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            set({
              user: session.user,
              profile,
              session,
              loading: false,
              initialized: true,
            })
          } else {
            set({ loading: false, initialized: true })
          }

          // Listener pour les changements d'auth
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              set({
                user: session.user,
                profile,
                session,
              })
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                profile: null,
                session: null,
              })
            } else if (event === 'TOKEN_REFRESHED' && session) {
              set({ session })
            }
          })
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ loading: false, initialized: true })
        }
      },

      /**
       * Inscription
       */
      signUp: async (credentials) => {
        set({ loading: true })
        try {
          const data = await authService.signUp(credentials)
          set({ loading: false })
          return data
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      /**
       * Connexion
       */
      signIn: async (credentials) => {
        set({ loading: true })
        try {
          const data = await authService.signIn(credentials)
          set({ loading: false })
          return data
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      /**
       * Déconnexion
       */
      signOut: async () => {
        set({ loading: true })
        try {
          await authService.signOut()
          set({
            user: null,
            profile: null,
            session: null,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      /**
       * Rafraîchir le profil
       */
      refreshProfile: async () => {
        const user = get().user
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        set({ profile })
      },
    }),
    {
      name: 'ghibli-auth-storage',
      partialize: (state) => ({
        // On ne persiste rien côté client pour la sécurité
        // Supabase gère sa propre session
      }),
    }
  )
)