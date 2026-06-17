import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useAnimationFrame,AnimatePresence  } from "framer-motion";
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
  const [singleSetWidth, setSingleSetWidth] = useState(0)

  // Convert children to array to count words
  const childrenArray = React.Children.toArray(children);
  const wordsCount = childrenArray.length;

  useEffect(() => {
    if (trackRef.current) {
      const singleChild = trackRef.current.children[0] as HTMLElement
      if (singleChild) {
        let totalWidth = 0
        for (let i = 0; i < wordsCount; i++) {
          const child = trackRef.current.children[i] as HTMLElement
          if (child) {
            totalWidth += child.offsetWidth
          }
        }
        setSingleSetWidth(totalWidth)
      }
    }
  }, [wordsCount])

  useAnimationFrame(() => {
    if (singleSetWidth > 0) {
      const directionMultiplier = direction === 'left' ? -1 : 1;
      baseX.set(baseX.get() + (speed * directionMultiplier))
    }
  })

  const x = useTransform(baseX, (value) => {
    if (singleSetWidth === 0) return 0
    if (direction === 'left') {
      return value % -singleSetWidth
    } else {
      return value % singleSetWidth
    }
  })

  // Create duplicated children for seamless scrolling
  const duplicatedChildren = [...childrenArray, ...childrenArray, ...childrenArray, ...childrenArray]

  return (
    <div className={`w-full border-b-2 border-white relative     ${className}`}>
      <motion.div ref={trackRef} className="flex whitespace-nowrap will-change-transform" style={{ x }}>
        {duplicatedChildren.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<any>, { 
              key: `${index}`,
             ...(child.props as any)
            })
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


