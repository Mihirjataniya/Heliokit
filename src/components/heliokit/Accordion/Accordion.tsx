// Accordion.tsx
import React, { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { ReactNode, ReactElement } from 'react'

const AccordionContext = createContext<{ openItems: string[], toggleItem: (id: string) => void, allowMultiple: boolean }>({
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

  const toggleItem = (id: string) => {
    if (type === 'multiple') {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple: type === 'multiple' }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  children: ReactNode
  value: string
}

export const AccordionItem = ({ children, value }: AccordionItemProps) => {
  const { openItems } = useContext(AccordionContext)
  const isOpen = openItems.includes(value)

  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-900">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<any>, { isOpen, value })
        }
        return child
      })}
    </div>
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
      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800 transition-colors duration-200"
    >
      <h3 className="text-zinc-100 font-medium">{children}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-zinc-400"
      >
        <ChevronDown size={18} />
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
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 border-t border-zinc-800 text-zinc-300 text-sm">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
)
