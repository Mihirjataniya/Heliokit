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

function DockIcon({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  accentColor = "lime"
}: DockIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const activeGlow = `from-${accentColor}-500/20 to-${accentColor}-400/10`
  const strokeActive = `stroke-${accentColor}-400 drop-shadow-[0_0_12px_rgba(163,230,53,0.6)]`
  const borderActive = `border-${accentColor}-400/30`
  const glow = `bg-${accentColor}-400/5`
  const indicator = `bg-${accentColor}-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]`

  return (
    <button
      className={`group relative flex flex-col items-center justify-center 
        w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18
        rounded-xl xs:rounded-xl sm:rounded-2xl
        transition-all duration-500 ease-out transform-gpu will-change-transform 
        hover:scale-125 active:scale-110 
        focus:outline-none focus:ring-2 focus:ring-${accentColor}-400/50 backdrop-blur-sm 
        ${isActive ? "scale-110" : ""} 
        ${isHovered && !isActive ? "scale-115" : ""} 
        ${isPressed ? "scale-105" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      aria-label={label}
    >
      {isActive && <div className={`absolute inset-0 rounded-xl xs:rounded-xl sm:rounded-2xl bg-gradient-to-t ${activeGlow} animate-pulse`} />}
      <div className={`absolute inset-0 rounded-xl xs:rounded-xl sm:rounded-2xl transition-all duration-300 bg-gradient-to-t from-white/5 to-transparent ${isHovered ? "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" : ""} ${isActive ? "shadow-[inset_0_1px_0_0_rgba(163,230,53,0.3)]" : ""}`} />
      {isPressed && <div className="absolute inset-0 rounded-xl xs:rounded-xl sm:rounded-2xl bg-white/10 animate-ping" />}
      <div className="relative z-10">
        <Icon
          className={`w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8
            cursor-pointer transition-all duration-300 stroke-gray-400 group-hover:stroke-white transform-gpu will-change-transform 
            ${isActive ? strokeActive : ""} 
            ${isHovered && !isActive ? "stroke-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""} 
            ${isPressed ? "scale-90" : ""}`}
          strokeWidth={isActive ? 2 : 1.5}
        />
      </div>
      <div className={`absolute -bottom-1.5 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 sm:h-1 ${indicator} rounded-full transition-all duration-500 ease-out ${isActive ? "w-6 sm:w-8 opacity-100" : "w-0 opacity-0"}`} />
      <div className={`absolute -bottom-1.5 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/80 rounded-full transition-all duration-300 ${!isActive && isHovered ? "w-4 sm:w-6 opacity-100" : "w-0 opacity-0"}`} />
      <div className={`absolute -top-10 xs:-top-11 sm:-top-12 left-1/2 transform -translate-x-1/2 
        px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5 
        bg-black/90 backdrop-blur-md rounded-md sm:rounded-lg 
        text-xs xs:text-xs sm:text-xs text-white font-medium whitespace-nowrap 
        border border-white/10 opacity-0 scale-90 translate-y-2 
        transition-all duration-300 pointer-events-none z-50 
        ${isHovered || isActive ? "opacity-100 scale-100 translate-y-0" : ""} 
        ${isActive ? borderActive + " shadow-[0_0_8px_rgba(163,230,53,0.2)]" : ""}`}>
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90" />
      </div>
      {isActive && <div className={`absolute inset-0 rounded-xl xs:rounded-xl sm:rounded-2xl ${glow} blur-xl scale-150 animate-pulse`} />}
    </button>
  )
}

export function GlossyDock({
  dockItems = [],
  activeId,
  onSelect,
  accentColor = "lime"
}: GlossyDockProps) {
  const [dockHovered, setDockHovered] = useState(false)


  return (
    <div className="bg-black flex items-center justify-center  p-2 xs:p-3 sm:p-4">
      <div className="relative mb-4 xs:mb-6 sm:mb-8" onMouseEnter={() => setDockHovered(true)} onMouseLeave={() => setDockHovered(false)}>
        <div className={`relative z-10 flex items-center 
          gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 
          px-3 py-2 xs:px-3.5 xs:py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 
          bg-black/60 backdrop-blur-2xl border border-white/20 
          rounded-2xl xs:rounded-2xl sm:rounded-3xl md:rounded-[2rem] 
          shadow-[0_8px_32px_rgba(0,0,0,0.6)] xs:shadow-[0_12px_48px_rgba(0,0,0,0.6)] sm:shadow-[0_16px_64px_rgba(0,0,0,0.6)] 
          transition-all duration-500 ease-out 
          before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/10 before:via-white/5 before:to-transparent 
          before:rounded-2xl xs:before:rounded-2xl sm:before:rounded-3xl md:before:rounded-[2rem] before:pointer-events-none 
          ${dockHovered ? "scale-105 shadow-[0_12px_48px_rgba(0,0,0,0.8)] xs:shadow-[0_16px_64px_rgba(0,0,0,0.8)] sm:shadow-[0_20px_80px_rgba(0,0,0,0.8)]" : ""}`}>
          <div className={`absolute inset-0.5 rounded-2xl xs:rounded-2xl sm:rounded-3xl md:rounded-[2rem] pointer-events-none transition-all duration-500 bg-gradient-to-t from-transparent via-white/5 to-white/10 ${dockHovered ? `from-${accentColor}-500/5` : ""}`} />
          <div className="relative flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3">
            {dockItems.map((item, index) => (
              <div key={item.id} style={{ transitionDelay: `${index * 50}ms` }}>
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
      </div>
    </div>
  )
}