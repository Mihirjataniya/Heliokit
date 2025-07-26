// ./docs/components/heliokit/pricing/index.ts

import PricingDemo from "@/components/heliokit/brutal-pricing/PricingDemo"

const pricingJSXDemo = `
  <PricingCard
    name="BASIC"
    price="$29"
    period="/MONTH"
    description="FOR BEGINNERS ONLY"
    features={[
      "10K REQUESTS/MONTH",
      "BASIC ANALYTICS",
      "EMAIL SUPPORT ONLY",
      "STANDARD API ACCESS",
      "99.9% UPTIME"
    ]}
    cta="GET BASIC NOW"
    icon={Zap}
    hoverColor="blue"
    variant="light"
    index={0}
  />
  <PricingCard
    name="PRO"
    price="$99"
    period="/MONTH"
    description="MOST CHOSEN PLAN"
    features={[
      "100K REQUESTS/MONTH",
      "ADVANCED ANALYTICS",
      "24/7 PRIORITY SUPPORT",
      "PREMIUM API ACCESS",
      "PRIORITIZED SLA"
    ]}
    cta="GET PRO NOW"
    icon={Rocket}
    hoverColor="green"
    variant="dark"
    popular
    index={1}
  />
  <PricingCard
    name="ENTERPRISE"
    price="CUSTOM"
    period=""
    description="FOR LARGE SCALE USERS"
    features={[
      "UNLIMITED USAGE",
      "CUSTOM ANALYTICS",
      "DEDICATED ACCOUNT MANAGER",
      "ENTERPRISE SLA",
      "WHITE-LABEL SUPPORT"
    ]}
    cta="CONTACT SALES"
    icon={Crown}
    hoverColor="pink"
    variant="light"
    index={2}
  />
`

const pricingImport = `import { PricingCard } from '@/components/Pricing'`

export const PreviewComponent = PricingDemo

export const code = `${pricingImport}\n\nexport function PricingDemo() {\n  return (${pricingJSXDemo})\n}`

export const description = "Animated and hover-reactive tier-based pricing cards with support for popular plans, icons, and dark/light variants."

export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit@latest add brutal-pricing"],
  },
  {
    id: 2,
    title: "Import required modules",
    codeSnippets: [
      {
        filename: "components/PricingDemo.tsx",
        language: "tsx",
        code: pricingImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the Pricing component",
    codeSnippets: [
      {
        filename: "components/PricingDemo.tsx",
        language: "tsx",
        code: pricingJSXDemo,
      },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: "Install required dependencies",
    commands: ["npm install lucide-react"],
  },
  {
    id: 2,
    title: "Create Pricing component manually",
    codeSnippets: [
      {
        filename: "src/components/Pricing.tsx",
        language: "tsx",
        code: `import React, { useState, useEffect } from 'react'
import { Check, Zap, Crown, Rocket } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  icon: typeof Zap | typeof Crown | typeof Rocket
  popular?: boolean
  variant?: 'light' | 'dark'
  hoverColor?: 'blue' | 'green' | 'pink'
  index?: number
}

export const PricingCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  cta, 
  icon: Icon, 
  popular = false, 
  variant = 'light', 
  hoverColor = 'blue',
  index = 0
}: PricingCardProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const isLight = variant === 'light'

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getHoverColors = (hoverColor: string) => {
    switch (hoverColor) {
      case "blue":
        return {
          cardBg: "group-hover:bg-purple-600",
          cardBorder: "group-hover:border-purple-600",
          text: "group-hover:text-white",
          accentBg: "group-hover:bg-white",
          accentText: "group-hover:text-purple-600",
          buttonBg: "group-hover:bg-white",
          buttonText: "group-hover:text-purple-600",
          buttonBorder: "group-hover:border-white",
          overlayBg: "bg-purple-600",
        }
      case "green":
        return {
          cardBg: "group-hover:bg-emerald-500",
          cardBorder: "group-hover:border-emerald-500",
          text: "group-hover:text-black",
          accentBg: "group-hover:bg-black",
          accentText: "group-hover:text-emerald-500",
          buttonBg: "group-hover:bg-black",
          buttonText: "group-hover:text-emerald-500",
          buttonBorder: "group-hover:border-black",
          overlayBg: "bg-emerald-500",
        }
      case "pink":
        return {
          cardBg: "group-hover:bg-pink-500",
          cardBorder: "group-hover:border-pink-500",
          text: "group-hover:text-white",
          accentBg: "group-hover:bg-white",
          accentText: "group-hover:text-pink-500",
          buttonBg: "group-hover:bg-white",
          buttonText: "group-hover:text-pink-500",
          buttonBorder: "group-hover:border-white",
          overlayBg: "bg-pink-500",
        }
      default:
        return {
          cardBg: "group-hover:bg-black",
          cardBorder: "group-hover:border-black",
          text: "group-hover:text-white",
          accentBg: "group-hover:bg-white",
          accentText: "group-hover:text-black",
          buttonBg: "group-hover:bg-white",
          buttonText: "group-hover:text-black",
          buttonBorder: "group-hover:border-white",
          overlayBg: "bg-black",
        }
    }
  }

  const hoverColors = getHoverColors(hoverColor)

  return (
    <div
      className={\`relative w transition-all duration-500 \${isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"}\`}
      style={{ transitionDelay: \`\${index * 150}ms\` }}
    >
      {popular && (
        <div className="absolute -top-4 -right-4 z-30">
          <div className={\`\${hoverColors.overlayBg} text-black font-black text-sm px-4 py-2 transform rotate-12 shadow-[4px_4px_0px_#000000] border-2 border-black\`}>
            POPULAR
          </div>
        </div>
      )}

      <div
        className={\`
        relative overflow-hidden group
        transform transition-all duration-300 
        hover:translate-x-1 hover:-translate-y-1
        \${popular ? "scale-105" : ""}
        \${isLight
          ? \`bg-black border-4 border-gray-100 shadow-[6px_6px_0px_#f3f4f6] hover:shadow-[8px_8px_0px_#f3f4f6] \${hoverColors.cardBg} \${hoverColors.cardBorder}\`
          : \`bg-gray-100 border-4 border-black shadow-[6px_6px_0px_#1f2937] hover:shadow-[8px_8px_0px_#1f2937] \${hoverColors.cardBg} \${hoverColors.cardBorder}\`
        }\`}
      >
        <div className={\`absolute inset-0 z-10 transform -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-0 \${hoverColors.overlayBg}\`} />
        <div className="relative z-20 p-8">
          <div className="text-center mb-6">
            <div className={\`
              inline-block p-4 mb-4 transform -skew-x-3 border-2 transition-all duration-700 ease-in-out
              \${isLight
                ? \`bg-gray-100 text-black border-gray-100 \${hoverColors.accentBg} \${hoverColors.accentText}\`
                : \`bg-black text-gray-100 border-black \${hoverColors.accentBg} \${hoverColors.accentText}\`
              }\`}>
              <Icon size={32} className="font-black transition-all duration-700" />
            </div>

            <h3 className={\`
              text-3xl font-black mb-3 tracking-widest transform skew-x-1
              transition-all duration-700 ease-in-out
              \${isLight ? \`text-gray-100 \${hoverColors.text}\` : \`text-black \${hoverColors.text}\`}
            \`}>
              {name}
            </h3>

            <div className={\`
              w-full h-1 mb-3
              transition-all duration-700 ease-in-out
              \${isLight ? \`bg-gray-100 \${hoverColors.accentBg}\` : \`bg-black \${hoverColors.accentBg}\`}
            \`} />

            <p className={\`
              font-bold text-base tracking-wide opacity-80
              transition-all duration-700 ease-in-out
              \${isLight ? \`text-gray-100 \${hoverColors.text}\` : \`text-black \${hoverColors.text}\`}
            \`}>
              {description}
            </p>
          </div>

          <div className="text-center mb-6">
            <div className={\`
              inline-block p-4 border-4 transform -skew-y-1
              transition-all duration-700 ease-in-out
              \${isLight ? \`bg-gray-100 border-gray-100 \${hoverColors.accentBg}\` : \`bg-black border-black \${hoverColors.accentBg}\`}
            \`}>
              <div className="flex items-baseline justify-center">
                <span className={\`
                  text-4xl font-black tracking-tighter
                  transition-all duration-700 ease-in-out
                  \${isLight ? \`text-black \${hoverColors.accentText}\` : \`text-gray-100 \${hoverColors.accentText}\`}
                \`}>
                  {price}
                </span>
                <span className={\`
                  text-lg opacity-70 font-bold ml-2
                  transition-all duration-700 ease-in-out
                  \${isLight ? \`text-black \${hoverColors.accentText}\` : \`text-gray-100 \${hoverColors.accentText}\`}
                \`}>
                  {period}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className={\`
              w-full h-2 mb-4
              transition-all duration-700 ease-in-out
              \${isLight ? \`bg-gray-100 \${hoverColors.accentBg}\` : \`bg-black \${hoverColors.accentBg}\`}
            \`} />
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className={\`
                    w-6 h-6 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center border-2
                    transition-all duration-700 ease-in-out
                    \${isLight ? \`bg-gray-100 border-gray-100 \${hoverColors.accentBg}\` : \`bg-black border-black \${hoverColors.accentBg}\`}
                  \`}>
                    <Check className={\`
                      w-4 h-4 font-black
                      transition-all duration-700 ease-in-out
                      \${isLight ? \`text-black \${hoverColors.accentText}\` : \`text-gray-100 \${hoverColors.accentText}\`}
                    \`} />
                  </div>
                  <span className={\`
                    font-bold text-base tracking-wide
                    transition-all duration-700 ease-in-out
                    \${isLight ? \`text-gray-100 \${hoverColors.text}\` : \`text-black \${hoverColors.text}\`}
                  \`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button className={\`
            w-full py-4 px-4 border-4 font-black text-lg tracking-widest
            transform transition-all duration-700 ease-in-out
            hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#374151]
            active:translate-x-0 active:translate-y-0 active:shadow-none
            skew-x-1
            \${isLight ? \`bg-gray-100 text-black border-gray-100 \${hoverColors.buttonBg} \${hoverColors.buttonText} \${hoverColors.buttonBorder}\` : \`bg-black text-gray-100 border-black \${hoverColors.buttonBg} \${hoverColors.buttonText} \${hoverColors.buttonBorder}\`}
          \`}>
            {cta}
          </button>
        </div>

        {/* Corner Accents */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
          <div key={i} className={\`absolute \${pos} w-3 h-3 z-20 transition-all duration-700 ease-in-out \${isLight ? \`bg-gray-100 \${hoverColors.accentBg}\` : \`bg-black \${hoverColors.accentBg}\`}\`} />
        ))}
      </div>
    </div>
  )
}
`,
      },
    ],
  },
  {
    id: 3,
    title: "Use the Pricing component in your code",
    codeSnippets: [
      {
        filename: "src/components/PricingDemo.tsx",
        language: "tsx",
        code: pricingJSXDemo,
      },
    ],
  },
]

export const propsData = [
  {
    componentName: "PricingCard",
    props: [
      {
        propName: "name",
        description: "Title of the pricing tier",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "price",
        description: "Price for the plan",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "period",
        description: "Billing period (e.g., /month)",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "description",
        description: "Short description for the plan",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "features",
        description: "Array of strings listing plan features",
        type: "string[]",
        defaultValue: "[]",
      },
      {
        propName: "cta",
        description: "Call-to-action button label",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "icon",
        description: "Icon to display (Lucide component)",
        type: "typeof Zap | Rocket | Crown",
        defaultValue: "Zap",
      },
      {
        propName: "popular",
        description: "Whether the plan is featured with a POPULAR badge",
        type: "boolean",
        defaultValue: "false",
      },
      {
        propName: "variant",
        description: "Visual theme for the card",
        type: `"light" | "dark"`,
        defaultValue: `"light"`,
      },
      {
        propName: "hoverColor",
        description: "Theme color for hover animation",
        type: `"blue" | "green" | "pink"`,
        defaultValue: `"blue"`,
      },
      {
        propName: "index",
        description: "Card index for staggered animation delays",
        type: "number",
        defaultValue: "0",
      },
    ],
  },
]
