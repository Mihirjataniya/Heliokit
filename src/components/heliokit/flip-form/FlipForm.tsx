import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import './FlipForm.css'
// Internal context for flip control
const FlipFormContext = createContext<{
  isFlipped: boolean
  flipToFront: () => void
  flipToBack: () => void
  toggleFlip: () => void
}>({
  isFlipped: false,
  flipToFront: () => {},
  flipToBack: () => {},
  toggleFlip: () => {},
})

interface FlipFormProps {
  children: ReactNode
  initialSide?: "front" | "back"
  className?: string
  // New props for external control
  isFlipped?: boolean
  onFlipChange?: (isFlipped: boolean) => void
}

export const FlipForm = ({ 
  children, 
  initialSide = "front", 
  className,
  isFlipped: externalFlipped,
  onFlipChange 
}: FlipFormProps) => {
  const [internalFlipped, setInternalFlipped] = useState(initialSide === "back")
  
  // Use external control if provided, otherwise use internal state
  const isFlipped = externalFlipped !== undefined ? externalFlipped : internalFlipped
  
  const flipToFront = () => {
    if (externalFlipped !== undefined) {
      onFlipChange?.(false)
    } else {
      setInternalFlipped(false)
    }
  }
  
  const flipToBack = () => {
    if (externalFlipped !== undefined) {
      onFlipChange?.(true)
    } else {
      setInternalFlipped(true)
    }
  }
  
  const toggleFlip = () => {
    if (externalFlipped !== undefined) {
      onFlipChange?.(!externalFlipped)
    } else {
      setInternalFlipped(prev => !prev)
    }
  }

  const value = {
    isFlipped,
    flipToFront,
    flipToBack,
    toggleFlip,
  }

  return (
    <FlipFormContext.Provider value={value}>
        <div className={`w-full max-w-[460px] min-h-[600px] mx-auto my-16 px-4 sm:px-0 perspective-distant ${className || ""}`}>
          <div className={`flip-card relative w-full h-auto ${isFlipped ? "flipped" : ""}`}>
            {children}
          </div>
        </div>
    </FlipFormContext.Provider>
  )
}

export const FlipFormFront = ({ children }: { children: ReactNode }) => (
  <div className="flip-card-front absolute w-full h-auto">
    <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern"></div>
      </div>

      {/* Glowing orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl"></div>

      {children}
    </div>
  </div>
)

export const FlipFormBack = ({ children }: { children: ReactNode }) => (
  <div className="flip-card-back absolute w-full h-auto">
    <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern"></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>

      {children}
    </div>
  </div>
)

export const FlipFormForm = ({ children }: { children: ReactNode }) => (
  <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center">{children}</div>
)

export const FlipFormHeader = ({ 
  children, 
  icon,
  variant = "cyan" 
}: { 
  children: ReactNode
  icon?: ReactNode
  variant?: "cyan" | "purple"
}) => {
  const iconGradient = variant === "cyan" 
    ? "bg-gradient-to-r from-cyan-500 to-purple-500"
    : "bg-gradient-to-r from-purple-500 to-cyan-500"
  
  const shadowColor = variant === "cyan"
    ? "shadow-cyan-500/25"
    : "shadow-purple-500/25"

  return (
    <div className="text-center mb-8 sm:mb-10">
      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${iconGradient} rounded-2xl mb-4 sm:mb-6 shadow-lg ${shadowColor}`}>
        {icon || <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-white rounded-lg"></div>}
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
        {children}
      </h2>
    </div>
  )
}

export const FlipFormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  variant = "cyan"
}: {
  label: string
  type?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  variant?: "cyan" | "purple"
}) => {
  const focusRing = variant === "cyan" 
    ? "focus:ring-cyan-400/50"
    : "focus:ring-purple-400/50"
  
  const hoverGradient = variant === "cyan"
    ? "from-cyan-400/5 to-purple-400/5"
    : "from-purple-400/5 to-cyan-400/5"

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium text-slate-300 ml-1">{label}</label>
      <div className="relative group">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-slate-800/90 border border-slate-600/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent transition-all duration-300 shadow-inner shadow-slate-900/50 text-sm sm:text-base`}
          style={{
            boxShadow:
              "inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)",
          }}
          required
        />
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
      </div>
    </div>
  )
}

export const FlipFormButton = ({
  children,
  onClick,
  variant = "cyan",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "cyan" | "purple"
}) => {
  const styles =
    variant === "cyan"
      ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-cyan-500/25 hover:shadow-cyan-500/40 focus:ring-cyan-400/50"
      : "bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500 shadow-purple-500/25 hover:shadow-purple-500/40 focus:ring-purple-400/50"

  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 sm:py-4 sm:px-6 ${styles} text-white font-semibold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 text-sm sm:text-base`}
    >
      <span className="flex items-center justify-center space-x-2">
        <span>{children}</span>
      </span>
    </button>
  )
}

// Special FlipFormLink that automatically connects to the flip context
export const FlipFormLink = ({ 
  children, 
  onClick, 
  variant = "cyan",
  flipTo // New prop: 'front' | 'back' | custom function
}: { 
  children: ReactNode
  onClick?: () => void
  variant?: "cyan" | "purple"
  flipTo?: "front" | "back"
}) => {
  const { flipToFront, flipToBack } = useContext(FlipFormContext)
  
  const gradientColors = variant === "cyan"
    ? "from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300"
    : "from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300"

  const handleClick = () => {
    // Execute custom onClick first
    onClick?.()
    
    // Then handle flip
    if (flipTo === "front") {
      flipToFront()
    } else if (flipTo === "back") {
      flipToBack()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`text-transparent bg-gradient-to-r ${gradientColors} bg-clip-text font-semibold transition-all duration-300 hover:scale-105 inline-block text-sm sm:text-base`}
    >
      {children}
    </button>
  )
}

// Hook is still available for advanced users who need it
export const useFlipForm = () => useContext(FlipFormContext)
