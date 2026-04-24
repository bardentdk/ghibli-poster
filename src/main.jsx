import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 248, 220, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#283618',
            border: '1px solid rgba(74, 124, 89, 0.2)',
            borderRadius: '16px',
            padding: '16px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#4A7C59',
              secondary: '#FFF8DC',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#FFF8DC',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)