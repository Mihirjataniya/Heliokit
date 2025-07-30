import React, { useState } from "react"

interface DockItem {
  id: string
  icon: React.ElementType
  label: string
  onClick?: () => void
}

interface GlossyDockProps {
  dockItems: DockItem[]
  activeId: string
  onSelect: (id: string) => void
  accentColor?: string
}

interface DockIconProps {
  icon: React.ElementType
  label: string
  isActive?: boolean
  onClick?: () => void
  accentColor?: string
}

// Helper function to convert hex to rgba with error handling
const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '')

  // Check if hex is valid (6 characters, all valid hex digits)
  if (!cleanHex || cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    console.warn(`Invalid hex color: ${hex}, using fallback`)
    // Fallback to lime green
    return `rgba(132, 204, 22, ${alpha})`
  }

  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)

  // Double check for NaN values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.warn(`Failed to parse RGB values from: ${hex}, using fallback`)
    return `rgba(132, 204, 22, ${alpha})`
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function DockIcon({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  accentColor = "#84cc16" // lime-500 equivalent
}: DockIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
  }
  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)

  return (
    <button
      className={`group relative flex flex-col items-center justify-center 
        w-12 h-12 md:w-16 md:h-16 
        rounded-2xl 
        transition-all duration-500 ease-out transform-gpu will-change-transform 
        hover:scale-125 active:scale-110 
        focus:outline-none backdrop-blur-sm 
        ${isActive ? "scale-110" : ""} 
        ${isHovered && !isActive ? "scale-115" : ""} 
        ${isPressed ? "scale-105" : ""}`}
      style={{
        '--focus-color': hexToRgba(accentColor, 0.5)
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      onFocus={(e) => {
        e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(accentColor, 0.5)}`
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = 'none'
      }}
      aria-label={label}
    >
      {/* Active glow background - always render with conditional styles */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          background: isActive
            ? `linear-gradient(to top, ${hexToRgba(accentColor, 0.2)}, ${hexToRgba(accentColor, 0.1)})`
            : 'transparent',
          animation: isActive ? 'pulse 2s infinite' : 'none',
          pointerEvents: 'none'
        }}
      />

      {/* Hover glow effect - always render with conditional styles */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300 bg-gradient-to-t from-white/5 to-transparent"
        style={{
          boxShadow: isActive
            ? `inset 0 1px 0 0 ${hexToRgba(accentColor, 0.3)}`
            : isHovered
              ? 'inset 0 1px 0 0 rgba(255,255,255,0.2)'
              : 'none',
          pointerEvents: 'none'
        }}
      />

      {/* Ripple effect on click */}
      {isPressed && <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping" />}


      <div className="relative z-10">
        <Icon
          className={`w-5 h-5 md:w-7 md:h-7 
            transition-all duration-300 stroke-gray-400 group-hover:stroke-white 
            transform-gpu will-change-transform cursor-pointer
            ${isHovered && !isActive ? "stroke-white" : ""}
            ${isPressed ? "scale-90" : ""}`}
          style={isActive ? {
            stroke: accentColor,
            filter: `drop-shadow(0 0 12px ${hexToRgba(accentColor, 0.6)})`
          } : isHovered && !isActive ? {
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
          } : {}}
          strokeWidth={isActive ? 2 : 1.5}
        />
      </div>

      {/* Active light indicator */}
      <div
        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-500 ease-out ${isActive ? "w-8 opacity-100" : "w-0 opacity-0"
          }`}
        style={isActive ? {
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${hexToRgba(accentColor, 0.8)}`
        } : {}}
      />

      {/* Hover underline */}
      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/80 rounded-full transition-all duration-300 ${!isActive && isHovered ? "w-6 opacity-100" : "w-0 opacity-0"
        }`} />

      {/* Enhanced tooltip */}
      <div
        className={`absolute -top-12 left-1/2 transform -translate-x-1/2 
          px-3 py-1.5 
          bg-black/90 backdrop-blur-md rounded-lg 
          text-xs text-white font-medium whitespace-nowrap 
          border border-white/10 opacity-0 scale-90 translate-y-2 
          transition-all duration-300 pointer-events-none z-50 
          ${isHovered || isActive ? "opacity-100 scale-100 translate-y-0" : ""}`}
      >
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90" />
      </div>

      {/* Ambient glow for active state */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl blur-xl scale-150 animate-pulse"
          style={{ backgroundColor: hexToRgba(accentColor, 0.05) }}
        />
      )}
    </button>
  )
}

export function GlossyDock({
  dockItems = [],
  activeId,
  onSelect,
  accentColor = "#84cc16"
}: GlossyDockProps) {
  const [dockHovered, setDockHovered] = useState(false)

  const dockGlowStyle = dockHovered ? {
    background: `linear-gradient(to top, ${hexToRgba(accentColor, 0.05)}, rgba(255,255,255,0.05), rgba(255,255,255,0.1))`
  } : {}

  return (
    <div className="bg-black flex items-end justify-center p-4">
      {/* Dock Container */}
      <div
        className="relative mb-8"
        onMouseEnter={() => setDockHovered(true)}
        onMouseLeave={() => setDockHovered(false)}
      >
        {/* Enhanced Dock Background */}
        <div className={`relative flex items-center 
          gap-2 md:gap-3 
          px-4 py-3 md:px-6 md:py-4 
          bg-black/60 backdrop-blur-2xl border border-white/20 
          rounded-3xl md:rounded-[2rem] 
          shadow-[0_16px_64px_rgba(0,0,0,0.6)] 
          transition-all duration-500 ease-out 
          before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/10 before:via-white/5 before:to-transparent 
          before:rounded-3xl md:before:rounded-[2rem] before:pointer-events-none 
          ${dockHovered ? "scale-105 shadow-[0_20px_80px_rgba(0,0,0,0.8)]" : ""}`}>

          {/* Subtle inner border with dynamic accent */}
          <div
            className="absolute inset-0.5 rounded-3xl md:rounded-[2rem] pointer-events-none transition-all duration-500 bg-gradient-to-t from-transparent via-white/5 to-white/10"
            style={dockGlowStyle}
          />

          {/* Icons Container */}
          <div className="relative flex items-center gap-2 md:gap-3">
            {dockItems.map((item, index) => (
              <div
                key={item.id}
                className="transform transition-all duration-300 ease-out"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <DockIcon
                  icon={item.icon}
                  label={item.label}
                  isActive={activeId === item.id}
                  onClick={() => {
                    onSelect(item.id)
                    item.onClick?.()
                  }}
                  accentColor={accentColor}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Dock Shadow with dynamic accent */}
        <div className={`absolute inset-0 blur-2xl rounded-3xl md:rounded-[2rem] -z-10 scale-110 transition-all duration-500 bg-black/40 ${dockHovered ? "bg-black/60 scale-115" : ""
          }`} />

        {/* Ambient glow for active element */}
        <div
          className={`absolute inset-0 blur-3xl rounded-3xl md:rounded-[2rem] -z-20 scale-150 transition-all duration-1000 ${activeId ? "opacity-100" : "opacity-0"
            }`}
          style={{ backgroundColor: hexToRgba(accentColor, 0.05) }}
        />
      </div>

      {/* Enhanced Background Grid Pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient particles effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
