const StudioLogo = ({ logo, size = 'md' }) => {
  if (!logo || logo === 'none') return null

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }

  const currentSize = sizes[size]

  const renderLogo = () => {
    switch (logo) {
      case 'wb':
        return (
          <div className={`${currentSize} bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center border-2 border-yellow-400/50 shadow-lg`}>
            <span className="text-white font-black text-xl" style={{ fontFamily: 'serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              WB
            </span>
          </div>
        )
      case 'universal':
        return (
          <div className={`${currentSize} bg-gradient-to-b from-blue-600 to-blue-900 rounded-full flex items-center justify-center border-2 border-blue-400/50 shadow-lg`}>
            <span className="text-white font-black text-[10px] tracking-tight text-center leading-tight">
              UNIV
            </span>
          </div>
        )
      case 'paramount':
        return (
          <div className={`${currentSize} bg-gradient-to-b from-blue-400 to-blue-700 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}>
            <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white" fill="currentColor">
              <path d="M12 2 L22 22 L2 22 Z" strokeWidth="1" stroke="white" fill="none" />
            </svg>
          </div>
        )
      case 'sony':
        return (
          <div className={`${currentSize} bg-black rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}>
            <span className="text-white font-bold text-[9px] tracking-wider">SONY</span>
          </div>
        )
      case 'disney':
        return (
          <div className={`${currentSize} bg-gradient-to-b from-blue-500 to-purple-700 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}>
            <span className="text-white font-black text-[8px]" style={{ fontStyle: 'italic' }}>
              DISNEY
            </span>
          </div>
        )
      case 'netflix':
        return (
          <div className={`${currentSize} bg-black rounded-full flex items-center justify-center border-2 border-red-600/50 shadow-lg`}>
            <span className="text-red-600 font-black text-[9px] tracking-wider">N</span>
          </div>
        )
      default:
        return null
    }
  }

  return renderLogo()
}

export default StudioLogo