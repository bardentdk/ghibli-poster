import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'

const SceneBackground = () => {
  const meshRef = useRef(null)

  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(256, 200, 50, 256, 256, 400)
    gradient.addColorStop(0, '#FFE4B5')
    gradient.addColorStop(0.3, '#FFF8DC')
    gradient.addColorStop(0.6, '#F4E4BC')
    gradient.addColorStop(1, '#D4C5A0')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.z = t * 0.02
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={25}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={gradientTexture} />
    </mesh>
  )
}

export default SceneBackground