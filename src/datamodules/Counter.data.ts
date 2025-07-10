import CounterDemo  from "@/components/heliokit/counter/CounterDemo"

const counterJSXDemo = `
<Counter value={123} digits={3} theme="dark" mode="counter" fontSize={48} digitWidth={64} digitHeight={80} />
`

const counterImport = `import { Counter } from '@/components/Counter'`

const manualCounterCode = `
import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

// ... Full code omitted here for brevity, include your full Counter component implementation
`

export const PreviewComponent = CounterDemo
export const code = `import { Counter } from '@/components/Counter

export function CounterDemo() {
  return <Counter value={123} digits={3} theme="dark" mode="counter" fontSize={48} digitWidth={64} digitHeight={80} />
}
`

export const description = 'Animated numeric counter component for displaying digits in various modes such as counters, clocks, and timers. Each digit scrolls smoothly using Framer Motion.'

export const cliSteps = [
  {
    id: 1,
    title: "Add the component",
    commands: ["npx heliokit@latest add counter"],
  },
  {
    id: 2,
    title: "Import required modules",
    codeSnippets: [
      {
        filename: "components/ExampleCounter.tsx",
        language: "tsx",
        code: counterImport,
      },
    ],
  },
  {
    id: 3,
    title: "Use the Counter component",
    codeSnippets: [
      {
        filename: "components/ExampleCounter.tsx",
        language: "tsx",
        code: counterJSXDemo,
      },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: "Install required dependencies",
    commands: ["npm install framer-motion"],
  },
  {
    id: 2,
    title: "Create Counter component manually",
    codeSnippets: [
      {
        filename: "src/components/Counter.tsx",
        language: "tsx",
        code: manualCounterCode,
      },
    ],
  },
  {
    id: 3,
    title: "Use the Counter component in your code",
    codeSnippets: [
      {
        filename: "src/components/ExampleCounter.tsx",
        language: "tsx",
        code: counterJSXDemo,
      },
    ],
  },
]

export const propsData = [
  {
    componentName: "Counter",
    props: [
      {
        propName: "value",
        description: "Numeric value to display using animated digits",
        type: "number",
        defaultValue: "0",
      },
      {
        propName: "digits",
        description: "Number of digits to display (e.g., 6-digit clock)",
        type: "number",
        defaultValue: "6",
      },
      {
        propName: "fontSize",
        description: "Font size of the digits",
        type: "number",
        defaultValue: "32",
      },
      {
        propName: "digitWidth",
        description: "Width of each digit box",
        type: "number",
        defaultValue: "56",
      },
      {
        propName: "digitHeight",
        description: "Height of each digit box",
        type: "number",
        defaultValue: "72",
      },
      {
        propName: "gap",
        description: "Gap between digits",
        type: "number",
        defaultValue: "12",
      },
      {
        propName: "sequentialDelay",
        description: "Delay between digit animations when mode is 'counter'",
        type: "number",
        defaultValue: "300",
      },
      {
        propName: "animationSpeed",
        description: "Spring stiffness for animation",
        type: "number",
        defaultValue: "60",
      },
      {
        propName: "animationDamping",
        description: "Spring damping for animation",
        type: "number",
        defaultValue: "20",
      },
      {
        propName: "containerClassName",
        description: "Custom CSS class for the counter container",
        type: "string",
        defaultValue: ``,
      },
      {
        propName: "theme",
        description: "Visual style of the digits",
        type: `"dark" | "light" | "neon"`,
        defaultValue: `"dark"`,
      },
      {
        propName: "mode",
        description: "Behavior mode: 'counter' (delayed), 'clock' or 'timer'",
        type: `"counter" | "clock" | "timer"`,
        defaultValue: `"counter"`,
      },
      {
        propName: "onAnimationComplete",
        description: "Callback fired once all digit animations are complete",
        type: "() => void",
        defaultValue: "undefined",
      },
    ],
  },
]
