"use client"

import { useState, useEffect } from "react"

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
    }, 40) // Adjust timing as needed

    return () => clearInterval(timer)
  }, [textData])

  const renderRevealedText = (additionalClasses = "") => {
    return (
      <span className={additionalClasses}>
        {textData.split('').map((char, index) => (
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
    <div className="relative  z-10 text-center w-full" style={{ perspective: "800px", perspectiveOrigin: "center center" }}>
      {/* Main Text */}
      <div className="relative">
        <h1
          className="text-6xl md:text-9xl lg:text-[8rem] font-black tracking-wider text-[#a6a4a4] whitespace-nowrap"
          style={{
            transform: "translateZ(100px) rotateX(-15deg)",
            transformStyle: "preserve-3d",
            // textShadow: `
            //   0 0 5px #00bfff,
            //   0 10px 20px rgba(0, 0, 0, 0.5),
            //   0 20px 40px rgba(0, 191, 255, 0.3) 
            // `,
          }}
        >
          {renderRevealedText()}
        </h1>

        {/* Ghostly Blur Overlay */}
        <h1
          className="absolute inset-0 text-6xl md:text-6xl lg:text-[8rem] font-black tracking-wider text-[#8a8a8acf] blur-sm whitespace-nowrap"
          // style={{
          //   transform: "translateZ(100px) rotateX(-15deg)",
          //   transformStyle: "preserve-3d",
          //   textShadow: "0 0 8px #00bfff",
          // }}
        >
          {renderRevealedText()}
        </h1>
      </div>

      {/* Reflection */}
      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(0deg)",
        }}
      >
        <h1
          className="absolute inset-0 text-6xl md:text-9xl lg:text-[8rem] font-black tracking-wider text-[#656565e3] blur-[1px] md:blur-[2px] whitespace-nowrap"
          style={{
            transform: "translateZ(-80px) rotateX(65deg)",
            // textShadow: "0 0 12px #00bfff",
          }}
        >
          {renderRevealedText()}
        </h1>
      </div>
    </div>
  )
}
