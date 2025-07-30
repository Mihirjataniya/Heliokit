import TextReflectionDemo from "@/components/heliokit/text-reflection/TextReflectionDemo"

const textReflectionJSXDemo = `
    <TextReflection textData="HELIOKIT" />
`

const textReflectionImport = `import TextReflection from "@/components/TextReflection"`

const manualTextReflectionCode = `import { useState, useEffect } from "react"

interface TextReflectionProps {
  textData: string
}

export default function TextReflection({ textData }: TextReflectionProps) {
  const [revealedChars, setRevealedChars] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealedChars(prev => {
        if (prev < textData.length) {
          return prev + 1
        }
        clearInterval(timer)
        return prev
      })
    }, 40)
    return () => clearInterval(timer)
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
    <div className="relative min-h-96 z-10 text-center" style={{ perspective: "800px", perspectiveOrigin: "center center" }}>
      <div className="relative">
        <h1
          className="text-6xl md:text-9xl lg:text-[12rem] font-black tracking-wider text-blue-400"
          style={{
            transform: "translateZ(100px) rotateX(-15deg)",
            transformStyle: "preserve-3d",
            textShadow: \`
              0 0 10px #00bfff,
              0 10px 20px rgba(0, 0, 0, 0.5),
              0 20px 40px rgba(0, 191, 255, 0.3)
            \`,
          }}
        >
          {renderRevealedText()}
        </h1>
        <h1
          className="absolute inset-0 text-6xl md:text-9xl lg:text-[12rem] font-black tracking-wider text-blue-300/50 blur-sm"
          style={{
            transform: "translateZ(100px) rotateX(-15deg)",
            transformStyle: "preserve-3d",
            textShadow: "0 0 12px #00bfff",
          }}
        >
          {renderRevealedText()}
        </h1>
      </div>
      <div className="relative" style={{ transformStyle: "preserve-3d", transform: "rotateX(0deg)" }}>
        <h1
          className="absolute inset-0 text-6xl md:text-9xl lg:text-[12rem] font-black tracking-wider text-blue-300/50 blur-[1.5px] md:blur-sm"
          style={{
            transform: "translateZ(-80px) rotateX(70deg)",
            textShadow: "0 0 25px #00bfff",
          }}
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
        ],
    },
]
