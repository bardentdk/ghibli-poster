import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { usePosterTexture } from '../../hooks/usePosterTexture'
import * as THREE from 'three'

// Dimensions réelles en cm converties en unités Three.js
const FORMAT_DIMENSIONS = {
  A4: { width: 2.1, height: 2.97 },
  A3: { width: 2.97, height: 4.2 },
  A2: { width: 4.2, height: 5.94 },
}

// Facteur d'échelle pour la scène
const SCALE = 1

const Poster3D = ({
  imageUrl,
  title,
  producers,
  description,
  format = 'A4',
  autoRotate = true,
}) => {
  const meshRef = useRef(null)
  const groupRef = useRef(null)

  const texture = usePosterTexture({
    imageUrl,
    title,
    producers,
    description,
  })

  const dimensions = FORMAT_DIMENSIONS[format]
  const width = dimensions.width * SCALE
  const height = dimensions.height * SCALE
  const depth = 0.03

  // Animation de flottement douce
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    
    if (autoRotate) {
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.2
    }
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05
  })

  // Matériaux pour les différentes faces du mesh
  const materials = useMemo(() => {
    if (!texture) return null

    // Matériau principal (recto avec l'image)
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.05,
    })

    // Matériau du dos (papier beige)
    const backMaterial = new THREE.MeshStandardMaterial({
      color: '#F4E4BC',
      roughness: 0.9,
      metalness: 0,
    })

    // Matériau des tranches
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: '#FFF8DC',
      roughness: 0.8,
      metalness: 0,
    })

    // Order: [right, left, top, bottom, front, back]
    return [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ]
  }, [texture])

  if (!texture || !materials) {
    return null
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        material={materials}
      >
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Légère ombre portée au sol */}
      <mesh
        position={[0, -height / 2 - 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width * 1.5, height * 1.5]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  )
}

export default Poster3D