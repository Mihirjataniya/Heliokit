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

    import { CheckCircle, Info, AlertTriangle, XCircle, X, Zap } from "lucide-react"

    function ToastComponent({ toast, onRemove, theme }: { toast: Toast; onRemove: () => void; theme: "light" | "dark" }) {
    const getVariantStyles = (variant: ToastVariant) => {
        if (theme === "dark") {
        switch (variant) {
            case "success":
            return "bg-gradient-to-r from-emerald-600/90 to-green-600/90 border-emerald-400 shadow-emerald-500/50"
            case "info":
            return "bg-gradient-to-r from-cyan-600/90 to-blue-600/90 border-cyan-400 shadow-cyan-500/50"
            case "warning":
            return "bg-gradient-to-r from-amber-600/90 to-yellow-600/90 border-amber-400 shadow-amber-500/50"
            case "error":
            return "bg-gradient-to-r from-red-600/90 to-rose-600/90 border-red-400 shadow-red-500/50"
            default:
            return "bg-gradient-to-r from-slate-600/90 to-gray-600/90 border-slate-400 shadow-slate-500/50"
        }
        } else {
        switch (variant) {
            case "success":
            return "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-300 shadow-emerald-500/30"
            case "info":
            return "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-300 shadow-cyan-500/30"
            case "warning":
            return "bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-300 shadow-amber-500/30"
            case "error":
            return "bg-gradient-to-r from-red-500 to-rose-500 border-red-300 shadow-red-500/30"
            default:
            return "bg-gradient-to-r from-slate-500 to-gray-500 border-slate-300 shadow-slate-500/30"
        }
        }
    }

    const getIcon = (variant: ToastVariant) => {
        const iconClass = "w-5 h-5 flex-shrink-0 text-white"

        switch (variant) {
        case "success":
            return <CheckCircle className={iconClass} />
        case "info":
            return <Info className={iconClass} />
        case "warning":
            return <AlertTriangle className={iconClass} />
        case "error":
            return <XCircle className={iconClass} />
        default:
            return <Info className={iconClass} />
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
        <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(toast.variant)}</div>

            <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-relaxed break-words">{toast.message}</p>

            {toast.action && (
                <button
                onClick={toast.action.onClick}
                className="mt-3 px-3 py-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 hover:border-white/50 transition-all duration-200 flex items-center gap-1.5"
                >
                <Zap className="w-3 h-3" />
                {toast.action.label}
                </button>
            )}
            </div>

            <button
            onClick={onRemove}
            className="flex-shrink-0 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            aria-label="Close notification"
            >
            <X className="w-4 h-4" />
            </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div
            className="h-full bg-white/60 animate-progress"
            style={{
                animationDuration: `${toast.duration || 5000}ms`,
                animationTimingFunction: "linear",
            }}
            ></div>
        </div>
        </div>
    )
    }