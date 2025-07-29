import { GlossyDock } from "@/components/heliokit/glossy-dock/GlossyDock"
import DockDemo from "@/components/heliokit/glossy-dock/GlossyDockDemo"

const dockJSXDemo = `
 const dockData = [
    { id: "home", icon: Home, label: "Home", onClick: () => router.push("/home") },
    { id: "search", icon: Search, label: "Search", onClick: () => alert("Search clicked!") },
    { id: "messages", icon: MessageCircle, label: "Messages", onClick: () => console.log("Opening chat UI...") },
    { id: "notifications", icon: Bell, label: "Notifications", onClick: () => alert("🔔 You have new notifications." },
    { id: "favorites", icon: Heart, label: "Favorites", onClick: () => router.push("/favorites" },
    { id: "apps", icon: Grid3X3, label: "Apps", onClick: () => alert("Launching app tray..." },
    { id: "profile", icon: User, label: "Profile", onClick: () => router.push("/profile") ,
    { id: "settings", icon: Settings, label: "Settings", onClick: () => alert("Opening settings..." }
  ]
    <GlossyDock
        accentColor="lime"
        activeId={activeId}
        onSelect={(id) => setActiveId(id)}
        dockItems={dockData}
    />
`

const dockImport = `import { GlossyDock } from '@/components/GlossyDock'
import { useRouter } from 'next/navigation'
import { Home, Search, MessageCircle, Bell, Heart, Grid3X3, User, Settings } from 'lucide-react'`

export const PreviewComponent = DockDemo

export const code = `${dockImport}

export function DockDemo() {
  const [activeId, setActiveId] = useState("home")
  const router = useRouter()

  return (
    ${dockJSXDemo}
  )
}`

export const description = 'A glossy, interactive dock component with customizable icon actions, animated tooltips, and glowing indicators. Designed for immersive dashboards and navigational menus with full control over interactions.'

export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add glossy-dock"],
    },
    {
        id: 2,
        title: "Import the Dock",
        codeSnippets: [
            {
                filename: "components/DockDemo.tsx",
                language: "tsx",
                code: dockImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the Dock component",
        codeSnippets: [
            {
                filename: "components/DockDemo.tsx",
                language: "tsx",
                code: dockJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Install dependencies",
        commands: [
            "npm install lucide-react"
        ]
    },
    {
        id: 2,
        title: "Create Dock component manually",
        codeSnippets: [
            {
                filename: "components/GlossyDock.tsx",
                language: "tsx",
                code: `import React, { useState } from "react"

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

  const activeGlow = \`from-\${accentColor}-500/20 to-\${accentColor}-400/10\`
  const strokeActive = \`stroke-\${accentColor}-400 drop-shadow-[0_0_12px_rgba(163,230,53,0.6)]\`
  const borderActive = \`border-\${accentColor}-400/30\`
  const glow = \`bg-\${accentColor}-400/5\`
  const indicator = \`bg-\${accentColor}-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]\`

  return (
    <button
      className={\`group relative flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl transition-all duration-500 ease-out transform-gpu will-change-transform hover:scale-125 active:scale-110 focus:outline-none focus:ring-2 focus:ring-\${accentColor}-400/50 backdrop-blur-sm \${isActive ? "scale-110" : ""} \${isHovered && !isActive ? "scale-115" : ""} \${isPressed ? "scale-105" : ""}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      aria-label={label}
    >
      {isActive && <div className={\`absolute inset-0 rounded-2xl bg-gradient-to-t \${activeGlow} animate-pulse\`} />}
      <div className={\`absolute inset-0 rounded-2xl transition-all duration-300 bg-gradient-to-t from-white/5 to-transparent \${isHovered ? "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]" : ""} \${isActive ? "shadow-[inset_0_1px_0_0_rgba(163,230,53,0.3)]" : ""}\`} />
      {isPressed && <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping" />}
      <div className="relative z-10">
        <Icon
          className={\`w-5 h-5 md:w-7 md:h-7 cursor-pointer transition-all duration-300 stroke-gray-400 group-hover:stroke-white transform-gpu will-change-transform \${isActive ? strokeActive : ""} \${isHovered && !isActive ? "stroke-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""} \${isPressed ? "scale-90" : ""}\`}
          strokeWidth={isActive ? 2 : 1.5}
        />
      </div>
      <div className={\`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 \${indicator} rounded-full transition-all duration-500 ease-out \${isActive ? "w-8 opacity-100" : "w-0 opacity-0"}\`} />
      <div className={\`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/80 rounded-full transition-all duration-300 \${!isActive && isHovered ? "w-6 opacity-100" : "w-0 opacity-0"}\`} />
      <div className={\`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-lg text-xs text-white font-medium whitespace-nowrap border border-white/10 opacity-0 scale-90 translate-y-2 transition-all duration-300 pointer-events-none z-50 \${isHovered || isActive ? "opacity-100 scale-100 translate-y-0" : ""} \${isActive ? borderActive + " shadow-[0_0_8px_rgba(163,230,53,0.2)]" : ""}\`}>
        {label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/90" />
      </div>
      {isActive && <div className={\`absolute inset-0 rounded-2xl \${glow} blur-xl scale-150 animate-pulse\`} />}
    </button>
  )
}

export function GlossyDock({
  dockItems,
  activeId,
  onSelect,
  accentColor = "lime"
}: GlossyDockProps) {
  const [dockHovered, setDockHovered] = useState(false)

  return (
    <div className="bg-black flex items-center justify-center p-4">
      <div className="relative mb-8" onMouseEnter={() => setDockHovered(true)} onMouseLeave={() => setDockHovered(false)}>
        <div className={\`relative z-10 flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl md:rounded-[2rem] shadow-[0_16px_64px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/10 before:via-white/5 before:to-transparent before:rounded-3xl md:before:rounded-[2rem] before:pointer-events-none \${dockHovered ? "scale-105 shadow-[0_20px_80px_rgba(0,0,0,0.8)]" : ""}\`}>
          <div className={\`absolute inset-0.5 rounded-3xl md:rounded-[2rem] pointer-events-none transition-all duration-500 bg-gradient-to-t from-transparent via-white/5 to-white/10 \${dockHovered ? \`from-\${accentColor}-500/5\` : ""}\`} />
          <div className="relative flex items-center gap-2 md:gap-3">
            {dockItems.map((item, index) => (
              <div key={item.id} style={{ transitionDelay: \`\${index * 50}ms\` }}>
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
`
            }
        ]
    },
    {
        id: 3,
        title: "Use the Dock in your layout",
        codeSnippets: [
            {
                filename: "components/DockDemo.tsx",
                language: "tsx",
                code: dockJSXDemo,
            }
        ]
    }
]

export const propsData = [
    {
        componentName: "GlossyDock",
        props: [
            {
                propName: "accentColor",
                description: "Sets the glow",
                type: "string",
                defaultValue: '"lime"'
            },
            {
                propName: "dockItems",
                description: "An array items to render inside the dock.",
                type: `check the demo`,
                defaultValue: "-"
            },
            {
                propName: "activeId",
                description: "The currently active icon's identifier.",
                type: "string",
                defaultValue: "-"
            },
            {
                propName: "onSelect",
                description: "Function that is called with the id of the selected dock item.",
                type: "(id: string) => void",
                defaultValue: "-"
            }
        ]
    },
    {
        componentName: "DockIcon",
        props: [
            {
                propName: "icon",
                description: "Lucide icon component used inside the dock button.",
                type: "React.ElementType",
                defaultValue: "-"
            },
            {
                propName: "label",
                description: "Text label for tooltip display on hover.",
                type: "string",
                defaultValue: "-"
            },
            {
                propName: "isActive",
                description: "Controls active state and glow animation.",
                type: "boolean",
                defaultValue: "false"
            },
            {
                propName: "onClick",
                description: "Function to be triggered on click of the icon.",
                type: "() => void",
                defaultValue: "undefined"
            },
            {
                propName: "accentColor",
                description: "Color theme used for hover and glow states.",
                type: "string",
                defaultValue: '"lime"'
            }
        ]
    }
]
