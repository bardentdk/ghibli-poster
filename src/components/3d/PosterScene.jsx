import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Poster3D from './Poster3D'
import StudioLighting from './StudioLighting'
import MagicDust from './MagicDust'
import SceneBackground from './SceneBackground'

const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[2, 3, 0.05]} />
      <meshStandardMaterial color="#FFF8DC" />
    </mesh>
  )
}

const PosterScene = ({
  imageUrl,
  title,
  producers,
  description,
  format = 'A4',
  autoRotate = true,
  interactive = true,
}) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      className="rounded-2xl"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />

      <color attach="background" args={['#FFF8DC']} />
      <fog attach="fog" args={['#FFF8DC', 8, 20]} />

      <StudioLighting />
      <SceneBackground />

      <Suspense fallback={<LoadingFallback />}>
        <Poster3D
          imageUrl={imageUrl}
          title={title}
          producers={producers}
          description={description}
          format={format}
          autoRotate={autoRotate && !interactive}
        />

        <MagicDust count={100} />
      </Suspense>

      <ContactShadows
        position={[0, -3.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
        color="#283618"
      />

      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
      )}

      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette
          offset={0.3}
          darkness={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005]}
        />
      </EffectComposer>
    </Canvas>
  )
}

export default PosterScene