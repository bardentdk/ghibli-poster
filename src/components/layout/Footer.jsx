import { Link } from 'react-router-dom'
import { ScissorsLineDashed, CircleFadingPlus, Bird, Mail, MapPin, Heart } from 'lucide-react'
import Logo from '../ui/Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Produit',
      links: [
        { label: 'Créer une affiche', to: '/create' },
        { label: 'Galerie', to: '/gallery' },
        { label: 'Tarifs', to: '/pricing' },
        { label: 'Comment ça marche', to: '/how-it-works' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Blog', to: '/blog' },
        { label: 'Presse', to: '/press' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'CGV', to: '/terms' },
        { label: 'Politique de confidentialité', to: '/privacy' },
        { label: 'Mentions légales', to: '/legal' },
        { label: 'Cookies', to: '/cookies' },
      ],
    },
  ]

  return (
    <footer className="relative mt-32 bg-gradient-to-b from-transparent via-ghibli-deep/5 to-ghibli-deep/20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ghibli-forest/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-ghibli-deep/70 leading-relaxed max-w-md">
              Transformez vos souvenirs en œuvres d'art uniques inspirées de l'univers magique
              Ghibli. Des affiches personnalisées pour sublimer votre intérieur.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-ghibli-deep/70">
                <Mail className="w-4 h-4 text-ghibli-forest" />
                <a href="mailto:hello@ghibliposter.com" className="hover:text-ghibli-forest transition-colors">
                  hello@ghibliposter.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-ghibli-deep/70">
                <MapPin className="w-4 h-4 text-ghibli-forest" />
                <span>Paris, France</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {[ScissorsLineDashed, CircleFadingPlus, Bird].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-ghibli-forest hover:text-white transition-all duration-300 hover:scale-110 text-ghibli-deep"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-display text-xl text-ghibli-deep">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-ghibli-deep/70 hover:text-ghibli-forest transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ghibli-deep/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ghibli-deep/60 text-sm">
            © {currentYear} Ghibli Poster Studio. Tous droits réservés.
          </p>
          <p className="text-ghibli-deep/60 text-sm flex items-center gap-2">
            Conçu avec <Heart className="w-4 h-4 text-ghibli-sunset fill-ghibli-sunset" /> en France
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer