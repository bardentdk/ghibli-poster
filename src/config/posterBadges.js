/**
 * Configuration des badges, ratings et logos disponibles
 */

export const RATINGS = [
  { value: 'none', label: 'Aucun', age: null },
  { value: '3+', label: '3+', age: 3, color: '#4A7C59' },
  { value: '7+', label: '7+', age: 7, color: '#87CEEB' },
  { value: '12+', label: '12+', age: 12, color: '#FFA500' },
  { value: '16+', label: '16+', age: 16, color: '#FF6347' },
  { value: '18+', label: '18+', age: 18, color: '#6B46C1' },
]

export const AUDIO_BADGES = [
  { value: 'none', label: 'Aucun' },
  { value: 'dolby_atmos', label: 'Dolby Atmos' },
  { value: 'dolby_digital', label: 'Dolby Digital' },
  { value: 'dts_x', label: 'DTS:X' },
  { value: 'imax', label: 'IMAX' },
]

export const STUDIO_LOGOS = [
  { value: 'none', label: 'Aucun' },
  { value: 'wb', label: 'Warner Bros' },
  { value: 'universal', label: 'Universal' },
  { value: 'paramount', label: 'Paramount' },
  { value: 'sony', label: 'Sony Pictures' },
  { value: 'disney', label: 'Disney' },
  { value: 'netflix', label: 'Netflix' },
]

export const ACCENT_COLORS = [
  { value: '#E74C3C', label: 'Rouge passion' },
  { value: '#F39C12', label: 'Orange ambre' },
  { value: '#F1C40F', label: 'Jaune soleil' },
  { value: '#2ECC71', label: 'Vert forêt' },
  { value: '#3498DB', label: 'Bleu océan' },
  { value: '#9B59B6', label: 'Violet mystique' },
  { value: '#E91E63', label: 'Rose magenta' },
  { value: '#FFFFFF', label: 'Blanc pur' },
]

export const TITLE_FONTS = [
  { value: 'condensed', label: 'Condensé (Bold)', fontFamily: '"Oswald", sans-serif' },
  { value: 'elegant', label: 'Élégant (Serif)', fontFamily: '"Playfair Display", serif' },
  { value: 'display', label: 'Display', fontFamily: '"Bebas Neue", sans-serif' },
  { value: 'handwritten', label: 'Manuscrit', fontFamily: '"Caveat", cursive' },
]