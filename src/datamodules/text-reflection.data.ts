import TextReflectionDemo from "@/components/heliokit/text-reflection/TextReflectionDemo"

const textReflectionJSXDemo = `
    <TextReflection textData="HELIOKIT" color="#00bfff" />
`

const textReflectionImport = `import TextReflection from "@/components/TextReflection"`

const manualTextReflectionCode = `"use client"

import { useState, useEffect, useRef } from "react"

interface TextReflectionProps {
  textData: string
  /** Base text colour (any CSS colour). Drives the main face, the ghost blur
   *  overlay and the floor reflection. Defaults to neutral grey. */
  color?: string
}

export default function TextReflection({ textData, color = "#a6a4a4" }: TextReflectionProps) {
  const [revealedChars, setRevealedChars] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  // One-shot guard: the reveal plays the first time the text scrolls into view
  // and never again — it won't replay or reverse on subsequent scrolling.
  const started = useRef(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let timer: ReturnType<typeof setInterval> | undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        io.disconnect()
        timer = setInterval(() => {
          setRevealedChars(prev => {
            if (prev < textData.length) return prev + 1
            clearInterval(timer)
            return prev
          })
        }, 40)
      },
      { threshold: 0.25 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (timer) clearInterval(timer)
    }
  }, [textData])

  const renderRevealedText = () => (
    <span>
      {textData.split('').map((char, index) => (
        <span
          key={index}
          className={\`inline-block transition-all duration-300 \${index < revealedChars
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-4'}\`}
          style={{ transitionDelay: \`\${index * 50}ms\` }}
        >
          {char}
        </span>
      ))}
    </span>
  )

  return (
    <div ref={rootRef} className="relative z-10 text-center w-full" style={{ perspective: "800px", perspectiveOrigin: "center center" }}>
      {/* Main Text */}
      <div className="relative">
        <h1
          className="text-6xl md:text-9xl lg:text-[8rem] font-black tracking-wider whitespace-nowrap"
          style={{ color, transform: "translateZ(100px) rotateX(-15deg)", transformStyle: "preserve-3d" }}
        >
          {renderRevealedText()}
        </h1>

        {/* Ghostly Blur Overlay */}
        <h1
          className="absolute inset-0 text-6xl md:text-9xl lg:text-[8rem] font-black tracking-wider blur-sm whitespace-nowrap"
          style={{ color, opacity: 0.81 }}
        >
          {renderRevealedText()}
        </h1>
      </div>

      {/* Reflection */}
      <div className="relative" style={{ transformStyle: "preserve-3d", transform: "rotateX(0deg)" }}>
        <h1
          className="absolute inset-0 text-6xl md:text-9xl lg:text-[8rem] font-black tracking-wider blur-[1px] md:blur-[2px] whitespace-nowrap"
          style={{ color, opacity: 0.6, transform: "translateZ(-80px) rotateX(65deg)" }}
        >
          {renderRevealedText()}
        </h1>
      </div>
    </div>
  )
}`

export const PreviewComponent = TextReflectionDemo
export const code = `${textReflectionImport}\n\nexport function ExampleTextReflection() {\n  return (${textReflectionJSXDemo})}`
export const description =
    "A 3D-styled text component that reveals characters one at a time with a soft glow and reflection. Useful for landing pages and hero headers."

export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add text-reflection"],
    },
    {
        id: 2,
        title: "Import the component",
        codeSnippets: [
            {
                filename: "components/ExampleTextReflection.tsx",
                language: "tsx",
                code: textReflectionImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the component in your layout",
        codeSnippets: [
            {
                filename: "components/ExampleTextReflection.tsx",
                language: "tsx",
                code: textReflectionJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Create the TextReflection component manually",
        codeSnippets: [
            {
                filename: "src/components/TextReflection.tsx",
                language: "tsx",
                code: manualTextReflectionCode,
            },
        ],
    },
    {
        id: 2,
        title: "Render it inside a section or page",
        codeSnippets: [
            {
                filename: "pages/index.tsx",
                language: "tsx",
                code: textReflectionJSXDemo,
            },
        ],
    },
]

export const propsData = [
    {
        componentName: "TextReflection",
        props: [
            {
                propName: "textData",
                description: "The text string to animate and display with 3D reflection",
                type: "string",
                defaultValue: `"HELIOKIT"`,
            },
            {
                propName: "color",
                description: "Base text colour (any CSS colour). Drives the main face, the ghost blur overlay and the floor reflection",
                type: "string",
                defaultValue: `"#a6a4a4"`,
            },
        ],
    },
]
