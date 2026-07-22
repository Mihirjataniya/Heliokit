import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Terminal, Info, AlertTriangle, Lightbulb } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

/**
 * DocKit — shared building blocks for HelioKit documentation pages.
 * Plain TSX (no MDX): each doc page composes these primitives. Mono theme,
 * tokens (`text-primary` / `border-primary` / `background-primary`) so docs
 * track the light/dark class like the rest of the site.
 */

/** SyntaxHighlighter with a transparent background so it sits on the page bg. */
const transparentTheme = {
    ...oneDark,
    'pre[class*="language-"]': { ...oneDark['pre[class*="language-"]'], background: 'transparent' },
    'code[class*="language-"]': { ...oneDark['code[class*="language-"]'], background: 'transparent' },
}

const useCopy = () => {
    const [copied, setCopied] = useState(false)
    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }
    return { copied, copy }
}

/* ── Page scaffold ─────────────────────────────────────────────────────── */

export const DocPage: React.FC<{ eyebrow?: string; title: string; lead?: string; children: React.ReactNode }> = ({
    eyebrow,
    title,
    lead,
    children,
}) => (
    <article className="font-primary text-text-primary pb-24">
        <header className="mb-10">
            {eyebrow && (
                <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">{eyebrow}</span>
            )}
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">{title}</h1>
            {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-primary/65">{lead}</p>}
        </header>
        {children}
    </article>
)

/* ── Prose ─────────────────────────────────────────────────────────────── */

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="mt-12 mb-3 font-heading text-2xl font-semibold tracking-tight">{children}</h2>
)

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="mt-8 mb-2 font-heading text-lg font-semibold">{children}</h3>
)

export const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="my-4 max-w-2xl text-[15px] leading-7 text-text-primary/75">{children}</p>
)

export const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="rounded-md border border-border-primary bg-text-primary/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-text-primary">
        {children}
    </code>
)

export const UL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ul className="my-4 max-w-2xl list-disc space-y-2 pl-6 text-[15px] leading-7 text-text-primary/75 marker:text-text-primary/40">
        {children}
    </ul>
)

export const LI: React.FC<{ children: React.ReactNode }> = ({ children }) => <li>{children}</li>

/* ── Code & command blocks ─────────────────────────────────────────────── */

/** Multi-line source block with copy button. */
export const CodeBlock: React.FC<{ code: string; language?: string; filename?: string }> = ({
    code,
    language = 'tsx',
    filename,
}) => {
    const { copied, copy } = useCopy()
    return (
        <div className="my-5">
            {filename && <div className="mb-2 font-mono text-xs text-text-primary/55">{filename}</div>}
            <div className="syntax-scroll relative overflow-x-auto rounded-xl border border-border-primary bg-text-primary/[0.03]">
                <button
                    onClick={() => copy(code)}
                    className="absolute right-2 top-2 z-10 rounded-md p-2 text-text-primary/70 transition hover:bg-text-primary/10 hover:text-text-primary"
                    aria-label="Copy code"
                >
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <SyntaxHighlighter
                    language={language}
                    style={transparentTheme}
                    customStyle={{
                        whiteSpace: 'pre',
                        padding: 16,
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        background: 'transparent',
                        margin: 0,
                        minWidth: '100%',
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}

/** Single terminal command, monospace + copy. */
export const CommandBlock: React.FC<{ command: string }> = ({ command }) => {
    const { copied, copy } = useCopy()
    return (
        <div className="my-5 flex items-center justify-between gap-3 rounded-xl border border-border-primary bg-text-primary/[0.03] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
                <Terminal className="h-4 w-4 shrink-0 text-text-primary/40" />
                <span className="truncate font-mono text-sm text-text-primary/90">{command}</span>
            </div>
            <button
                onClick={() => copy(command)}
                className="shrink-0 rounded-md p-2 text-text-primary/70 transition hover:bg-text-primary/10 hover:text-text-primary"
                aria-label="Copy command"
            >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
        </div>
    )
}

/* ── Callout ───────────────────────────────────────────────────────────── */

const CALLOUT = {
    note: { Icon: Info, ring: 'border-border-primary' },
    tip: { Icon: Lightbulb, ring: 'border-border-primary' },
    warning: { Icon: AlertTriangle, ring: 'border-border-primary' },
} as const

export const Callout: React.FC<{ type?: keyof typeof CALLOUT; title?: string; children: React.ReactNode }> = ({
    type = 'note',
    title,
    children,
}) => {
    const { Icon, ring } = CALLOUT[type]
    return (
        <div className={`my-6 flex max-w-2xl gap-3 rounded-xl border ${ring} bg-text-primary/[0.04] p-4`}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-text-primary/60" />
            <div className="min-w-0 text-[15px] leading-7 text-text-primary/75">
                {title && <div className="mb-0.5 font-heading font-semibold text-text-primary">{title}</div>}
                {children}
            </div>
        </div>
    )
}

/* ── Steps ─────────────────────────────────────────────────────────────── */

export const Steps: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ol className="my-6 space-y-8 border-l border-border-primary pl-8">{children}</ol>
)

export const Step: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <li className="relative">
        <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border border-border-primary bg-background-primary text-[10px] text-text-primary/60">
            ●
        </span>
        <h3 className="font-heading text-base font-semibold text-text-primary">{title}</h3>
        <div className="mt-1">{children}</div>
    </li>
)

/* ── Next / prev page footer link ──────────────────────────────────────── */

export const DocNav: React.FC<{ prev?: { to: string; title: string }; next?: { to: string; title: string } }> = ({
    prev,
    next,
}) => (
    <div className="mt-16 flex items-center justify-between gap-4 border-t border-border-primary pt-6">
        {prev ? (
            <Link to={prev.to} className="group flex flex-col text-left">
                <span className="text-xs uppercase tracking-wide text-text-primary/40">Previous</span>
                <span className="font-heading text-text-primary/80 transition group-hover:text-text-primary">{prev.title}</span>
            </Link>
        ) : (
            <span />
        )}
        {next ? (
            <Link to={next.to} className="group flex flex-col text-right">
                <span className="text-xs uppercase tracking-wide text-text-primary/40">Next</span>
                <span className="font-heading text-text-primary/80 transition group-hover:text-text-primary">{next.title}</span>
            </Link>
        ) : (
            <span />
        )}
    </div>
)
