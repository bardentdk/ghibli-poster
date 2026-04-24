import { motion } from 'framer-motion'

const Cloud = ({ delay, duration, top, scale, opacity }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top }}
      initial={{ x: '-20vw' }}
      animate={{ x: '120vw' }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        width={200 * scale}
        height={80 * scale}
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <ellipse cx="50" cy="50" rx="40" ry="25" fill="white" />
        <ellipse cx="90" cy="40" rx="45" ry="30" fill="white" />
        <ellipse cx="140" cy="45" rx="40" ry="28" fill="white" />
        <ellipse cx="170" cy="55" rx="25" ry="20" fill="white" />
      </svg>
    </motion.div>
  )
}

const FloatingClouds = () => {
  const clouds = [
    { delay: 0, duration: 60, top: '10%', scale: 1, opacity: 0.7 },
    { delay: 15, duration: 80, top: '25%', scale: 0.7, opacity: 0.5 },
    { delay: 30, duration: 70, top: '40%', scale: 1.2, opacity: 0.6 },
    { delay: 45, duration: 90, top: '60%', scale: 0.8, opacity: 0.4 },
    { delay: 20, duration: 75, top: '75%', scale: 1, opacity: 0.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {clouds.map((cloud, index) => (
        <Cloud key={index} {...cloud} />
      ))}
    </div>
  )
}

export default FloatingClouds