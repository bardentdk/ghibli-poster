import { useState, useEffect } from 'react'

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    supportsWebGL: true,
    isLowEnd: false,
    isMobile: false,
    isChecking: true,
  })

  useEffect(() => {
    const checkCapabilities = () => {
      // Détection mobile
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

      // Test WebGL
      let supportsWebGL = false
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        supportsWebGL = !!gl
      } catch (e) {
        supportsWebGL = false
      }

      // Détection appareil bas de gamme
      const memory = navigator.deviceMemory || 4
      const cores = navigator.hardwareConcurrency || 4
      const isLowEnd = memory < 4 || cores < 4

      setCapabilities({
        supportsWebGL,
        isLowEnd,
        isMobile,
        isChecking: false,
      })
    }

    checkCapabilities()
  }, [])

  return capabilities
}