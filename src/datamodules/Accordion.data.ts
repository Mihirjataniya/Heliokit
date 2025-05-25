import { AccordionDemo } from "@/components/heliokit/Accordion/Accordion"

const accordionJSXDemo = `
<Accordion type="single" className="w-full max-w-2xl mx-auto">
  <AccordionItem value="item-1">
    <AccordionTrigger>What makes HelioKit flexible?</AccordionTrigger>
    <AccordionContent>
      HelioKit provides composable UI primitives with consistent styling and seamless animations. Ideal for scalable design systems.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is customization easy?</AccordionTrigger>
    <AccordionContent>
      Absolutely! Every component supports theming, style overrides, and responsive variants, empowering developers to shape the UI to their needs.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Does it integrate with Tailwind CSS?</AccordionTrigger>
    <AccordionContent>
      Yes, HelioKit is built to work natively with Tailwind CSS. Enjoy rapid styling with utility-first classes, fully compatible with your workflow.
    </AccordionContent>
  </AccordionItem>
</Accordion>
`

const accordionImport = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion'`


const manualAccordionCode = `import React, { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const AccordionContext = createContext({ openItems: [], toggleItem: () => {}, allowMultiple: false })

export const Accordion = ({ children, type = 'single', className }) => {
  const [openItems, setOpenItems] = useState([])
  const toggleItem = (id) => {
    if (type === 'multiple') {
      setOpenItems((prev) => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    } else {
      setOpenItems((prev) => prev.includes(id) ? [] : [id])
    }
  }
  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple: type === 'multiple' }}>
      <div className={\`space-y-2 \${className}\`}>{children}</div>
    </AccordionContext.Provider>
  )
}

export const AccordionItem = ({ children, value }) => {
  const { openItems } = useContext(AccordionContext)
  const isOpen = openItems.includes(value)
  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-900">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { isOpen, value }) : child
      )}
    </div>
  )
}

export const AccordionTrigger = ({ children, value, isOpen }) => {
  const { toggleItem } = useContext(AccordionContext)
  return (
    <button
      onClick={() => toggleItem(value)}
      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800 transition-colors duration-200"
    >
      <h3 className="text-zinc-100 font-medium">{children}</h3>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-zinc-400">
        <ChevronDown size={18} />
      </motion.div>
    </button>
  )
}

export const AccordionContent = ({ children, isOpen }) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 border-t border-zinc-800 text-zinc-300 text-sm">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
)`

export const PreviewComponent = AccordionDemo
export const code = `${accordionImport}\n\nexport function AccordionDemo() {\n  return (${accordionJSXDemo})\n}`
export const description = 'Interactive headings that toggle the display of their content panels. Useful for showing related information without overwhelming the interface.'

export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit add Accordion"],
  },
  {
    id: 2,
    title: "Import required modules",
    codeSnippets: [
      {
        filename: "components/ExampleAccordion.tsx",
        language: "tsx",
        code: accordionImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the Accordion component",
    codeSnippets: [
      {
        filename: "components/ExampleAccordion.tsx",
        language: "tsx",
        code: accordionJSXDemo,
      },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: "Install required dependencies",
    commands: [
      "npm install framer-motion lucide-react",
    ],
  },
  {
    id: 2,
    title: "Create Accordion component manually",
    codeSnippets: [
      {
        filename: "src/components/Accordion.tsx",
        language: "tsx",
        code: manualAccordionCode,
      },
    ],
  },
  {
    id: 3,
    title: "Use the Accordion component in your code",
    codeSnippets: [
      {
        filename: "src/components/ExampleAccordion.tsx",
        language: "tsx",
        code: accordionJSXDemo,
      },
    ],
  },
]


export const propsData  = [
  {
    componentName: "Accordion",
    props: [
      {
        propName: "type",
        description: "Controls whether only one item or multiple items can be open at once",
        type: `"single" | "multiple"`,
        defaultValue: `"single"`,
      },
      {
        propName: "className",
        description: "Optional CSS classes for styling the Accordion container",
        type: "string",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "AccordionItem",
    props: [
      {
        propName: "value",
        description: "Unique identifier for the Accordion item",
        type: "string",
        defaultValue: `""`,
      },
    ],
  },
  {
    componentName: "AccordionTrigger",
    props: [
      {
        propName: "children",
        description: "Trigger label content",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "value",
        description: "Associated Accordion item value (optional, inferred from AccordionItem)",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "isOpen",
        description: "Whether the item is open (controlled by Accordion context)",
        type: "boolean",
        defaultValue: `"false"`,
      },
    ],
  },
  {
    componentName: "AccordionContent",
    props: [
      {
        propName: "children",
        description: "Content to display when the item is expanded",
        type: "ReactNode",
        defaultValue: `""`,
      },
      {
        propName: "value",
        description: "Associated Accordion item value (optional, inferred from AccordionItem)",
        type: "string",
        defaultValue: `""`,
      },
      {
        propName: "isOpen",
        description: "Whether the content is visible (controlled by Accordion context)",
        type: "boolean",
        defaultValue: `"false"`,
      },
    ],
  },
]