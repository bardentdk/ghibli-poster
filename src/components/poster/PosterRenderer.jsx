import { useRef, useEffect, useState } from 'react'
import BadgeRating from './BadgeRating'
import BadgeAudio from './BadgeAudio'
import ParentalAdvisory from './ParentalAdvisory'
import StudioLogo from './StudioLogo'
import { RATINGS } from '../../config/posterBadges'

/**
 * Composant qui rend l'affiche au format film
 * Le scale permet d'afficher à différentes tailles tout en gardant les proportions
 */
const PosterRenderer = ({
  imageUrl,
  title,
  tagline,
  directors, // "From the directory of..."
  releaseDate,
  credits,
  designConfig = {},
  scale = 1,
  className = '',
  withWatermark = true,
  logoUrl = '/assets/logo.png',
}) => {
  const {
    titleFont = 'condensed',
    accentColor = '#E74C3C',
    rating = 'none',
    audioBadge = 'none',
    studioLogo = 'none',
    showParentalAdvisory = false,
    showDateVertical = true,
  } = designConfig

  // Dimensions de référence (A3 ratio, 1414 × 2000 en référence)
  const BASE_WIDTH = 1414
  const BASE_HEIGHT = 2000

  const width = BASE_WIDTH * scale
  const height = BASE_HEIGHT * scale

  // Parse directors pour extraire les 2 noms (séparés par & ou et ou ,)
  const directorsParts = directors
    ? directors.split(/\s*&\s*|\s+et\s+|\s*,\s*/).filter(Boolean).slice(0, 2)
    : []

  const fontMap = {
    condensed: '"Oswald", sans-serif',
    elegant: '"Playfair Display", serif',
    display: '"Bebas Neue", sans-serif',
    handwritten: '"Caveat", cursive',
  }

  const titleFontFamily = fontMap[titleFont] || fontMap.condensed

  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}`,
      }}
    >
      {/* Image de fond */}
      {imageUrl && (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt="Affiche"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Dégradé noir en bas */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Dégradé en haut pour le "From the directory of" */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* FILIGRANE ANTI-VOL (diagonale répétée) */}
      {withWatermark && (
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.15] z-20"
                style={{
                backgroundImage: `url(${logoUrl})`,
                backgroundSize: `${150 * scale}px`,
                backgroundRepeat: 'repeat',
                filter: 'grayscale(100%) brightness(1.5)',
                transform: 'rotate(-30deg) scale(1.5)',
                transformOrigin: 'center',
                mixBlendMode: 'screen',
                }}
            />
        )}

      {/* CONTENU SUPERPOSÉ (au-dessus du filigrane) */}
      <div className="relative z-30 w-full h-full flex flex-col">
        {/* HEADER : From the directory of... */}
        {directorsParts.length > 0 && (
          <div
            className="flex justify-center items-start"
            style={{
              paddingTop: `${40 * scale}px`,
              paddingLeft: `${60 * scale}px`,
              paddingRight: `${60 * scale}px`,
            }}
          >
            <div
              className="text-white uppercase tracking-[0.25em] font-bold text-center"
              style={{ fontSize: `${22 * scale}px` }}
            >
              <span className="opacity-90">From the directory of </span>
              {directorsParts.map((name, i) => (
                <span key={i}>
                  <span style={{ color: accentColor }}>{name.trim()}</span>
                  {i < directorsParts.length - 1 && (
                    <span className="opacity-90"> & </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TITRE PRINCIPAL */}
        {title && (
          <div
            className="flex justify-center"
            style={{
              marginTop: directorsParts.length > 0 ? `${30 * scale}px` : `${80 * scale}px`,
              paddingLeft: `${60 * scale}px`,
              paddingRight: `${60 * scale}px`,
            }}
          >
            <h1
              className="text-white text-center leading-[0.9]"
              style={{
                fontFamily: titleFontFamily,
                fontSize: `${180 * scale}px`,
                fontWeight: titleFont === 'condensed' || titleFont === 'display' ? 700 : 400,
                textShadow: `0 ${4 * scale}px ${20 * scale}px rgba(0,0,0,0.6)`,
                letterSpacing: titleFont === 'condensed' ? '-0.02em' : '0',
              }}
            >
              {title}
            </h1>
          </div>
        )}

        {/* TAGLINE */}
        {tagline && (
          <div
            className="flex justify-center"
            style={{
              marginTop: `${20 * scale}px`,
              paddingLeft: `${60 * scale}px`,
              paddingRight: `${60 * scale}px`,
            }}
          >
            <p
              className="text-white/90 uppercase tracking-[0.15em] font-semibold text-center italic"
              style={{ fontSize: `${28 * scale}px` }}
            >
              {tagline}
            </p>
          </div>
        )}

        {/* ESPACE FLEX POUR POUSSER LE BAS */}
        <div className="flex-1" />

        {/* DATE VERTICALE À GAUCHE */}
        {showDateVertical && releaseDate && (
          <div
            className="absolute left-0 flex items-center"
            style={{
              bottom: `${400 * scale}px`,
              paddingLeft: `${30 * scale}px`,
            }}
          >
            <div
              className="text-white font-black uppercase tracking-[0.15em] whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontSize: `${36 * scale}px`,
                fontFamily: '"Oswald", sans-serif',
              }}
            >
              {releaseDate}
            </div>
          </div>
        )}

        {/* BADGE RATING À DROITE */}
        {rating !== 'none' && (
          <div
            className="absolute right-0"
            style={{
              bottom: `${380 * scale}px`,
              paddingRight: `${60 * scale}px`,
            }}
          >
            <div style={{ transform: `scale(${scale * 1.5})`, transformOrigin: 'bottom right' }}>
              <BadgeRating rating={rating} size="lg" />
            </div>
          </div>
        )}

        {/* FOOTER : Crédits + Badges */}
        <div
          className="relative"
          style={{
            paddingLeft: `${60 * scale}px`,
            paddingRight: `${60 * scale}px`,
            paddingBottom: `${60 * scale}px`,
          }}
        >
          {/* Crédits texte */}
          {credits && (
            <div
              className="text-white/85 uppercase leading-relaxed mb-6"
              style={{
                fontSize: `${20 * scale}px`,
                letterSpacing: '0.02em',
                fontFamily: '"Oswald", sans-serif',
                fontWeight: 300,
              }}
            >
              {credits}
            </div>
          )}

          {/* Ligne basse : Parental + Audio + Studio */}
          <div
            className="flex items-end justify-between"
            style={{ gap: `${20 * scale}px` }}
          >
            {/* Gauche : Parental Advisory */}
            <div style={{ transform: `scale(${scale * 1.3})`, transformOrigin: 'bottom left' }}>
              {showParentalAdvisory && <ParentalAdvisory size="md" />}
            </div>

            {/* Centre : Audio Badge */}
            <div
              className="flex-1 flex justify-center"
              style={{ transform: `scale(${scale * 1.5})`, transformOrigin: 'bottom center' }}
            >
              {audioBadge !== 'none' && <BadgeAudio badge={audioBadge} size="lg" />}
            </div>

            {/* Droite : Studio Logo */}
            <div style={{ transform: `scale(${scale * 1.3})`, transformOrigin: 'bottom right' }}>
              {studioLogo !== 'none' && <StudioLogo logo={studioLogo} size="md" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PosterRenderer