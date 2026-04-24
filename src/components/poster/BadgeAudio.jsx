import { AUDIO_BADGES } from '../../config/posterBadges'

const BadgeAudio = ({ badge, size = 'md' }) => {
  if (!badge || badge === 'none') return null

  const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-[9px]', gap: 'gap-1' },
    md: { icon: 'w-6 h-6', text: 'text-xs', gap: 'gap-1.5' },
    lg: { icon: 'w-8 h-8', text: 'text-sm', gap: 'gap-2' },
  }

  const currentSize = sizes[size]

  const renderBadge = () => {
    switch (badge) {
      case 'dolby_atmos':
        return (
          <div className={`flex items-center ${currentSize.gap} text-white`}>
            <div className="flex items-center">
              <DolbyLogo className={currentSize.icon} />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`${currentSize.text} font-black tracking-widest`}>ATMOS</span>
            </div>
          </div>
        )
      case 'dolby_digital':
        return (
          <div className={`flex items-center ${currentSize.gap} text-white`}>
            <DolbyLogo className={currentSize.icon} />
            <span className={`${currentSize.text} font-black tracking-widest`}>DIGITAL</span>
          </div>
        )
      case 'dts_x':
        return (
          <div className={`flex items-center ${currentSize.gap} text-white`}>
            <div className={`${currentSize.icon} rounded-sm bg-white flex items-center justify-center`}>
              <span className="text-black text-[7px] font-black">DTS</span>
            </div>
            <span className={`${currentSize.text} font-black tracking-widest`}>DTS:X</span>
          </div>
        )
      case 'imax':
        return (
          <div className={`flex items-center ${currentSize.gap} text-white`}>
            <span className={`${currentSize.text} font-black tracking-[0.2em] bg-white text-black px-2 py-0.5`}>
              IMAX
            </span>
          </div>
        )
      default:
        return null
    }
  }

  return renderBadge()
}

const DolbyLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 8 L7 16 L10 16 C12.5 16 13 14 13 12 C13 10 12.5 8 10 8 Z" fill="currentColor" />
    <path d="M11 8 L14 8 C16.5 8 17 10 17 12 C17 14 16.5 16 14 16 L11 16 Z" fill="currentColor" transform="scale(-1, 1) translate(-28, 0)" />
  </svg>
)

export default BadgeAudio