import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const StudioLighting = () => {
  const keyLightRef = useRef(null)

  useFrame((state) => {
    if (!keyLightRef.current) return
    const t = state.clock.getElapsedTime()
    keyLightRef.current.position.x = Math.sin(t * 0.3) * 5
    keyLightRef.current.position.z = Math.cos(t * 0.3) * 5
  })

  return (
    <>
      {/* Lumière ambiante douce */}
      <ambientLight intensity={0.4} color="#FFF8DC" />

      {/* Lumière principale (Key light) avec ombres */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 5, 5]}
        intensity={1.2}
        color="#FFE4B5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />

      {/* Lumière de remplissage (Fill light) - bleue Ghibli */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={0.5}
        color="#87CEEB"
      />

      {/* Lumière arrière (Rim light) - chaude */}
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.8}
        color="#FF8C69"
      />

      {/* Lumière de dessous (Bounce light) */}
      <pointLight
        position={[0, -3, 2]}
        intensity={0.3}
        color="#4A7C59"
      />

      {/* Spot lumineux sur l'affiche */}
      <spotLight
        position={[0, 4, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="white"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  )
}

export default StudioLighting