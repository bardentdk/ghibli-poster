/**
 * Patterns SVG réutilisables pour les factures
 */
export const getPattern = (type, color, opacity = 0.05) => {
  const patterns = {
    none: '',
    
    dots: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="1.5" fill="${color}" opacity="${opacity}"/>
      </svg>
    `,
    
    grid: `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </svg>
    `,
    
    lines: `
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
        <path d="M0,10 L10,0" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </svg>
    `,
    
    waves: `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="20" viewBox="0 0 100 20">
        <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="${color}" stroke-width="1.5" opacity="${opacity}"/>
      </svg>
    `,
    
    triangles: `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
        <polygon points="15,3 27,27 3,27" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </svg>
    `,
    
    hexagons: `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="46" viewBox="0 0 40 46">
        <polygon points="20,2 37,12 37,34 20,44 3,34 3,12" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </svg>
    `,
    
    circles: `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="10" fill="none" stroke="${color}" stroke-width="0.8" opacity="${opacity}"/>
      </svg>
    `,
  }

  const pattern = patterns[type] || patterns.none
  if (!pattern) return ''
  
  const encoded = encodeURIComponent(pattern.trim())
  return `url("data:image/svg+xml;utf8,${encoded}")`
}

export const PATTERN_OPTIONS = [
  { value: 'none', label: 'Aucun' },
  { value: 'dots', label: 'Points' },
  { value: 'grid', label: 'Grille' },
  { value: 'lines', label: 'Lignes' },
  { value: 'waves', label: 'Vagues' },
  { value: 'triangles', label: 'Triangles' },
  { value: 'hexagons', label: 'Hexagones' },
  { value: 'circles', label: 'Cercles' },
]