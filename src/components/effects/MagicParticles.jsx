import { useEffect, useRef } from 'react'

const MagicParticles = ({ count = 50, color = 'rgba(255, 215, 0, 0.6)' }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    class Particle {
      constructor() {
        this.reset()
        this.y = Math.random() * height
      }

      reset() {
        this.x = Math.random() * width
        this.y = height + 10
        this.size = Math.random() * 3 + 1
        this.speedY = Math.random() * 1 + 0.3
        this.speedX = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.8 + 0.2
        this.pulse = Math.random() * Math.PI * 2
      }

      update() {
        this.y -= this.speedY
        this.x += this.speedX
        this.pulse += 0.05

        if (this.y < -10) {
          this.reset()
        }
      }

      draw() {
        const pulseFactor = (Math.sin(this.pulse) + 1) / 2
        const currentSize = this.size * (0.8 + pulseFactor * 0.4)
        const currentOpacity = this.opacity * (0.6 + pulseFactor * 0.4)

        ctx.beginPath()
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${currentOpacity})`)
        ctx.fill()

        // Halo
        ctx.beginPath()
        ctx.arc(this.x, this.y, currentSize * 3, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, currentSize * 3
        )
        gradient.addColorStop(0, color.replace(/[\d.]+\)$/, `${currentOpacity * 0.3})`))
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'))
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    particlesRef.current = Array.from({ length: count }, () => new Particle())

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particlesRef.current.forEach(particle => {
        particle.update()
        particle.draw()
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

export default MagicParticles