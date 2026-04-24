import { modernTemplate } from './modern.js'
import { classicTemplate } from './classic.js'
import { minimalTemplate } from './minimal.js'
import { creativeTemplate } from './creative.js'

export const TEMPLATES = {
  modern: {
    name: 'Moderne',
    description: 'Design épuré avec accents colorés et cartes',
    render: modernTemplate,
  },
  classic: {
    name: 'Classique',
    description: 'Présentation professionnelle traditionnelle',
    render: classicTemplate,
  },
  minimal: {
    name: 'Minimaliste',
    description: 'Simplicité et élégance, focus sur le contenu',
    render: minimalTemplate,
  },
  creative: {
    name: 'Créatif',
    description: 'Design audacieux avec dégradés et géométrie',
    render: creativeTemplate,
  },
}

export const getTemplate = (slug) => {
  return TEMPLATES[slug] || TEMPLATES.modern
}

export const getTemplateList = () => {
  return Object.entries(TEMPLATES).map(([slug, template]) => ({
    slug,
    name: template.name,
    description: template.description,
  }))
}