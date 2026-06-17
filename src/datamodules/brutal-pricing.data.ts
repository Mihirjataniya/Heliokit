// ./docs/components/heliokit/pricing/index.ts

import PricingDemo from "@/components/heliokit/brutal-pricing/PricingDemo"

const pricingJSXDemo = `
  {/* Cards always fill their grid/flex cell — drop them in any layout.
      The size prop (sm | md | lg) only tunes padding & font-size. */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
      size="md"
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
      size="md"
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
      size="md"
      index={2}
    />
  </div>
`

const pricingImport = `import { PricingCard } from '@/components/Pricing'`

export const PreviewComponent = PricingDemo

export const code = `\${pricingImport}\n\nexport function PricingDemo() {\n  return (\${pricingJSXDemo})\n}`

export const description = "Animated, hover-reactive tier-based pricing cards with a brutalist look. Modular size prop (sm / md / lg) and full-width cards so they drop into any grid, flex row, or carousel without breaking the look & feel."

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

type CardSize = 'sm' | 'md' | 'lg'

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
  /** Modular scale — the card always fills its container width, this only tunes
   *  paddings / font-sizes so it reads well at any width. */
  size?: CardSize
  index?: number
}

interface SizeStyle {
  content: string
  iconWrap: string
  iconSize: number
  name: string
  rule: string
  desc: string
  priceWrap: string
  priceBox: string
  price: string
  period: string
  featuresWrap: string
  ruleThick: string
  featList: string
  checkBox: string
  checkIcon: string
  feature: string
  button: string
  corner: string
  badge: string
}

const sizeStyles: Record<CardSize, SizeStyle> = {
  sm: {
    content: 'p-5',
    iconWrap: 'p-2.5 mb-3',
    iconSize: 22,
    name: 'text-xl mb-2',
    rule: 'h-0.5 mb-2',
    desc: 'text-xs',
    priceWrap: 'mb-4',
    priceBox: 'p-3',
    price: 'text-2xl',
    period: 'text-sm ml-1.5',
    featuresWrap: 'mb-5',
    ruleThick: 'h-1.5 mb-3',
    featList: 'space-y-2',
    checkBox: 'w-5 h-5 mr-2.5',
    checkIcon: 'w-3 h-3',
    feature: 'text-xs',
    button: 'py-2.5 text-sm',
    corner: 'w-2 h-2',
    badge: 'text-xs px-3 py-1.5',
  },
  md: {
    content: 'p-6',
    iconWrap: 'p-3 mb-4',
    iconSize: 28,
    name: 'text-2xl mb-2.5',
    rule: 'h-1 mb-2.5',
    desc: 'text-sm',
    priceWrap: 'mb-5',
    priceBox: 'p-3.5',
    price: 'text-3xl',
    period: 'text-base ml-2',
    featuresWrap: 'mb-6',
    ruleThick: 'h-2 mb-3.5',
    featList: 'space-y-2.5',
    checkBox: 'w-6 h-6 mr-3',
    checkIcon: 'w-4 h-4',
    feature: 'text-sm',
    button: 'py-3 text-base',
    corner: 'w-2.5 h-2.5',
    badge: 'text-sm px-4 py-2',
  },
  lg: {
    content: 'p-8',
    iconWrap: 'p-4 mb-4',
    iconSize: 32,
    name: 'text-3xl mb-3',
    rule: 'h-1 mb-3',
    desc: 'text-base',
    priceWrap: 'mb-6',
    priceBox: 'p-4',
    price: 'text-4xl',
    period: 'text-lg ml-2',
    featuresWrap: 'mb-8',
    ruleThick: 'h-2 mb-4',
    featList: 'space-y-3',
    checkBox: 'w-6 h-6 mr-3',
    checkIcon: 'w-4 h-4',
    feature: 'text-base',
    button: 'py-4 text-lg',
    corner: 'w-3 h-3',
    badge: 'text-sm px-4 py-2',
  },
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
  size = 'md',
  index = 0
}: PricingCardProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const isLight = variant === 'light'
  const s = sizeStyles[size]

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
      className={\`relative w-full h-full transition-all duration-500 \${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
      }\`}
      style={{ transitionDelay: \`\${index * 150}ms\` }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 -right-4 z-30">
          <div className={\`\${hoverColors.overlayBg} text-black font-black \${s.badge} transform rotate-12 shadow-[4px_4px_0px_#000000] border-2 border-black\`}>
            POPULAR
          </div>
        </div>
      )}

      {/* Main Card with Hover Animation */}
      <div
        className={\`
        relative h-full overflow-hidden group
        transform transition-all duration-300
        hover:translate-x-1 hover:-translate-y-1
        \${
          isLight
            ? \`bg-black border-4 border-gray-100 shadow-[6px_6px_0px_#f3f4f6] hover:shadow-[8px_8px_0px_#f3f4f6] \${hoverColors.cardBg} \${hoverColors.cardBorder}\`
            : \`bg-gray-100 border-4 border-black shadow-[6px_6px_0px_#1f2937] hover:shadow-[8px_8px_0px_#1f2937] \${hoverColors.cardBg} \${hoverColors.cardBorder}\`
        }
      \`}
      >
        {/* Sliding Color Overlay */}
        <div
          className={\`
          absolute inset-0 z-10
          transform -translate-x-full
          transition-transform duration-700 ease-in-out
          group-hover:translate-x-0
          \${hoverColors.overlayBg}
        \`}
        />

        {/* Card Content */}
        <div className={\`relative z-20 \${s.content} flex flex-col h-full\`}>
          {/* Header Section */}
          <div className="text-center">
            <div
              className={\`
              inline-block transform -skew-x-3 border-2 \${s.iconWrap}
              transition-all duration-700 ease-in-out
              \${
                isLight
                  ? \`bg-gray-100 text-black border-gray-100 \${hoverColors.accentBg} \${hoverColors.accentText}\`
                  : \`bg-black text-gray-100 border-black \${hoverColors.accentBg} \${hoverColors.accentText}\`
              }
            \`}
            >
              <Icon size={s.iconSize} className="font-black transition-all duration-700" />
            </div>

            <h3
              className={\`
              font-black tracking-widest transform skew-x-1 \${s.name}
              transition-all duration-700 ease-in-out
              \${isLight ? \`text-gray-100 \${hoverColors.text}\` : \`text-black \${hoverColors.text}\`}
            \`}
            >
              {name}
            </h3>

            <div
              className={\`
              w-full \${s.rule}
              transition-all duration-700 ease-in-out
              \${isLight ? \`bg-gray-100 \${hoverColors.accentBg}\` : \`bg-black \${hoverColors.accentBg}\`}
            \`}
            />

            <p
              className={\`
              font-bold tracking-wide opacity-80 \${s.desc}
              transition-all duration-700 ease-in-out
              \${isLight ? \`text-gray-100 \${hoverColors.text}\` : \`text-black \${hoverColors.text}\`}
            \`}
            >
              {description}
            </p>
          </div>

          {/* Price Section */}
          <div className={\`text-center \${s.priceWrap} mt-5\`}>
            <div
              className={\`
              inline-block border-4 transform -skew-y-1 \${s.priceBox}
              transition-all duration-700 ease-in-out
              \${
                isLight
                  ? \`bg-gray-100 border-gray-100 \${hoverColors.accentBg}\`
                  : \`bg-black border-black \${hoverColors.accentBg}\`
              }
            \`}
            >
              <div className="flex items-baseline justify-center">
                <span
                  className={\`
                  font-black tracking-tighter \${s.price}
                  transition-all duration-700 ease-in-out
                  \${
                    isLight
                      ? \`text-black \${hoverColors.accentText}\`
                      : \`text-gray-100 \${hoverColors.accentText}\`
                  }
                \`}
                >
                  {price}
                </span>
                <span
                  className={\`
                  opacity-70 font-bold \${s.period}
                  transition-all duration-700 ease-in-out
                  \${
                    isLight
                      ? \`text-black \${hoverColors.accentText}\`
                      : \`text-gray-100 \${hoverColors.accentText}\`
                  }
                \`}
                >
                  {period}
                </span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className={s.featuresWrap}>
            <div
              className={\`
              w-full \${s.ruleThick}
              transition-all duration-700 ease-in-out
              \${isLight ? \`bg-gray-100 \${hoverColors.accentBg}\` : \`bg-black \${hoverColors.accentBg}\`}
            \`}
            />
            <ul className={s.featList}>
              {features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <div
                    className={\`
                    mt-0.5 flex-shrink-0 \${s.checkBox}
                    flex items-center justify-center border-2
                    transition-all duration-700 ease-in-out
                    \${
                      isLight
                        ? \`bg-gray-100 border-gray-100 \${hoverColors.accentBg}\`
                        : \`bg-black border-black \${hoverColors.accentBg}\`
                    }
                  \`}
                  >
                    <Check
                      className={\`
                      font-black \${s.checkIcon}
                      transition-all duration-700 ease-in-out
                      \${
                        isLight
                          ? \`text-black \${hoverColors.accentText}\`
                          : \`text-gray-100 \${hoverColors.accentText}\`
                      }
                    \`}
                    />
                  </div>
                  <span
                    className={\`
                    font-bold tracking-wide \${s.feature}
                    transition-all duration-700 ease-in-out
                    \${isLight ? \`text-gray-100 \${hoverColors.text}\` : \`text-black \${hoverColors.text}\`}
                  \`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <button
            className={\`
            w-full mt-auto px-4 border-4 font-black tracking-widest \${s.button}
            transform transition-all duration-700 ease-in-out
            hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#374151]
            active:translate-x-0 active:translate-y-0 active:shadow-none
            skew-x-1
            \${
              isLight
                ? \`bg-gray-100 text-black border-gray-100 \${hoverColors.buttonBg} \${hoverColors.buttonText} \${hoverColors.buttonBorder}\`
                : \`bg-black text-gray-100 border-black \${hoverColors.buttonBg} \${hoverColors.buttonText} \${hoverColors.buttonBorder}\`
            }
          \`}
          >
            {cta}
          </button>
        </div>

        {/* Clean Corner Accents */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
          <div
            key={pos}
            className={\`
            absolute \${pos} \${s.corner} z-20
            transition-all duration-700 ease-in-out
            \${isLight ? \`bg-gray-100 \${hoverColors.accentBg}\` : \`bg-black \${hoverColors.accentBg}\`}
          \`}
          />
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
        defaultValue: '""',
      },
      {
        propName: "price",
        description: "Price for the plan",
        type: "string",
        defaultValue: '""',
      },
      {
        propName: "period",
        description: "Billing period (e.g., /month)",
        type: "string",
        defaultValue: '""',
      },
      {
        propName: "description",
        description: "Short description for the plan",
        type: "string",
        defaultValue: '""',
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
        defaultValue: '""',
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
        type: '"light" | "dark"',
        defaultValue: '"light"',
      },
      {
        propName: "hoverColor",
        description: "Theme color for hover animation",
        type: '"blue" | "green" | "pink"',
        defaultValue: '"blue"',
      },
      {
        propName: "size",
        description: "Modular scale tuning padding & font-size; the card always fills its container width",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
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
