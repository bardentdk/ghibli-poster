const ParentalAdvisory = ({ size = 'md' }) => {
  const sizes = {
    sm: { container: 'w-12 h-14', top: 'text-[6px]', bottom: 'text-[5px]' },
    md: { container: 'w-16 h-20', top: 'text-[8px]', bottom: 'text-[7px]' },
    lg: { container: 'w-20 h-24', top: 'text-[10px]', bottom: 'text-[8px]' },
  }

  const currentSize = sizes[size]

  return (
    <div className={`${currentSize.container} bg-black flex flex-col items-center justify-between p-1 border border-white/30`}>
      <div className={`${currentSize.top} text-white font-bold tracking-tight text-center leading-tight`}>
        PARENTAL<br />ADVISORY
      </div>
      <div className={`${currentSize.bottom} text-white font-bold tracking-widest text-center leading-tight`}>
        EXPLICIT<br />CONTENT
      </div>
    </div>
  )
}

export default ParentalAdvisory