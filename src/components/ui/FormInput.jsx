import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

const FormInput = forwardRef(({
  label,
  icon: Icon,
  type = 'text',
  error,
  success,
  helper,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

  const isPassword = type === 'password'
  const actualType = isPassword && showPassword ? 'text' : type

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0)
    if (props.onChange) props.onChange(e)
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          error
            ? 'ring-2 ring-red-400'
            : isFocused
            ? 'ring-2 ring-ghibli-forest shadow-lg shadow-ghibli-forest/20'
            : 'ring-1 ring-ghibli-deep/10'
        }`}
      >
        <div className="relative bg-white/90 backdrop-blur-sm">
          {Icon && (
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                error
                  ? 'text-red-500'
                  : isFocused
                  ? 'text-ghibli-forest'
                  : 'text-ghibli-deep/40'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
          )}

          {label && (
            <motion.label
              animate={{
                top: isFocused || hasValue ? '0.5rem' : '50%',
                fontSize: isFocused || hasValue ? '0.7rem' : '0.95rem',
                y: isFocused || hasValue ? 0 : '-50%',
              }}
              transition={{ duration: 0.2 }}
              className={`absolute left-12 pointer-events-none font-semibold transition-colors ${
                error
                  ? 'text-red-500'
                  : isFocused
                  ? 'text-ghibli-forest'
                  : 'text-ghibli-deep/60'
              }`}
            >
              {label}
            </motion.label>
          )}

          <input
            ref={ref}
            type={actualType}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              if (props.onBlur) props.onBlur(e)
            }}
            onChange={handleChange}
            className={`w-full bg-transparent py-5 pl-12 pr-12 text-ghibli-deep font-medium outline-none ${
              label ? 'pt-7 pb-3' : 'py-5'
            }`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ghibli-deep/40 hover:text-ghibli-forest transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {success && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ghibli-forest flex items-center justify-center"
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="flex items-center gap-1.5 mt-2 ml-2"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="text-xs text-red-500 font-medium">{error}</span>
          </motion.div>
        ) : helper ? (
          <motion.div
            key="helper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 ml-2"
          >
            <span className="text-xs text-ghibli-deep/50">{helper}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput