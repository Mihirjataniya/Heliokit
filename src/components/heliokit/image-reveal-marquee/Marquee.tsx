import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from "framer-motion";
import type { ReactNode, ReactElement } from 'react'

const MarqueeContext = createContext<{
  direction: 'left' | 'right';
  fontSize: string;
  speed: number;
}>({
  direction: 'left',
  fontSize: 'text-8xl',
  speed: 4,
})


interface MarqueeProps {
  children: ReactNode
  direction?: 'left' | 'right'
  fontSize?: 'text-4xl' | 'text-5xl' | 'text-6xl' | 'text-7xl' | 'text-8xl' | 'text-9xl'
  speed?: number
  className?: string
}

export const Marquee = ({ 
  children, 
  direction = 'left', 
  fontSize = 'text-8xl', 
  speed = 4,
  className 
}: MarqueeProps) => {
  return (
    <MarqueeContext.Provider value={{ direction, fontSize, speed }}>
        <div className={` ${className}`}>
        {children}
      </div>
    </MarqueeContext.Provider>
  )
}



interface MarqueeTrackProps {
  children: ReactNode
  className?: string
}

export const MarqueeTrack = ({ children, className }: MarqueeTrackProps) => {
  const { direction, speed } = useContext(MarqueeContext);
  const trackRef = useRef<HTMLDivElement>(null)
  const baseX = useMotionValue(0)
  // Width of one (non-duplicated) set of words — the seamless-wrap distance.
  const [singleSetWidth, setSingleSetWidth] = useState(0)
  // Pause the scroll while a word is hovered so the reveal target stays still.
  const pausedRef = useRef(false)

  const childrenArray = React.Children.toArray(children);
  const wordsCount = childrenArray.length;

  // Measure the first set, then RE-measure after fonts load and on resize.
  // (Measuring only on mount uses fallback-font widths; once the web font swaps
  //  in, the real width is larger and the wrap point drifts → periodic jumps.)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      // Width of one set = distance from the first word to the first word of the
      // next (duplicated) set. Using offsetLeft includes the words' mx-6 margins,
      // which summing offsetWidth would miss → wrong wrap point / visible gaps.
      const first = el.children[0] as HTMLElement | undefined
      const nextSet = el.children[wordsCount] as HTMLElement | undefined
      if (first && nextSet) {
        const total = nextSet.offsetLeft - first.offsetLeft
        if (total > 0) setSingleSetWidth(total)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready?.then(measure).catch(() => { })
    return () => ro.disconnect()
  }, [wordsCount])

  // Delta-time motion (frame-rate independent) with the wrap folded into baseX,
  // so the rendered transform is always within one set width → seamless, no modulo jump.
  useAnimationFrame((_, delta) => {
    if (pausedRef.current || singleSetWidth <= 0) return
    const dir = direction === 'left' ? -1 : 1
    const step = dir * speed * (Math.min(delta, 50) / 16.6667)
    let next = baseX.get() + step
    // Keep the transform within [-singleSetWidth, 0] for BOTH directions. The
    // duplicated sets all sit to the right (x = 0…N·set), so a positive offset
    // would expose an empty gap on the left — the right-moving row drifting away.
    if (next <= -singleSetWidth) next += singleSetWidth
    else if (next > 0) next -= singleSetWidth
    baseX.set(next)
  })

  // Enough copies to always cover the viewport while one set scrolls out.
  const duplicatedChildren = [...childrenArray, ...childrenArray, ...childrenArray, ...childrenArray]

  return (
    <div
      className={`w-full border-b-2 border-white relative ${className ?? ''}`}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <motion.div ref={trackRef} className="flex whitespace-nowrap will-change-transform" style={{ x: baseX }}>
        {duplicatedChildren.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement, { key: `${index}` })
          }
          return child
        })}
      </motion.div>
    </div>
  )
}

export interface MarqueeWordProps {
  text: string;
  image: string;
  alt?: string;
  imageWidth?: number;
  imageHeight?: number;
  offset?: number;
}

export const MarqueeWord = ({
  text,
  image,
  alt,
  imageWidth = 240,
  imageHeight = 150,
  offset = 10
}: MarqueeWordProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { fontSize } = useContext(MarqueeContext);
  
  return (
    <span className="relative inline-block">
      <span
        className={`cursor-pointer text-white font-bold ${fontSize} uppercase mx-6 whitespace-nowrap decoration-white hover:decoration-gray-300 transition`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-50 bg-white rounded-lg shadow-xl pointer-events-none"
            style={{
              left: "20%",
              bottom: `${offset - (-80)}px`,
              transform: "translateX(-50%)",
              width: `${imageWidth}px`
            }}
            initial={{ 
              scale: 0,
              opacity: 0,
              y: 10
            }}
            animate={{ 
              scale: 1,
              opacity: 1,
              y: 0
            }}
            exit={{ 
              scale: 0,
              opacity: 0,
              y: -10
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.5
            }}
          >
            <motion.img
              src={image}
              alt={alt}
              className="object-cover w-full rounded-lg"
              style={{ height: `${imageHeight}px` }}
              loading="lazy"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};


