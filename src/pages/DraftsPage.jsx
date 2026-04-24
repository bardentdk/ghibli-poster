import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye,
  Package,
  Clock,
  ImageOff,
  Palette,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { posterService } from '../services/posterService'
import { usePosterSave } from '../hooks/usePosterSave'
import { useAuthStore } from '../store/authStore'
import ProtectedRoute from '../components/auth/ProtectedRoute'

const DraftsContent = () => {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const navigate = useNavigate()
  const { loadDraft } = usePosterSave()
  const { user } = useAuthStore()

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    try {
      setLoading(true)
      const data = await posterService.getDrafts()
      setDrafts(data)
    } catch (error) {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (draft) => {
    try {
      await loadDraft(draft.id)
      toast.success('Brouillon chargé !')
      navigate('/create')
    } catch (error) {
      toast.error('Erreur lors du chargement')
    }
  }

  const handleDuplicate = async (draftId) => {
    try {
      await posterService.duplicate(draftId)
      toast.success('Brouillon dupliqué')
      loadDrafts()
    } catch (error) {
      toast.error('Erreur de duplication')
    }
  }

  const handleDelete = async (draftId) => {
    try {
      await posterService.delete(draftId)
      toast.success('Brouillon supprimé')
      setDeleteConfirm(null)
      loadDrafts()
    } catch (error) {
      toast.error('Erreur de suppression')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute top-40 right-0 w-96 h-96 bg-ghibli-sunset/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-96 left-0 w-96 h-96 bg-ghibli-forest/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ghibli-forest/10 rounded-full mb-3">
              <Palette className="w-3.5 h-3.5 text-ghibli-forest" />
              <span className="text-xs font-semibold text-ghibli-forest uppercase tracking-wider">
                Espace créatif
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-3">
              Mes <span className="text-gradient">brouillons</span>
            </h1>
            <p className="text-ghibli-deep/70">
              Retrouvez et reprenez vos créations en cours
            </p>
          </div>

          <Link
            to="/create?new=true"
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <Plus className="w-5 h-5" />
            Nouvelle affiche
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-ghibli animate-pulse">
                <div className="aspect-[3/4] bg-ghibli-cream rounded-xl mb-4" />
                <div className="h-4 bg-ghibli-cream rounded w-3/4 mb-2" />
                <div className="h-3 bg-ghibli-cream rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : drafts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-ghibli text-center py-20 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-ghibli-forest/10 flex items-center justify-center mx-auto mb-6">
              <Palette className="w-10 h-10 text-ghibli-forest" />
            </div>
            <h3 className="font-display text-3xl text-ghibli-deep mb-3">
              Aucun brouillon pour le moment
            </h3>
            <p className="text-ghibli-deep/70 mb-8 max-w-md mx-auto">
              Commencez votre première création et transformez vos plus beaux souvenirs en œuvres d'art Ghibli.
            </p>
            <Link to="/create?new=true" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Créer ma première affiche
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {drafts.map((draft, index) => (
                <motion.div
                  key={draft.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group card-ghibli p-0 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-ghibli-cream to-ghibli-sand overflow-hidden">
                    {draft.ghibli_image_url ? (
                      <img
                        src={draft.ghibli_image_url}
                        alt={draft.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-12 h-12 text-ghibli-deep/20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-ghibli-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {draft.title && draft.ghibli_image_url && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        {draft.producers && (
                          <div className="text-white/80 text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            {draft.producers}
                          </div>
                        )}
                        <div className="font-display text-lg text-white text-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          {draft.title}
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-ghibli-deep">
                        {draft.format}
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDuplicate(draft.id)}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-all"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4 text-ghibli-deep" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(draft)}
                        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-500 hover:text-white shadow-lg flex items-center justify-center hover:scale-110 transition-all group/delete"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-ghibli-deep group-hover/delete:text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-ghibli-deep mb-1 truncate">
                      {draft.title === 'Sans titre' ? (
                        <span className="italic text-ghibli-deep/50">Sans titre</span>
                      ) : (
                        draft.title
                      )}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-ghibli-deep/60 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(draft.updated_at)}
                      </span>
                      <span className="px-2 py-0.5 bg-ghibli-forest/10 text-ghibli-forest rounded-full font-semibold">
                        Brouillon
                      </span>
                    </div>

                    <button
                      onClick={() => handleEdit(draft)}
                      className="w-full py-2.5 bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all group/edit"
                    >
                      <Edit3 className="w-4 h-4" />
                      Continuer
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-ghibli-deep/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-display text-2xl text-ghibli-deep mb-2">
                  Supprimer ce brouillon ?
                </h3>
                <p className="text-ghibli-deep/70 mb-6">
                  Cette action est irréversible. Le brouillon "{deleteConfirm.title}" et ses images seront définitivement supprimés.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 bg-ghibli-cream text-ghibli-deep rounded-xl font-semibold hover:bg-ghibli-sand transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm.id)}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const DraftsPage = () => {
  return (
    <ProtectedRoute>
      <DraftsContent />
    </ProtectedRoute>
  )
}

export default DraftsPage