import React, { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { ReactNode, ReactElement } from 'react'

const AccordionContext = createContext<{
  openItems: string[],
  toggleItem: (id: string) => void,
  allowMultiple: boolean
}>({
  openItems: [],
  toggleItem: () => { },
  allowMultiple: false,
})

interface AccordionProps {
  children: ReactNode
  type?: 'single' | 'multiple'
  className?: string
}

export const Accordion = ({ children, type = 'single', className }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [animatingItems, setAnimatingItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    const isOpen = openItems.includes(id)

    if (type === 'multiple') {
      setOpenItems((prev) =>
        isOpen ? prev.filter((item) => item !== id) : [...prev, id]
      )
    } else {
      setOpenItems(isOpen ? [] : [id])
    }

    if (!isOpen) {
      setAnimatingItems((prev) => [...prev, id])
      setTimeout(() => {
        setAnimatingItems((prev) => prev.filter((item) => item !== id))
      }, 1000)
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple: type === 'multiple' }}>
      <div className={`space-y-3 ${className}`}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<any>, { animatingItems })
          }
          return child
        })}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  children: ReactNode
  value: string
  animatingItems?: string[]
}

export const AccordionItem = ({ children, value, animatingItems = [] }: AccordionItemProps) => {
  const { openItems } = useContext(AccordionContext)
  const isOpen = openItems.includes(value)
  const isAnimating = animatingItems.includes(value)

  return (
    <motion.div
      className="relative w-full cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none z-0"></div>

      {/* Beam animation */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`beam-gradient-${value}`} x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(168, 168, 168, 0.6)" />
                  <stop offset="25%" stopColor="rgba(192, 192, 192, 0.7)" />
                  <stop offset="50%" stopColor="rgba(211, 211, 211, 0.8)" />
                  <stop offset="75%" stopColor="rgba(192, 192, 192, 0.7)" />
                  <stop offset="100%" stopColor="rgba(168, 168, 168, 0.6)" />
                </linearGradient>
                <filter id={`glow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <motion.path
                d="M 50 100 L 0 100 L 0 0 L 50 0"
                fill="none"
                stroke={`url(#beam-gradient-${value})`}
                strokeWidth="1"
                filter={`url(#glow-${value})`}
                strokeDasharray="400"
                strokeDashoffset="400"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 50 100 L 100 100 L 100 0 L 50 0"
                fill="none"
                stroke={`url(#beam-gradient-${value})`}
                strokeWidth="1"
                filter={`url(#glow-${value})`}
                strokeDasharray="400"
                strokeDashoffset="400"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Child content */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<any>, { isOpen, value })
        }
        return child
      })}
    </motion.div>
  )
}

interface AccordionTriggerProps {
  children: ReactNode
  value?: string
  isOpen?: boolean
}

export const AccordionTrigger = ({ children, value, isOpen }: AccordionTriggerProps) => {
  const { toggleItem } = useContext(AccordionContext)

  return (
    <button
      onClick={() => toggleItem(value!)}
      className="w-full p-6 flex items-center justify-between text-left relative z-20 group"
    >
      <h3 className="text-xl font-semibold text-white group-hover:text-gray-300 transition-colors duration-300">
        {children}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-gray-300 group-hover:text-white transition-colors duration-300"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
  )
}

interface AccordionContentProps {
  children: ReactNode
  value?: string
  isOpen?: boolean
}

export const AccordionContent = ({ children, value, isOpen }: AccordionContentProps) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden relative z-20"
      >
        <div className="px-6 pb-6">
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-gray-300 leading-relaxed"
          >
            {children}
          </motion.p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)
