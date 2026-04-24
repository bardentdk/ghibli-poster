import { RATINGS } from '../../config/posterBadges'

const BadgeRating = ({ rating, size = 'md' }) => {
  const ratingConfig = RATINGS.find((r) => r.value === rating)
  if (!ratingConfig || rating === 'none') return null

  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-xs' },
    md: { container: 'w-14 h-14', text: 'text-base' },
    lg: { container: 'w-20 h-20', text: 'text-xl' },
  }

  const currentSize = sizes[size]

  return (
    <div
      className={`${currentSize.container} rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white/30`}
      style={{ backgroundColor: ratingConfig.color }}
    >
      <span className={`${currentSize.text} font-black tracking-tight`}>
        {ratingConfig.label}
      </span>
    </div>
  )
}

export default BadgeRating