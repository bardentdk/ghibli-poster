import { ImageIcon } from 'lucide-react'

const ImagePlaceholder = ({
  src,
  alt,
  label,
  aspectRatio = '1/1',
  className = '',
  objectFit = 'cover',
  rounded = 'rounded-2xl',
}) => {
  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ aspectRatio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-${objectFit}`}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-ghibli-cream via-ghibli-sand to-ghibli-forest/20 flex flex-col items-center justify-center border-2 border-dashed border-ghibli-forest/30">
          <ImageIcon className="w-12 h-12 text-ghibli-forest/50 mb-2" strokeWidth={1.5} />
          <span className="text-ghibli-forest/70 font-semibold text-sm tracking-wider uppercase">
            {label || 'Zone Image'}
          </span>
          <span className="text-ghibli-forest/50 text-xs mt-1">
            {aspectRatio}
          </span>
        </div>
      )}
    </div>
  )
}

export default ImagePlaceholder