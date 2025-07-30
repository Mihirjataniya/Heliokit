import { useState, useEffect } from "react"

export default function HELIOKITHero() {
  const [revealedChars, setRevealedChars] = useState(0)
  const text = "HELIOKIT"

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealedChars(prev => {
        if (prev < text.length) {
          return prev + 1
        }
        clearInterval(timer)
        return prev
      })
    }, 40) // Adjust timing as needed

    return () => clearInterval(timer)
  }, [])

  const renderRevealedText = (additionalClasses = "") => {
    return (
      <span className={additionalClasses}>
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ${
              index < revealedChars 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-4'
            }`}
            style={{
              transitionDelay: `${index * 50}ms`
            }}
          >
            {char}
          </span>
        ))}
      </span>
    )
  }

  return (
      <div className="relative min-h-96 z-10 text-center" style={{ perspective: "800px", perspectiveOrigin: "center center" }}>
        {/* Main HELIOKIT text popping out */}
        <div className="relative">
          <h1
            className="text-6xl md:text-9xl lg:text-[12rem] font-black tracking-wider text-blue-400"
            style={{
              transform: "translateZ(100px) rotateX(-15deg)",
              transformStyle: "preserve-3d",
              textShadow: `
                0 0 10px #00bfff,
                0 10px 20px rgba(0, 0, 0, 0.5),
                0 20px 40px rgba(0, 191, 255, 0.3)
              `,
            }}
          >
            {renderRevealedText()}
          </h1>

          {/* Blur layer for ghostly effect */}
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

        {/* Dramatic surface reflection sinking into screen */}
        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d", // enable 3D children
            transform: "rotateX(0deg)",    // force 3D context
          }}
        >

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
}