import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingClouds from '../effects/FloatingClouds'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

const Layout = () => {
  useSmoothScroll()

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <FloatingClouds />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout