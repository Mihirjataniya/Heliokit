import SocialGridDemo from "@/components/heliokit/social-grid/SocailGridDemo"



const socialGridJSXDemo = `
  <SocialGrid>
    <SocialIcon 
      value="instagram" 
      cornerPosition="top-left"
      backgroundColor="linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <InstagramIcon />
    </SocialIcon>

    <SocialIcon 
      value="twitter"
      backgroundColor="#000000"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <TwitterIcon />
    </SocialIcon>

    <SocialIcon 
      value="facebook" 
      cornerPosition="top-right"
      backgroundColor="#1877f2"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <FacebookIcon />
    </SocialIcon>

    <SocialIcon 
      value="whatsapp"
      backgroundColor="#25d366"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <WhatsAppIcon />
    </SocialIcon>

    <SocialSpacer />

    <SocialIcon 
      value="discord"
      backgroundColor="#5865f2"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <DiscordIcon />
    </SocialIcon>

    <SocialIcon 
      value="github" 
      cornerPosition="bottom-left"
      backgroundColor="#000000"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <GitHubIcon />
    </SocialIcon>

    <SocialIcon 
      value="telegram"
      backgroundColor="#0088cc"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <TelegramIcon />
    </SocialIcon>

    <SocialIcon 
      value="reddit" 
      cornerPosition="bottom-right"
      backgroundColor="#ff4500"
      iconColor="#e1e5e9"
      hoverIconColor="#ffffff"
    >
      <RedditIcon />
    </SocialIcon>
  </SocialGrid>
`

const socialGridImport = `import { 
  SocialGrid, 
  SocialIcon, 
  SocialSpacer,
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
  DiscordIcon,
  GitHubIcon,
  TelegramIcon,
  RedditIcon
} from "@/components/heliokit/social-grid/SocialGrid"`

export const PreviewComponent = SocialGridDemo
export const code = `${socialGridImport}\n\nexport function ExampleSocialGrid() {\n  return (${socialGridJSXDemo})}`
export const description =
    "An interactive grid layout for social icons. Displays a central hover overlay, animated background, and highlights the active social icon when hovered. Great for portfolios, landing pages, and link hubs."

export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add social-grid"],
    },
    {
        id: 2,
        title: "Import the component",
        codeSnippets: [
            {
                filename: "components/ExampleSocialGrid.tsx",
                language: "tsx",
                code: socialGridImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the component in your layout",
        codeSnippets: [
            {
                filename: "components/ExampleSocialGrid.tsx",
                language: "tsx",
                code: socialGridJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Create the SocialGrid and related components manually",
        codeSnippets: [
            {
                filename: "src/components/SocialGrid.tsx",
                language: "tsx",
                code: String.raw`
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
        className={\`relative \${className}\`}
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
      className={\`relative flex items-center justify-center w-[60px] h-[60px] \${getCornerRadius()} cursor-pointer backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-400 ease-in-out overflow-hidden\`}
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
              className: \`\${childProps.className || ''} transition-all duration-300 ease-in-out drop-shadow-lg\`,
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

// Pre-built social icons
export const InstagramIcon = () => (
  <svg fillRule="nonzero" height="36px" width="36px" fill='#ffffff' viewBox="0,0,256,256">
    <g transform="scale(8,8)">
      <path d="M11.46875,5c-3.55078,0 -6.46875,2.91406 -6.46875,6.46875v9.0625c0,3.55078 2.91406,6.46875 6.46875,6.46875h9.0625c3.55078,0 6.46875,-2.91406 6.46875,-6.46875v-9.0625c0,-3.55078 -2.91406,-6.46875 -6.46875,-6.46875zM11.46875,7h9.0625c2.47266,0 4.46875,1.99609 4.46875,4.46875v9.0625c0,2.47266 -1.99609,4.46875 -4.46875,4.46875h-9.0625c-2.47266,0 -4.46875,-1.99609 -4.46875,-4.46875v-9.0625c0,-2.47266 1.99609,-4.46875 4.46875,-4.46875zM21.90625,9.1875c-0.50391,0 -0.90625,0.40234 -0.90625,0.90625c0,0.50391 0.40234,0.90625 0.90625,0.90625c0.50391,0 0.90625,-0.40234 0.90625,-0.90625c0,-0.50391 -0.40234,-0.90625 -0.90625,-0.90625zM16,10c-3.30078,0 -6,2.69922 -6,6c0,3.30078 2.69922,6 6,6c3.30078,0 6,-2.69922 6,-6c0,-3.30078 -2.69922,-6 -6,-6zM16,12c2.22266,0 4,1.77734 4,4c0,2.22266 -1.77734,4 -4,4c-2.22266,0 -4,-1.77734 -4,-4c0,-2.22266 1.77734,-4 4,-4z"/>
    </g>
  </svg>
)

export const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" height="24px" width="24px" fill='#ffffff'>
    <path d="M714.163 519.284 1160.89 0H1058.9L667.137 450.887 356.873 0H0l468.891 681.821L0 1226.37h101.986l407.28-477.733L843.127 1226.37H1200L714.137 519.284h.026Zm-144.371 168.9-47.249-67.146L137.96 79.52h162.21l303.947 432.264 47.249 67.146 398.223 566.28h-162.21L569.792 688.184Z" />
  </svg>
)
  ....
`,
            },
        ],
    },
    {
        id: 2,
        title: "Render it inside a page",
        codeSnippets: [
            {
                filename: "pages/index.tsx",
                language: "tsx",
                code: socialGridJSXDemo,
            },
        ],
    },
]

export const propsData = [
    {
        componentName: "SocialGrid",
        props: [
            {
                propName: "children",
                description: "The grid items (SocialIcon or SocialSpacer) to render inside the grid.",
                type: "ReactNode",
                defaultValue: "—",
            },
            {
                propName: "className",
                description: "Optional additional classes for the outer container.",
                type: "string",
                defaultValue: "—",
            },
        ],
    },
    {
        componentName: "SocialIcon",
        props: [
            {
                propName: "value",
                description: "The unique identifier for the social icon (e.g., 'twitter', 'github').",
                type: `"instagram" | "twitter" | "facebook" ...`,
                defaultValue: "—",
            },
            {
                propName: "cornerPosition",
                description: "Applies rounded corner style if placed in a grid corner.",
                type: `"top-left" | "top-right" ...`,
                defaultValue: `"none"`,
            },
            {
                propName: "backgroundColor",
                description: "Background fill or gradient shown when hovered.",
                type: "string",
                defaultValue: "—",
            },
            {
                propName: "iconColor",
                description: "Default icon color.",
                type: "string",
                defaultValue: `"#ffffff"`,
            },
            {
                propName: "hoverIconColor",
                description: "Icon color when active/hovered.",
                type: "string",
                defaultValue: `"#ffffff"`,
            },
            {
                propName: "children",
                description: "The SVG icon element (InstagramIcon, TwitterIcon, etc.).",
                type: "ReactNode",
                defaultValue: "—",
            },
        ],
    },
    {
        componentName: "SocialSpacer",
        props: [],
    },
]
