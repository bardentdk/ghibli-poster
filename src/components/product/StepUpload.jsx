import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, X, ArrowRight, AlertCircle, Camera, FileImage } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePosterStore } from '../../store/posterStore'

const StepUpload = () => {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { 
    originalImage, 
    setOriginalImage, 
    nextStep 
  } = usePosterStore()

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === 'file-too-large') {
        toast.error('Image trop lourde (max 10 Mo)')
      } else if (error.code === 'file-invalid-type') {
        toast.error('Format non supporté (JPG, PNG, WebP uniquement)')
      } else {
        toast.error('Erreur lors du chargement')
      }
      return
    }

    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    
    reader.onloadend = () => {
      setPreview(reader.result)
      setOriginalImage(file, reader.result, null)
      setUploading(false)
      toast.success('Photo chargée avec succès')
    }

    reader.onerror = () => {
      toast.error('Erreur de lecture du fichier')
      setUploading(false)
    }

    reader.readAsDataURL(file)
  }, [setOriginalImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
  })

  const handleRemove = () => {
    setPreview(null)
    setOriginalImage(null, null, null)
    toast.success('Photo supprimée')
  }

  const handleContinue = () => {
    if (!originalImage && !preview) {
      toast.error('Veuillez charger une photo')
      return
    }
    nextStep()
  }

  const currentPreview = preview || usePosterStore.getState().originalImageUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ghibli-forest/10 rounded-full mb-4"
        >
          <Camera className="w-4 h-4 text-ghibli-forest" />
          <span className="text-sm font-semibold text-ghibli-forest">Étape 1 sur 4</span>
        </motion.div>
        <h2 className="font-display text-5xl md:text-6xl text-ghibli-deep mb-4">
          Votre <span className="text-gradient">photo</span>
        </h2>
        <p className="text-lg text-ghibli-deep/70 max-w-2xl mx-auto">
          Choisissez la photo que vous souhaitez transformer en œuvre d'art Ghibli.
          Pour un meilleur résultat, préférez une photo lumineuse et bien cadrée.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!currentPreview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={`relative cursor-pointer group ${
              isDragActive ? 'scale-102' : ''
            } transition-transform duration-300`}
          >
            <input {...getInputProps()} />
            <div
              className={`relative overflow-hidden rounded-3xl p-16 border-3 border-dashed transition-all duration-500 ${
                isDragActive
                  ? 'border-ghibli-sunset bg-ghibli-sunset/10'
                  : 'border-ghibli-forest/30 bg-white/40 backdrop-blur-sm hover:border-ghibli-forest hover:bg-white/60'
              }`}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-ghibli-sunset/30 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-ghibli-sky/30 rounded-full blur-3xl animate-pulse-slow" />
              </div>

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    y: isDragActive ? [-10, 10, -10] : [0, -10, 0],
                  }}
                  transition={{
                    duration: isDragActive ? 0.5 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-ghibli-forest via-ghibli-sunset to-ghibli-sky flex items-center justify-center shadow-2xl mb-6 group-hover:shadow-glow-lg transition-shadow"
                >
                  <Upload className="w-10 h-10 text-white" strokeWidth={2} />
                </motion.div>

                <h3 className="font-display text-3xl text-ghibli-deep mb-3">
                  {isDragActive ? 'Relâchez ici' : 'Glissez votre photo'}
                </h3>
                <p className="text-ghibli-deep/70 mb-6 max-w-md">
                  ou <span className="font-semibold text-ghibli-forest">cliquez pour parcourir</span> vos fichiers
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-ghibli-deep/10">
                    <FileImage className="w-4 h-4 text-ghibli-forest" />
                    <span className="text-sm font-semibold text-ghibli-deep">JPG, PNG, WebP</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-ghibli-deep/10">
                    <ImageIcon className="w-4 h-4 text-ghibli-forest" />
                    <span className="text-sm font-semibold text-ghibli-deep">Max 10 Mo</span>
                  </div>
                </div>

                {uploading && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-6 h-6 border-3 border-ghibli-forest border-t-transparent rounded-full animate-spin" />
                    <span className="text-ghibli-forest font-semibold">Chargement...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="card-ghibli p-4">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={currentPreview}
                  alt="Aperçu"
                  className="w-full h-auto max-h-[600px] object-contain bg-ghibli-cream"
                />
                
                <button
                  onClick={handleRemove}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Supprimer la photo"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-ghibli-forest/20 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-ghibli-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ghibli-deep truncate">
                      {originalImage?.name || 'Photo chargée'}
                    </div>
                    {originalImage && (
                      <div className="text-xs text-ghibli-deep/60">
                        {(originalImage.size / 1024 / 1024).toFixed(2)} Mo
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 p-4 bg-ghibli-sky/10 border border-ghibli-sky/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-ghibli-sky flex-shrink-0 mt-0.5" />
              <div className="text-sm text-ghibli-deep/80">
                <strong>Conseil :</strong> Pour un meilleur rendu Ghibli, utilisez une photo claire avec un sujet principal bien visible.
                Les paysages et portraits donnent les meilleurs résultats.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex justify-end">
        <motion.button
          whileHover={{ scale: currentPreview ? 1.05 : 1 }}
          whileTap={{ scale: currentPreview ? 0.95 : 1 }}
          onClick={handleContinue}
          disabled={!currentPreview}
          className={`group flex items-center gap-2 px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 ${
            currentPreview
              ? 'bg-gradient-to-r from-ghibli-forest to-ghibli-moss text-white hover:shadow-xl'
              : 'bg-ghibli-deep/10 text-ghibli-deep/40 cursor-not-allowed'
          }`}
        >
          Continuer
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default StepUpload