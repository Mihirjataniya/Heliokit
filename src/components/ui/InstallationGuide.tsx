import { useState } from "react"
import { Copy, Check, Terminal, FileText } from "lucide-react"
import { cliSteps, manualSteps } from "./data/installation-data"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function InstallationGuide() {
    const [activeTab, setActiveTab] = useState<"cli" | "manual">("cli")
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

    const currentSteps = activeTab === "cli" ? cliSteps : manualSteps

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedItems((prev) => new Set(prev).add(id))
            setTimeout(() => {
                setCopiedItems((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(id)
                    return newSet
                })
            }, 2000)
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    const transparentTheme = {
        ...oneDark,
        'pre[class*="language-"]': {
            ...oneDark['pre[class*="language-"]'],
            background: 'transparent',
        },
        'code[class*="language-"]': {
            ...oneDark['code[class*="language-"]'],
            background: 'transparent',
        },
    }

    return (
        <div className="min-h-screen w-full font-primary bg-background-primary">
            {/* Tabs */}
            <div className="mb-6">
                <div className="flex space-x-1 bg-background-primary p-1 rounded-lg border border-border-primary">
                    <button
                        onClick={() => setActiveTab("cli")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === "cli"
                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                            }`}
                    >
                        <Terminal className="w-4 h-4" />
                        <span>CLI Installation</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("manual")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${activeTab === "manual"
                                ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Manual Installation</span>
                    </button>
                </div>
            </div>

            {/* Steps */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>

                <div className="relative bg-background-primary backdrop-blur-sm border border-border-primary rounded-2xl p-4 md:p-8">
                    <div className="space-y-10">
                        {currentSteps.map((step, index) => (
                            <div key={step.id} className="relative group flex flex-col md:flex-row md:items-start">
                                {/* Connector Line */}
                                {index < currentSteps.length - 1 && (
                                    <div className="hidden md:block absolute left-1/2 md:left-6 transform -translate-x-1/2 w-px bg-gradient-to-b from-blue-500/80 via-purple-500/40 to-gray-600/60 shadow-lg"
                                        style={{ height: 'calc(100% + 40px)' }}></div>
                                )}

                                {/* Step Circle */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 w-10 h-full md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-30"></div>
                                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-400/30">
                                        <span className="text-white font-bold text-base md:text-lg">{step.id}</span>
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div className="flex-1 min-w-0 mt-2 md:mt-0 md:ml-4">
                                    <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <div className="w-8 md:w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-2 md:mb-3"></div>

                                    {/* Commands */}
                                    {step.commands && (
                                        <div className="space-y-4 mb-4">
                                            {step.commands.map((cmd, idx) => (
                                                <div key={idx} className="relative">
                                                    <div className="flex items-center justify-between bg-gray-800/60 p-3 rounded-md border border-gray-700">
                                                        <span className="font-mono text-green-400 text-sm">{cmd}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(cmd, `cmd-${step.id}-${idx}`)}
                                                            className="p-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                                                        >
                                                            {copiedItems.has(`cmd-${step.id}-${idx}`) ? (
                                                                <Check className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4 text-text-primary" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Code Snippets */}
                                    {step.codeSnippets && step.codeSnippets.map((snippet, snipIdx) => (
                                        <div key={snipIdx} className="mt-4 syntax-scroll">
                                            <h4 className="text-sm text-text-primary/80 mb-2">{snippet.filename}</h4>
                                            <div className="rounded-lg overflow-x-auto border border-gray-700 relative">
                                                <button
                                                    onClick={() => copyToClipboard(snippet.code, `code-${step.id}-${snipIdx}`)}
                                                    className="p-2 rounded absolute top-2 right-2 cursor-pointer"
                                                >
                                                    {copiedItems.has(`code-${step.id}-${snipIdx}`) ? (
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-text-primary" />
                                                    )}
                                                </button>

                                                <SyntaxHighlighter
                                                    language={snippet.language}
                                                    style={transparentTheme}
                                                    customStyle={{
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                        padding: 12,
                                                        fontSize: 14,
                                                        lineHeight: 1.6,
                                                        background: "transparent",
                                                        minWidth: "100%",
                                                    }}
                                                >
                                                    {snippet.code}
                                                </SyntaxHighlighter>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
