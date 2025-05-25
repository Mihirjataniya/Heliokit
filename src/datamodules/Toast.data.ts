import ToastDemo from "@/components/heliokit/Toast/ToastDemo"

const toastJSXDemo = `ToastDemo() {
  return (
    <ToastProvider defaultDuration={3000} defaultTheme="dark" defaultPosition="bottom-center">
      <App />
    </ToastProvider>
  )
}

function App() {
  const { success, warning, error } = useToast()

  return (
    <div className="p-6 space-y-4">
      <button 
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
        onClick={() => success("This is a success toast!")}
      >
        Show Success Toast
      </button>

      <button 
        className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
        onClick={() => warning("This is a warning toast with action!", {
          action: {
            label: "Undo",
            onClick: () => alert("Action executed!")
          }
        })}
      >
        Show Warning Toast with Action
      </button>

      <button 
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
        onClick={() => error("This is a custom error toast!", {
          duration: 10000,
          position: "top-left"
        })}
      >
        Show Custom Error Toast (Top Left, 10s)
      </button>
    </div>
  )
}
`

const toastImport = `import { ToastProvider, useToast } from '@/components/Toast'`

const manualToastCode = `// NOTE: This file provides Toast context and state management only. Developers must implement their own Toast UI component using useToast().

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type ToastVariant = "success" | "info" | "warning" | "error"
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  position: ToastPosition
  duration?: number
  isExiting?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
  defaultDuration?: number
  defaultTheme?: "light" | "dark"
  defaultPosition?: ToastPosition
}

export const ToastProvider = ({
  children,
  defaultDuration = 5000,
  defaultTheme = "light",
  defaultPosition = "top-right",
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme)

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      isExiting: false,
      duration: toast.duration ?? defaultDuration,
      position: toast.position ?? defaultPosition,
    }
    setToasts(prev => [...prev, newToast])
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => removeToast(id), newToast.duration)
    }
  }, [defaultDuration, defaultPosition])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(toast => (toast.id === id ? { ...toast, isExiting: true } : toast)))
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  const clearToasts = useCallback(() => {
    setToasts(prev => prev.map(toast => ({ ...toast, isExiting: true })))
    setTimeout(() => setToasts([]), 300)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts, theme, setTheme }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}
`

export const PreviewComponent = ToastDemo
export const code = `${toastImport}
${toastJSXDemo}
}`
export const description = 'A flexible toast notification system with customizable positions, durations, themes, and actions. Easily integrates into any application.'

export const cliSteps = [
    {
        id: 1,
        title: "Add the component",
        commands: ["npx heliokit@latest add Toast"],
    },
    {
        id: 2,
        title: "Import required modules",
        codeSnippets: [
            {
                filename: "components/ExampleToast.tsx",
                language: "tsx",
                code: toastImport,
            },
        ],
    },
    {
        id: 3,
        title: "Use the ToastProvider in your App",
        codeSnippets: [
            {
                filename: "components/ExampleToast.tsx",
                language: "tsx",
                code: toastJSXDemo,
            },
        ],
    },
]

export const manualSteps = [
    {
        id: 1,
        title: "Install required dependencies",
        commands: [
            "npm install lucide-react",
        ],
    },
    {
        id: 2,
        title: "Create Toast component manually",
        codeSnippets: [
            {
                filename: "src/components/Toast.tsx",
                language: "tsx",
                code: manualToastCode,
            },
        ],
    },
    {
        id: 3,
        title: "Use the ToastProvider and useToast hook",
        codeSnippets: [
            {
                filename: "src/components/ExampleToast.tsx",
                language: "tsx",
                code: toastJSXDemo,
            },
        ],
    },
]

export const propsData = [
    {
        componentName: 'ToastPosition types',
        props: [
            {
                propName: "defaultPosition",
                description: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
                type: "",
                defaultValue: `""`,
            }
        ]
    },
    {
        componentName: "ToastProvider",
        props: [
            {
                propName: "children",
                description: "The application or components to wrap with the ToastProvider context",
                type: "ReactNode",
                defaultValue: `""`,
            },
            {
                propName: "defaultDuration",
                description: "Default duration for toasts in milliseconds",
                type: "number",
                defaultValue: `5000`,
            },
            {
                propName: "defaultTheme",
                description: "Default theme mode for toast appearance",
                type: `"light" | "dark"`,
                defaultValue: `"light"`,
            },
            {
                propName: "defaultPosition",
                description: "Default toast position on screen",
                type: "ToastPosition",
                defaultValue: `"top-right"`,
            },
        ],
    },
    {
        componentName: "Toast",
        props: [
            {
                propName: "id",
                description: "Unique identifier of the toast",
                type: "string",
                defaultValue: "—",
            },
            {
                propName: "message",
                description: "The message to display",
                type: "string",
                defaultValue: `""`,
            },
            {
                propName: "variant",
                description: "The type of the toast (visual style)",
                type: `"success" | "info" | "warning" | "error"`,
                defaultValue: `"info"`,
            },
            {
                propName: "position",
                description: "The screen position of the toast",
                type: "ToastPosition",
                defaultValue: `"top-right"`,
            },
            {
                propName: "duration",
                description: "How long the toast should be displayed",
                type: "number",
                defaultValue: "5000",
            },
            {
                propName: "action",
                description: "Optional action button with label and callback",
                type: "{ label: string; onClick: () => void }",
                defaultValue: "undefined",
            },
            {
                propName: "isExiting",
                description: "Whether the toast is in the exit animation state",
                type: "boolean",
                defaultValue: "false",
            },
        ],
    },
]
