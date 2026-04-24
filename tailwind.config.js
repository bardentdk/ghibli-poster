/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ghibli: {
          sky: '#87CEEB',
          forest: '#4A7C59',
          sunset: '#FF8C69',
          cream: '#FFF8DC',
          earth: '#8B7355',
          moss: '#606C38',
          sand: '#F4E4BC',
          deep: '#283618',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        display: ['"Caveat"', 'cursive'],
        body: ['"Quicksand"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-ghibli': 'linear-gradient(135deg, #87CEEB 0%, #FF8C69 50%, #4A7C59 100%)',
        'gradient-sunset': 'linear-gradient(to bottom, #FF8C69, #FFD700, #87CEEB)',
        'gradient-forest': 'linear-gradient(to bottom, #4A7C59, #606C38, #283618)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(135, 206, 235, 0.5)',
        'glow-lg': '0 0 40px rgba(135, 206, 235, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
}