import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import formatCode from "@/utils/FormatCode"
import type { RootState } from '@/store'
import { useSelector } from "react-redux"

export function CodeandPreview() {
    const code = useSelector((state: RootState) => state.component.currentComponentData?.code)
    const PreviewComponent = useSelector((state: RootState) => state.component.currentComponentData?.preview)

    const [activeTab, setActiveTab] = useState("preview")
    const [formatted, setFormatted] = useState("")

    useEffect(() => {
        if (!code) return
        formatCode(code, "tsx").then(res => {
            setFormatted(res)
        })
    }, [code])

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
        <div className="w-full mx-auto bg-background-primary border border-border-primary rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-primary bg-background-primary ">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="border-b border-border-primary">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`px-6  py-3 text-sm font-medium transition-colors ${activeTab === "preview" ? "bg-gradient-to-b from-purple-700 to-blue-600 " : "text-gray-400 hover:text-gray-300"
                            }`}
                    >
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "code" ? "bg-gradient-to-b from-purple-700 to-blue-600 " : "text-gray-400 hover:text-gray-300"
                            }`}
                    >
                        Code
                    </button>
                </div>
            </div>

            <div className={`${activeTab === "preview" ? "block" : "hidden"} p-6 bg-background-primary`}>
                <div className="flex items-center justify-center min-h-[400px] bg-background-primary rounded-lg">
                     {PreviewComponent ? <PreviewComponent /> : null}
                </div>
            </div>


            <div className={`${activeTab === "code" ? "block" : "hidden"} bg-background-primary`}>
                <div className="relative syntax-scroll">
                    {formatted && (
                        <SyntaxHighlighter
                            language="tsx"
                            style={transparentTheme}
                            wrapLongLines
                            customStyle={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                overflowX: "auto",
                                padding: 12,
                                borderRadius: 8,
                                fontSize: 14,
                                lineHeight: 1.6,
                                background: "transparent",
                            }}
                        >
                            {formatted}
                        </SyntaxHighlighter>
                    )}
                </div>
            </div>
        </div>
    )
}
