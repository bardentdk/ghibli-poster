import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MagicDust = ({ count = 150 }) => {
  const pointsRef = useRef(null)

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Position aléatoire dans un volume autour de l'affiche
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6

      // Vélocités aléatoires
      velocities[i * 3] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 1] = Math.random() * 0.004 + 0.001
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002

      sizes[i] = Math.random() * 0.08 + 0.02
    }

    return { positions, velocities, sizes }
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const positions = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Reset quand particule sort du volume
      if (positions[i * 3 + 1] > 5) {
        positions[i * 3] = (Math.random() - 0.5) * 12
        positions[i * 3 + 1] = -5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y += 0.0008
  })

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 215, 0, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)

    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        map={particleTexture}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export default MagicDust