import { useEffect, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AccordionDemo } from "../heliokit/Accordion/Accordion"
import formatCode from "@/utils/FormatCode"

export function CodeandPreview() {
    const code = `
    import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion'

    export function AccordionDemo() {
      return (
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
      )
    }`

    const [activeTab, setActiveTab] = useState("preview")
    const [formatted, setFormatted] = useState("")

    useEffect(() => {
        formatCode(code, "tsx").then(res => {
            console.log("Formatted code:", res)
            setFormatted(res)
        })
    }, [])

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
        <div className="w-full max-w-6xl mx-auto bg-background-primary border border-border-primary rounded-lg shadow-lg overflow-hidden">
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
                    <AccordionDemo />
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
