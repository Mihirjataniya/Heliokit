import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import './Toast.css'
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
    // Helper functions
    success: (message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => void
    error: (message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => void
    info: (message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => void
    warning: (message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
    children: React.ReactNode
    defaultDuration?: number
    defaultTheme?: "light" | "dark"
    defaultPosition?: ToastPosition
}

export function ToastProvider({
    children,
    defaultDuration = 5000,
    defaultTheme = "light",
    defaultPosition = "top-right"
}: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [theme, setTheme] = useState<"light" | "dark">(defaultTheme)

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = {
            ...toast,
            id,
            isExiting: false,
            duration: toast.duration ?? defaultDuration,
            position: toast.position ?? defaultPosition
        }

        setToasts((prev) => [...prev, newToast])

        // Auto-dismiss after duration
        const duration = newToast.duration
        if (duration && duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }, [defaultDuration, defaultPosition])

    const removeToast = useCallback((id: string) => {
        // First mark as exiting
        setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)))

        // Then remove after animation
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 300)
    }, [])

    const clearToasts = useCallback(() => {
        // Mark all as exiting first
        setToasts((prev) => prev.map((toast) => ({ ...toast, isExiting: true })))

        // Then clear all after animation
        setTimeout(() => {
            setToasts([])
        }, 300)
    }, [])

    // Helper functions
    const success = useCallback((message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => {
        addToast({
            message,
            variant: "success",
            duration: options?.duration,
            position: options?.position || defaultPosition,
            action: options?.action
        })
    }, [addToast, defaultPosition])

    const error = useCallback((message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => {
        addToast({
            message,
            variant: "error",
            duration: options?.duration,
            position: options?.position || defaultPosition,
            action: options?.action
        })
    }, [addToast, defaultPosition])

    const info = useCallback((message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => {
        addToast({
            message,
            variant: "info",
            duration: options?.duration,
            position: options?.position || defaultPosition,
            action: options?.action
        })
    }, [addToast, defaultPosition])

    const warning = useCallback((message: string, options?: { duration?: number; position?: ToastPosition; action?: Toast['action'] }) => {
        addToast({
            message,
            variant: "warning",
            duration: options?.duration,
            position: options?.position || defaultPosition,
            action: options?.action
        })
    }, [addToast, defaultPosition])

    return (
        <ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            clearToasts,
            theme,
            setTheme,
            success,
            error,
            info,
            warning
        }}>
            <div>
                {children}
                <ToastContainer toasts={toasts} onRemove={removeToast} theme={theme} />
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

function ToastContainer({
    toasts,
    onRemove,
    theme,
}: { toasts: Toast[]; onRemove: (id: string) => void; theme: "light" | "dark" }) {
    // Group toasts by position
    const toastsByPosition = toasts.reduce(
        (acc, toast) => {
            if (!acc[toast.position]) {
                acc[toast.position] = []
            }
            acc[toast.position].push(toast)
            return acc
        },
        {} as Record<ToastPosition, Toast[]>,
    )

    const getPositionClasses = (position: ToastPosition) => {
        const baseClasses = "fixed z-50 flex flex-col gap-3 p-4 pointer-events-none"

        switch (position) {
            case "top-left":
                return `${baseClasses} top-0 left-0`
            case "top-center":
                return `${baseClasses} top-0 left-1/2 transform -translate-x-1/2`
            case "top-right":
                return `${baseClasses} top-0 right-0`
            case "bottom-left":
                return `${baseClasses} bottom-0 left-0`
            case "bottom-center":
                return `${baseClasses} bottom-0 left-1/2 transform -translate-x-1/2`
            case "bottom-right":
                return `${baseClasses} bottom-0 right-0`
            default:
                return `${baseClasses} top-0 right-0`
        }
    }

    return (
        <>
            {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
                <div key={position} className={getPositionClasses(position as ToastPosition)}>
                    {positionToasts.map((toast) => (
                        <ToastComponent key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} theme={theme} />
                    ))}
                </div>
            ))}
        </>
    )
}

import { CheckCircle, Info, AlertTriangle, XCircle, X, Zap, Ban } from "lucide-react"

function ToastComponent({ toast, onRemove, theme }: { toast: Toast; onRemove: () => void; theme: "light" | "dark" }) {
    const getAccentColor = (variant: ToastVariant, theme: "light" | "dark") => {
        const colors = {
            success: theme === "dark" ? "rgba(74,222,128,0.8)" : "rgba(34,197,94,1)",
            info: theme === "dark" ? "rgba(96,165,250,0.8)" : "rgba(59,130,246,1)",
            warning: theme === "dark" ? "rgba(250,204,21,0.8)" : "rgba(202,138,4,1)",
            error: theme === "dark" ? "rgba(248,113,113,0.8)" : "rgba(220,38,38,1)",
            default: theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(100,116,139,0.6)", // neutral fallback
        }

        return colors[variant] || colors.default
    }

    const getVariantStyles = (variant: ToastVariant) => {
        if (theme === "dark") {
            switch (variant) {
                case "success":
                    return "bg-[#060606] text-white border-green-400 shadow-[0_8px_30px_-4px_rgba(74,222,128,0.5)]"
                case "info":
                    return "bg-[#060606] text-white border-blue-400 shadow-[0_8px_30px_-4px_rgba(96,165,250,0.5)]"
                case "warning":
                    return "bg-[#060606] text-white border-yellow-400 shadow-[0_8px_30px_-4px_rgba(250,204,21,0.5)]"
                case "error":
                    return "bg-[#060606] text-white border-red-400 shadow-[0_8px_30px_-4px_rgba(248,50,50,0.5)]"
                default:
                    return "bg-[#060606] text-white border-gray-400 shadow-[0_8px_30px_-4px_rgba(100,116,139,0.2)]"
            }
        } else {
            switch (variant) {
                case "success":
                    return "bg-white text-green-900 border-green-400 shadow-[0_8px_30px_-4px_rgba(74,222,128,0.5)]"

                case "info":
                    return "bg-white text-blue-900 border-blue-400 shadow-[0_8px_30px_-4px_rgba(96,165,250,0.5)]"

                case "warning":
                    return "bg-white text-yellow-900 border-yellow-400 shadow-[0_8px_30px_-4px_rgba(250,204,21,0.5)]"

                case "error":
                    return "bg-white text-red-900 border-red-400 shadow-[0_8px_30px_-4px_rgba(248,113,113,0.5)]"

                default:
                    return "bg-white text-gray-900 border-gray-400 shadow-[0_8px_30px_-4px_rgba(100,116,139,0.2)]" // Slate-500
            }
        }
    }

    const getIcon = (variant: ToastVariant) => {
          const iconClass = "w-5 h-5 flex-shrink-0"

        switch (variant) {
            case "success":
                return <CheckCircle className={`text-rgba(74,222,128,0.8) ${iconClass}`} />
            case "info":
                return <Info className={`text-rgba(96,165,250,0.8) ${iconClass}`} />
            case "warning":
                return <AlertTriangle className={`text-rgba(250,204,21,0.5) ${iconClass}`} />
            case "error":
                return <Ban className={`text-rgba(248,113,113,0.5) ${iconClass}`} />
            default:
                return <Info className={`text-rgba(96,165,250,0.8) ${iconClass}`} />
        }
    }

    return (
        <div
            className={`
            ${getVariantStyles(toast.variant)}
            ${toast.isExiting ? "toast-exit" : "toast-enter"}
            pointer-events-auto
            min-w-80 max-w-md w-full sm:w-auto
            p-4 rounded-xl border-2
            backdrop-blur-sm
            shadow-2xl
            transform transition-all duration-300 ease-out
            hover:scale-105
            relative overflow-hidden
        `}
        >
            <div className="flex items-center gap-3">
                <div className="mt-0.5">{getIcon(toast.variant)}</div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-relaxed break-words">{toast.message}</p>

                    {toast.action && (
                        <button
                            onClick={toast.action.onClick}
                            className="mt-3 cursor-pointer px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5"
                            style={{
                                color: theme === "dark" ? "#fff" : "#000",
                                backgroundColor: theme === "dark"
                                    ? "rgba(99, 102, 241, 0.15)"  // indigo-500 with 15% opacity
                                    : "rgba(99, 102, 241, 0.1)",

                                border: `1px solid rgba(99, 102, 241, 0.3)`,  // consistent border
                            }}
                        >
                            <Zap className="w-3 h-3" />
                            {toast.action.label}
                        </button>
                    )}

                </div>

                <button
                    onClick={onRemove}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${theme === 'dark'
                        ? 'text-white/70 hover:text-white hover:bg-white/20'
                        : 'text-zinc-700 hover:text-black hover:bg-black/10'
                        }`}

                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1 overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-300/50'}`}>
                <div
                    className="h-full animate-progress"
                    style={{
                        backgroundColor: getAccentColor(toast.variant, theme),
                        animationDuration: `${toast.duration || 5000}ms`,
                        animationTimingFunction: 'linear',
                    }}
                ></div>
            </div>

        </div>
    )
}