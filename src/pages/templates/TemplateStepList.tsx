import React, { useState } from 'react'
import { Copy, Check, Terminal, FileText } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'
import type { TemplateSteps, TemplateStep } from './templateSteps'

/**
 * Props-driven step renderer for template integration — CLI / Manual tabs with
 * copyable commands and collapsible code blocks. Mirrors the component-docs
 * installation guide visually, but takes steps directly (no Redux).
 */

const transparentTheme = {
    ...oneDark,
    'pre[class*="language-"]': { ...oneDark['pre[class*="language-"]'], background: 'transparent' },
    'code[class*="language-"]': { ...oneDark['code[class*="language-"]'], background: 'transparent' },
}

const StepBlock: React.FC<{ step: TemplateStep; copied: Set<string>; copy: (t: string, id: string) => void; full: Record<string, boolean>; setFull: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; last: boolean }> = ({ step, copied, copy, full, setFull, last }) => (
    <div className="relative flex flex-col md:flex-row md:items-start">
        {!last && <div className="absolute left-5 top-10 hidden w-px bg-border-primary md:block" style={{ height: 'calc(100% + 16px)' }} />}
        <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-primary bg-text-primary/5 font-mono text-sm font-bold text-text-primary">
            {step.id}
        </div>
        <div className="mt-2 min-w-0 flex-1 md:ml-4 md:mt-0">
            <h3 className="font-heading text-base font-semibold text-text-primary md:text-lg">{step.title}</h3>

            {step.commands && (
                <div className="mt-3 space-y-2">
                    {step.commands.map((cmd, i) => {
                        const id = `cmd-${step.id}-${i}`
                        return (
                            <div key={i} className="flex items-center justify-between rounded-md border border-border-primary bg-text-primary/[0.03] p-3">
                                <span className="font-mono text-sm text-emerald-400">{cmd}</span>
                                <button onClick={() => copy(cmd, id)} className="rounded p-1.5 hover:bg-text-primary/10">
                                    {copied.has(id) ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-text-primary/70" />}
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {step.codeSnippets?.map((snip, si) => {
                const lines = snip.code.split('\n')
                const long = lines.length > 14
                const key = `code-${step.id}-${si}`
                const shown = long && !full[key] ? lines.slice(0, 14).join('\n') + '\n// …' : snip.code
                return (
                    <div key={si} className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs text-text-primary/60">{snip.filename}</span>
                            <button onClick={() => copy(snip.code, key)} className="rounded p-1.5 hover:bg-text-primary/10">
                                {copied.has(key) ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-text-primary/70" />}
                            </button>
                        </div>
                        <div className="syntax-scroll overflow-x-auto rounded-lg border border-border-primary">
                            <SyntaxHighlighter
                                language={snip.language}
                                style={transparentTheme}
                                customStyle={{ margin: 0, padding: 12, fontSize: 13, lineHeight: 1.6, background: 'transparent', minWidth: '100%' }}
                            >
                                {shown}
                            </SyntaxHighlighter>
                        </div>
                        {long && (
                            <button
                                onClick={() => setFull((p) => ({ ...p, [key]: !p[key] }))}
                                className="mt-2 rounded-full border border-border-primary px-3 py-1 text-xs text-text-primary/70 hover:bg-text-primary/5"
                            >
                                {full[key] ? 'Hide code' : 'Show full code'}
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    </div>
)

const TemplateStepList: React.FC<{ steps: TemplateSteps }> = ({ steps }) => {
    const [tab, setTab] = useState<'cli' | 'manual'>('cli')
    const [copied, setCopied] = useState<Set<string>>(new Set())
    const [full, setFull] = useState<Record<string, boolean>>({})

    const copy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied((p) => new Set(p).add(id))
            setTimeout(() => setCopied((p) => { const n = new Set(p); n.delete(id); return n }), 2000)
        } catch (err) {
            console.error('Copy failed', err)
        }
    }

    const current = tab === 'cli' ? steps.cli : steps.manual

    return (
        <div className="w-full font-primary">
            <h2 className="font-heading text-2xl font-bold text-text-primary">Integration</h2>
            <p className="mt-1 text-sm text-text-primary/65">Drop this page into your own project.</p>

            <div className="mt-5 inline-flex gap-1 rounded-lg border border-border-primary p-1">
                <button
                    onClick={() => setTab('cli')}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition ${tab === 'cli' ? 'bg-text-primary/10 text-text-primary' : 'text-text-primary/55 hover:text-text-primary'}`}
                >
                    <Terminal className="h-4 w-4" /> CLI
                </button>
                <button
                    onClick={() => setTab('manual')}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition ${tab === 'manual' ? 'bg-text-primary/10 text-text-primary' : 'text-text-primary/55 hover:text-text-primary'}`}
                >
                    <FileText className="h-4 w-4" /> Manual
                </button>
            </div>

            <div className="mt-6 space-y-8 rounded-2xl border border-border-primary p-5 md:p-7">
                {current.map((step, i) => (
                    <StepBlock key={step.id} step={step} copied={copied} copy={copy} full={full} setFull={setFull} last={i === current.length - 1} />
                ))}
            </div>
        </div>
    )
}

export default TemplateStepList
