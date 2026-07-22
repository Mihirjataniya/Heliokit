import React, { useState, useEffect } from 'react'

interface GlitchCardProps {
  images: { url: string; title: string; caption: string }[]
  interval?: number
  className?: string
}

const GlitchCard = ({ images, interval = 4000, className = '' }: GlitchCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const int = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 200)
      setTimeout(() => {
        setIsGlitching(false)
      }, 900)
    }, interval)

    return () => clearInterval(int)
  }, [images.length, interval])

  const { url, title, caption } = images[currentImageIndex]

  return (
    <div className={`flex items-center justify-center bg-black overflow-visible p-4 ${className}`}>
      <div className="relative w-80 h-96 rounded-lg overflow-visible shadow-[0_0_80px_#ff00ff20]">
        <div className="relative w-full h-full rounded-xl z-0">
          <img
            src={url}
            alt="Main"
            className={`w-full h-full object-cover transition-transform duration-300 rounded-xl ${isGlitching ? 'scale-105 blur-sm' : ''}`}
          />

          {isGlitching && (
            <>
              <img
                src={url}
                alt=""
                aria-hidden="true"
                className="absolute top-[-20px] left-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] object-cover mix-blend-screen z-20 pointer-events-none"
                style={{
                  filter: 'brightness(1.4) hue-rotate(0deg) saturate(2)',
                  transform: 'translate(-6px, 4px) scale(1.1)',
                  animation: 'glitch-clip-1 0.6s infinite linear',
                }}
              />
              <img
                src={url}
                alt=""
                aria-hidden="true"
                className="absolute top-[-20px] left-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] object-cover mix-blend-screen z-10 pointer-events-none"
                style={{
                  filter: 'brightness(1.4) hue-rotate(180deg) saturate(2)',
                  transform: 'translate(5px, -3px) scale(1.1)',
                  animation: 'glitch-clip-2 0.6s infinite linear',
                }}
              />
              <div className="absolute inset-[-20px] bg-white/5 z-30 pointer-events-none" style={{ animation: 'glitch-noise 0.15s infinite' }} />
            </>
          )}
        </div>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
          <h3
            className={`text-white text-xl whitespace-nowrap font-bold relative glitch-text ${isGlitching ? 'glitching-text' : ''}`}
            data-text={title}
          >
            {title}
          </h3>
          <p className="text-gray-400 text-xs">{caption}</p>
        </div>

        {/* Embedded Glitch CSS */}
        <style>{`
          @keyframes glitch-noise {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }

          @keyframes glitch-clip-1 {
            0% { clip-path: inset(5% 0 85% 0); }
            25% { clip-path: inset(15% 0 70% 0); }
            50% { clip-path: inset(30% 0 40% 0); }
            75% { clip-path: inset(10% 0 60% 0); }
            100% { clip-path: inset(25% 0 35% 0); }
          }

          @keyframes glitch-clip-2 {
            0% { clip-path: inset(70% 0 15% 0); }
            25% { clip-path: inset(40% 0 40% 0); }
            50% { clip-path: inset(10% 0 80% 0); }
            75% { clip-path: inset(30% 0 50% 0); }
            100% { clip-path: inset(60% 0 10% 0); }
          }

          .glitch-text {
            position: relative;
          }

          .glitch-text::before,
          .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            pointer-events: none;
          }

          .glitch-text::before {
            color: #ff00ff;
            transform: translate(-2px, -1px);
            z-index: -1;
            animation: glitch-text-before 0.8s infinite;
          }

          .glitch-text::after {
            color: #00ffff;
            transform: translate(2px, 1px);
            z-index: -2;
            animation: glitch-text-after 0.8s infinite;
          }

          @keyframes glitch-text-before {
            
            0% { clip-path: inset(0 0 90% 0); }
            50% { clip-path: inset(90% 0 0 0); }
            100% { clip-path: inset(0 0 90% 0); }
          }

          @keyframes glitch-text-after {
            0% { clip-path: inset(90% 0 0 0); }
            50% { clip-path: inset(0 0 90% 0); }
            100% { clip-path: inset(90% 0 0 0); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default GlitchCard
