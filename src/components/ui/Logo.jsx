import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const Logo = ({ variant = 'dark' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-ghibli-deep'
  const accentColor = variant === 'light' ? 'text-ghibli-cream' : 'text-ghibli-forest'

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ghibli-forest via-ghibli-sunset to-ghibli-sky flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
          <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ghibli-forest via-ghibli-sunset to-ghibli-sky blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-display text-2xl ${textColor} transition-colors`}>
          Ghibli
        </span>
        <span className={`font-body text-xs tracking-widest uppercase ${accentColor} font-semibold`}>
          Poster Studio
        </span>
      </div>
    </Link>
  )
}

export default Logo