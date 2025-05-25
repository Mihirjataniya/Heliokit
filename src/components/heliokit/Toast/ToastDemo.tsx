import { useToast, type ToastPosition, type ToastVariant } from '@/components/heliokit/Toast/Toast'
import React, { useState } from 'react'

const ToastDemo: React.FC = () => {
    const { success, error, info, warning, clearToasts, theme, setTheme } = useToast()
    const [selectedPosition, setSelectedPosition] = useState<ToastPosition>("top-right")
    const [selectedDuration, setSelectedDuration] = useState(5000)
    const [customMessage, setCustomMessage] = useState("")

    const handleBasicToast = (type: ToastVariant) => {
        const messages = {
            success: "Operation completed successfully!",
            error: "Something went wrong. Please try again.",
            info: "Here's some useful information for you.",
            warning: "Please review your settings before proceeding."
        }

        const toastFunctions = { success, error, info, warning }
        toastFunctions[type](messages[type], {
            position: selectedPosition,
            duration: selectedDuration
        })
    }

    const handleCustomToast = (type: ToastVariant) => {
        if (!customMessage.trim()) return

        const toastFunctions = { success, error, info, warning }
        toastFunctions[type](customMessage, {
            position: selectedPosition,
            duration: selectedDuration
        })
    }

    const handleActionToast = () => {
        error("Upload failed! Would you like to retry?", {
            position: selectedPosition,
            duration: 0,
            action: {
                label: "Retry Upload",
                onClick: () => {
                    success("Retrying upload...", { position: selectedPosition })
                }
            }
        })
    }

    return (
            <div className="w-full h-full my-3 mx-auto">
                {/* Settings Section */}
                <div className="bg-background-primary rounded-lg p-6 mb-8 border border-border-primary text-text-primary">
                    <h2 className="text-xl font-semibold mb-4">Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Position Dropdown */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Position</label>
                            <select
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value as ToastPosition)}
                                className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary focus:outline-none "
                            >
                                <option value="top-left">Top Left</option>
                                <option value="top-center">Top Center</option>
                                <option value="top-right">Top Right</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-center">Bottom Center</option>
                                <option value="bottom-right">Bottom Right</option>
                            </select>
                        </div>

                        {/* Duration Dropdown */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Duration</label>
                            <select
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                                className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary focus:outline-none "
                            >
                                <option value={2000}>2 seconds</option>
                                <option value={5000}>5 seconds</option>
                                <option value={10000}>10 seconds</option>
                                <option value={0}>Manual dismiss</option>
                            </select>
                        </div>

                        {/* Theme Toggle */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Theme</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                                className="w-full bg-background-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary focus:outline-none "
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-background-primary border border-border-primary rounded-lg p-6 mb-8 text-text-primary ">
                    <h2 className="text-xl font-semibold mb-4">Basic Toasts</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => handleBasicToast("success")}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Success Toast
                        </button>
                        <button
                            onClick={() => handleBasicToast("error")}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Error Toast
                        </button>
                        <button
                            onClick={() => handleBasicToast("info")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Info Toast
                        </button>
                        <button
                            onClick={() => handleBasicToast("warning")}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Warning Toast
                        </button>
                    </div>
                </div>

                {/* Custom Message Section */}
                <div className="bg-background-primary border border-border-primary rounded-lg p-6 mb-8 text-text-primary">
                    <h2 className="text-xl font-semibold mb-4">Custom Message</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder="Enter your custom message..."
                            className="w-full bg-background-primary border border-border-primary text-text-primary rounded-lg px-3 py-2  placeholder-gray-400 focus:outline-none "
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => handleCustomToast("success")}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            disabled={!customMessage.trim()}
                        >
                            Custom Success
                        </button>
                        <button
                            onClick={() => handleCustomToast("error")}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            disabled={!customMessage.trim()}
                        >
                            Custom Error
                        </button>
                        <button
                            onClick={() => handleCustomToast("info")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            disabled={!customMessage.trim()}
                        >
                            Custom Info
                        </button>
                        <button
                            onClick={() => handleCustomToast("warning")}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            disabled={!customMessage.trim()}
                        >
                            Custom Warning
                        </button>
                    </div>
                </div>

                {/* Special Actions */}
                <div className="bg-background-primary border border-border-primary text-text-primary rounded-lg p-6 ">
                    <h2 className="text-xl font-semibold mb-4">Special Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleActionToast}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Toast with Action
                        </button>
                        <button
                            onClick={clearToasts}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Clear All Toasts
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default ToastDemo
