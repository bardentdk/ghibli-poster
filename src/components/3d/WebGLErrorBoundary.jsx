import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur WebGL/3D:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ghibli-cream to-ghibli-sand rounded-2xl p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-display text-2xl text-ghibli-deep mb-2">
              Aperçu 3D indisponible
            </h3>
            <p className="text-ghibli-deep/70 text-sm mb-4">
              Votre navigateur ne supporte pas l'affichage 3D ou une erreur est survenue.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="btn-secondary"
            >
              Réessayer
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default WebGLErrorBoundary