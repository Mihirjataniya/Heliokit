import React, { createContext, useContext, useState } from 'react'

type SocialType = 'instagram' | 'twitter' | 'facebook' | 'whatsapp' | 'discord' | 'github' | 'telegram' | 'reddit' | null

const SocialGridContext = createContext<{
  isHovered: boolean
  hoveredIcon: SocialType
  setHoveredIcon: (icon: SocialType) => void
}>({
  isHovered: false,
  hoveredIcon: null,
  setHoveredIcon: () => {}
})

interface SocialGridProps {
  children: React.ReactNode
  className?: string
}

export const SocialGrid = ({ children, className }: SocialGridProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState<SocialType>(null)

  return (
    <SocialGridContext.Provider value={{ isHovered, hoveredIcon, setHoveredIcon }}>
      <div
        className={`relative ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient */}
        <div
          className="absolute w-44 h-44 rounded-[10px] transform rotate-90 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] shadow-[inset_0px_0px_180px_5px_#1f2937] z-[-2] transition-opacity duration-400"
          style={{ opacity: isHovered ? 0 : 1 }}
        />
        
        {/* Grid container */}
        <div className="flex flex-wrap w-56 items-center justify-center z-[-1]">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, { isHovered })
            }
            return child
          })}
        </div>

        {/* Center text overlay */}
        <SocialGridOverlay />
      </div>
    </SocialGridContext.Provider>
  )
}

interface SocialIconProps {
  children: React.ReactNode
  value: SocialType
  cornerPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none'
  backgroundColor: string
  iconColor?: string
  hoverIconColor?: string
  isHovered?: boolean
}

export const SocialIcon = ({ 
  children, 
  value, 
  cornerPosition = 'none', 
  backgroundColor,
  iconColor = '#ffffff',
  hoverIconColor = '#ffffff',
  isHovered 
}: SocialIconProps) => {
  const { hoveredIcon, setHoveredIcon } = useContext(SocialGridContext)
  const isActive = hoveredIcon === value

  const getCornerRadius = () => {
    switch (cornerPosition) {
      case 'top-left': return 'rounded-tl-[10px]'
      case 'top-right': return 'rounded-tr-[10px]'
      case 'bottom-left': return 'rounded-bl-[10px]'
      case 'bottom-right': return 'rounded-br-[10px]'
      default: return ''
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center w-[60px] h-[60px] ${getCornerRadius()} cursor-pointer backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-400 ease-in-out overflow-hidden`}
      style={{
        margin: isHovered ? '0.2em' : '0',
        borderRadius: isHovered ? '10px' : undefined
      }}
      onMouseEnter={() => {
        if (isHovered) setHoveredIcon(value)
      }}
      onMouseLeave={() => {
        if (isHovered) setHoveredIcon(null)
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 rounded-[inherit] transition-all duration-300 ease-in-out"
        style={{ 
          background: backgroundColor,
          opacity: isHovered && isActive ? 1 : 0,
          transform: isActive ? 'scale(1)' : 'scale(0.8)'
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 transition-all duration-300 ease-in-out"
        style={{ 
          opacity: isHovered ? 1 : 0,
          transform: isActive ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === 'svg') {
            const childProps = child.props as any
            return React.cloneElement(child as React.ReactElement<any>, {
              className: `${childProps.className || ''} transition-all duration-300 ease-in-out drop-shadow-lg`,
              fill: isActive ? hoverIconColor : iconColor,
              style: {
                ...childProps.style,
                fill: isActive ? hoverIconColor : iconColor,
                filter: isActive ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none'
              }
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

export const SocialSpacer = () => {
  const { isHovered } = useContext(SocialGridContext)

  return (
    <div
      className="relative flex items-center justify-center w-[60px] h-[60px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-400 ease-in-out"
      style={{
        margin: isHovered ? '0.2em' : '0',
        borderRadius: isHovered ? '10px' : undefined
      }}
    />
  )
}

const SocialGridOverlay = () => {
  const { isHovered } = useContext(SocialGridContext)

  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center text-gray-300 text-shadow-black text-[0.7em] font-bold tracking-[0.33em] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-opacity duration-300 ease-in-out"
      style={{ opacity: isHovered ? 0 : 1 }}
    >
      <span className="animate-pulse">HOVER</span>
      <span className="animate-pulse delay-100">FOR</span>
      <span className="animate-pulse delay-200">SOCIALS</span>
    </div>
  )
}

// Pre-built social icons with better contrast
export const InstagramIcon = () => (
  <svg
    fillRule="nonzero"
    height="36px"
    width="36px"
    fill='#ffffff'
    viewBox="0,0,256,256"
  >
    <g transform="scale(8,8)">
      <path
        d="M11.46875,5c-3.55078,0 -6.46875,2.91406 -6.46875,6.46875v9.0625c0,3.55078 2.91406,6.46875 6.46875,6.46875h9.0625c3.55078,0 6.46875,-2.91406 6.46875,-6.46875v-9.0625c0,-3.55078 -2.91406,-6.46875 -6.46875,-6.46875zM11.46875,7h9.0625c2.47266,0 4.46875,1.99609 4.46875,4.46875v9.0625c0,2.47266 -1.99609,4.46875 -4.46875,4.46875h-9.0625c-2.47266,0 -4.46875,-1.99609 -4.46875,-4.46875v-9.0625c0,-2.47266 1.99609,-4.46875 4.46875,-4.46875zM21.90625,9.1875c-0.50391,0 -0.90625,0.40234 -0.90625,0.90625c0,0.50391 0.40234,0.90625 0.90625,0.90625c0.50391,0 0.90625,-0.40234 0.90625,-0.90625c0,-0.50391 -0.40234,-0.90625 -0.90625,-0.90625zM16,10c-3.30078,0 -6,2.69922 -6,6c0,3.30078 2.69922,6 6,6c3.30078,0 6,-2.69922 6,-6c0,-3.30078 -2.69922,-6 -6,-6zM16,12c2.22266,0 4,1.77734 4,4c0,2.22266 -1.77734,4 -4,4c-2.22266,0 -4,-1.77734 -4,-4c0,-2.22266 1.77734,-4 4,-4z"
      />
    </g>
  </svg>
)

export const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1227"
    height="24px"
    width="24px"
    fill='#ffffff'
  >
    <path d="M714.163 519.284 1160.89 0H1058.9L667.137 450.887 356.873 0H0l468.891 681.821L0 1226.37h101.986l407.28-477.733L843.127 1226.37H1200L714.137 519.284h.026Zm-144.371 168.9-47.249-67.146L137.96 79.52h162.21l303.947 432.264 47.249 67.146 398.223 566.28h-162.21L569.792 688.184Z" />
  </svg>
)

export const FacebookIcon = () => (
  <svg height="30px" width="30px" viewBox="0 0 24 24" fill='#ffffff'>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export const WhatsAppIcon = () => (
  <svg height="26px" width="26px" viewBox="0 0 24 24" fill='#ffffff'>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
)

export const DiscordIcon = () => (
  <svg viewBox="0 0 48 48" width="30px" height="30px" fill='#ffffff'>
    <path d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z" />
  </svg>
)

export const GitHubIcon = () => (
  <svg height="30px" width="30px" viewBox="0 0 30 30" fill='#ffffff' >
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
  </svg>
)

export const TelegramIcon = () => (
  <svg height="38px" width="38px" viewBox="0 0 48 48">
    <path 
      d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"
      fill="#ffffff"
    />
    <path
      d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"
      fill="#b0bec5"
    />
    <path
      d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"
      fill="#cfd8dc"
    />
  </svg>
)

export const RedditIcon = () => (
  <svg viewBox="0 0 256 256" height="38" width="38">
    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
      <path
        d="M 75.011 45 c -0.134 -3.624 -3.177 -6.454 -6.812 -6.331 c -1.611 0.056 -3.143 0.716 -4.306 1.823 c -5.123 -3.49 -11.141 -5.403 -17.327 -5.537 l 2.919 -14.038 l 9.631 2.025 c 0.268 2.472 2.483 4.262 4.955 3.993 c 2.472 -0.268 4.262 -2.483 3.993 -4.955 s -2.483 -4.262 -4.955 -3.993 c -1.421 0.145 -2.696 0.973 -3.4 2.204 L 48.68 17.987 c -0.749 -0.168 -1.499 0.302 -1.667 1.063 c 0 0.011 0 0.011 0 0.022 l -3.322 15.615 c -6.264 0.101 -12.36 2.025 -17.55 5.537 c -2.64 -2.483 -6.801 -2.36 -9.284 0.291 c -2.483 2.64 -2.36 6.801 0.291 9.284 c 0.515 0.481 1.107 0.895 1.767 1.186 c -0.045 0.66 -0.045 1.32 0 1.98 c 0 10.078 11.745 18.277 26.23 18.277 c 14.485 0 26.23 -8.188 26.23 -18.277 c 0.045 -0.66 0.045 -1.32 0 -1.98 C 73.635 49.855 75.056 47.528 75.011 45 z M 30.011 49.508 c 0 -2.483 2.025 -4.508 4.508 -4.508 c 2.483 0 4.508 2.025 4.508 4.508 s -2.025 4.508 -4.508 4.508 C 32.025 53.993 30.011 51.991 30.011 49.508 z M 56.152 62.058 v -0.179 c -3.199 2.405 -7.114 3.635 -11.119 3.468 c -4.005 0.168 -7.919 -1.063 -11.119 -3.468 c -0.425 -0.515 -0.347 -1.286 0.168 -1.711 c 0.447 -0.369 1.085 -0.369 1.544 0 c 2.707 1.98 6.007 2.987 9.362 2.83 c 3.356 0.179 6.667 -0.783 9.407 -2.74 c 0.492 -0.481 1.297 -0.47 1.779 0.022 C 56.655 60.772 56.644 61.577 56.152 62.058 z M 55.537 54.34 c -0.078 0 -0.145 0 -0.224 0 l 0.034 -0.168 c -2.483 0 -4.508 -2.025 -4.508 -4.508 s 2.025 -4.508 4.508 -4.508 s 4.508 2.025 4.508 4.508 C 59.955 52.148 58.02 54.239 55.537 54.34 z"
        fill="white"
      />
    </g>
  </svg>
)
