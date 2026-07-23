import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

// ─────────────────────────────────────────────
// Internal: Animated Number
// ─────────────────────────────────────────────
const CounterNumber = ({ mv, number, height }: { mv: any, number: number, height: number }) => {
    const y = useTransform(mv, (latest: number) => {
        const offset = number - (latest % 10)
        const shortest = ((offset + 15) % 10) - 5
        return shortest * height
    })

    return (
        <motion.span
            className="absolute inset-0 flex items-center justify-center drop-shadow-sm"
            style={{ y }}
        >
            {number}
        </motion.span>
    )
}

// ─────────────────────────────────────────────
// Internal: Digit Block
// ─────────────────────────────────────────────
const CounterDigit = ({
    targetValue,
    index,
    delay,
    speed,
    damping,
    height,
    width,
    fontSize,
    theme,
    isActive,
    onStart,
    onComplete,
    className = ""
}: {
    targetValue: number,
    index: number,
    delay: number,
    speed: number,
    damping: number,
    height: number,
    width: number,
    fontSize: number,
    theme: "dark" | "light" | "neon",
    isActive: boolean,
    onStart: () => void,
    onComplete: () => void,
    className?: string
}) => {
    const [scrollIndex, setScrollIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const animatedValue = useSpring(0, { stiffness: speed, damping })

    useEffect(() => {
        const current = scrollIndex % 10
        const forward = (targetValue - current + 10) % 10
        const backward = (current - targetValue + 10) % 10
        const goForward = forward <= backward
        const nextIndex = scrollIndex + (goForward ? forward : -backward)

        if (nextIndex !== scrollIndex) {
            const start = () => {
                setIsAnimating(true)
                onStart()
                setScrollIndex(nextIndex)
                animatedValue.set(nextIndex)

                const duration = (1000 / speed) * damping * 1.5
                const timer = setTimeout(() => {
                    setIsAnimating(false)
                    onComplete()
                }, duration)

                return () => clearTimeout(timer)
            }

            if (delay > 0) {
                const delayTimer = setTimeout(start, delay)
                return () => clearTimeout(delayTimer)
            } else {
                return start()
            }
        }
    }, [targetValue])

    const themeStyles = {
        dark: `bg-gradient-to-br from-gray-900 to-gray-800 text-white 
      shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(60,60,60,0.2)] 
      border border-white/5 before:absolute before:inset-x-0 before:top-0 before:h-[35%] 
      before:bg-gradient-to-b before:from-white/8 before:to-transparent 
      before:rounded-t-xl before:pointer-events-none
      ${isActive || isAnimating ? 'shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(60,60,60,0.2),0_0_30px_rgba(59,130,246,0.3)] border-blue-500/20 scale-105' : ''}`,

        light: `bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800
  shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]
  border border-gray-300
  before:absolute before:inset-x-0 before:top-0 before:h-[30%]
  before:bg-gradient-to-b before:from-white/30 before:to-transparent
  before:rounded-t-xl before:pointer-events-none
  ${isActive || isAnimating ? 'ring-2 ring-blue-300/30 scale-105 transition' : ''}
`,

        neon: `bg-gradient-to-br from-gray-950 to-gray-900 text-cyan-400 
      shadow-[inset_8px_8px_16px_rgba(0,0,0,0.9),inset_-8px_-8px_16px_rgba(40,40,40,0.1),0_0_20px_rgba(6,182,212,0.2)] 
      border border-cyan-400/30 
      ${isActive || isAnimating ? 'shadow-[inset_8px_8px_16px_rgba(0,0,0,0.9),inset_-8px_-8px_16px_rgba(40,40,40,0.1),0_0_40px_rgba(6,182,212,0.4)] text-cyan-300' : ''}`
    }

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden rounded-xl font-bold tabular-nums transition-all duration-300 ease-out ${themeStyles[theme]} ${className}`}
            style={{ height, width, fontSize }}
        >
            {Array.from({ length: 11 }, (_, i) => (
                <CounterNumber key={i} mv={animatedValue} number={i % 10} height={height} />
            ))}
        </div>
    )
}

// ─────────────────────────────────────────────
// Main: Counter
// ─────────────────────────────────────────────
export interface CounterProps {
    value: number
    digits?: number
    fontSize?: number
    digitWidth?: number
    digitHeight?: number
    gap?: number
    sequentialDelay?: number
    animationSpeed?: number
    animationDamping?: number
    containerClassName?: string
    theme?: "dark" | "light" | "neon"
    mode?: "counter" | "clock" | "timer"
    onAnimationComplete?: () => void
}

export const Counter = ({
    value,
    digits = 6,
    fontSize = 32,
    digitWidth = 56,
    digitHeight = 72,
    gap = 12,
    sequentialDelay = 300,
    animationSpeed = 60,
    animationDamping = 20,
    containerClassName = "",
    theme = "dark",
    mode = "counter",
    onAnimationComplete
}: CounterProps) => {
    const [completed, setCompleted] = useState<Set<number>>(new Set())
    const [animating, setAnimating] = useState<Set<number>>(new Set())

    const digitArray = Array.from({ length: digits }, (_, i) => {
        const place = Math.pow(10, digits - 1 - i)
        return Math.floor(value / place) % 10
    })

    const getDelay = (i: number) => mode === "counter" ? (digits - 1 - i) * sequentialDelay : 0

    const handleStart = (i: number) => setAnimating(prev => new Set(prev).add(i))
    const handleComplete = (i: number) => {
        setAnimating(prev => {
            const updated = new Set(prev)
            updated.delete(i)
            return updated
        })
        setCompleted(prev => {
            const updated = new Set(prev).add(i)
            if (updated.size === digits) onAnimationComplete?.()
            return updated
        })
    }

    useEffect(() => {
        setAnimating(new Set())
        setCompleted(new Set())
    }, [value])

    const containerThemes = {
        dark: `bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 shadow-[20px_20px_40px_rgba(0,0,0,0.8),-20px_-20px_40px_rgba(60,60,60,0.1)] hover:shadow-[25px_25px_50px_rgba(0,0,0,0.9),-25px_-25px_50px_rgba(60,60,60,0.15)]`,
        light: `bg-white text-gray-900 border border-gray-200 shadow-md hover:shadow-lg transition-all`,
        neon: `bg-gradient-to-br from-black to-gray-900 border border-cyan-400/20 shadow-[20px_20px_40px_rgba(0,0,0,0.9),-20px_-20px_40px_rgba(30,30,30,0.1),0_0_50px_rgba(6,182,212,0.1)] hover:shadow-[25px_25px_50px_rgba(0,0,0,0.95),-25px_-25px_50px_rgba(30,30,30,0.15),0_0_80px_rgba(6,182,212,0.2)]`
    }

    return (
        <div
            className={`inline-flex items-center p-8 rounded-3xl relative transition-all duration-300 ease-out hover:-translate-y-0.5 ${containerThemes[theme]} ${containerClassName}`}
            style={{ gap }}
        >
            {digitArray.map((val, i) => (
                <CounterDigit
                    key={i}
                    index={i}
                    targetValue={val}
                    delay={getDelay(i)}
                    speed={animationSpeed}
                    damping={animationDamping}
                    height={digitHeight}
                    width={digitWidth}
                    fontSize={fontSize}
                    theme={theme}
                    isActive={animating.has(i)}
                    onStart={() => handleStart(i)}
                    onComplete={() => handleComplete(i)}
                />
            ))}
        </div>
    )
}
