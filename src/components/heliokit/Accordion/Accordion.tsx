import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

const Accordion = ({ items, allowMultiple = false, className = "" }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  const isOpen = (id: string) => openItems.includes(id)

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-900">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800 transition-colors duration-200"
          >
            <h3 className="text-zinc-100 font-medium">{item.title}</h3>
            <motion.div
              animate={{ rotate: isOpen(item.id) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-zinc-400"
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 border-t border-zinc-800 text-zinc-300 text-sm">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// Demo component
export function AccordionPreview() {
  const accordionItems = [
    {
      id: "item-1",
      title: "System Architecture",
      content:
        "Modular system design with distributed processing nodes. Optimized for performance and scalability across multiple environments.",
    },
    {
      id: "item-2",
      title: "Security Protocol",
      content:
        "End-to-end encryption with multi-factor authentication. Regular security audits ensure data integrity and protection.",
    },
    {
      id: "item-3",
      title: "Performance Metrics",
      content:
        "99.9% uptime with sub-millisecond response times. Load balancing algorithms distribute traffic efficiently.",
    },
    {
      id: "item-4",
      title: "Integration Options",
      content:
        "RESTful API endpoints with comprehensive documentation. Supports OAuth 2.0 and custom authentication methods.",
    },
  ]

  return (
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-xl font-medium text-zinc-100 mb-4">System Specifications</h2>
        <Accordion items={accordionItems} />
      </div>
  )
}
