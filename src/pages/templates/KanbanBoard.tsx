import React, { useEffect, useMemo, useRef, useState } from 'react'

const css = (s: string): React.CSSProperties => {
    const out: Record<string, string> = {}
    for (const decl of s.split(';')) {
        const i = decl.indexOf(':')
        if (i < 0) continue
        const key = decl.slice(0, i).trim()
        const val = decl.slice(i + 1).trim()
        if (!key) continue
        const camel = key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
        out[camel] = val
    }
    return out as React.CSSProperties
}

/* ── seeded PRNG (mulberry32) so the board renders identically every time ── */
function makeRng(seed: number) {
    let a = seed >>> 0
    return function () {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/* Monochrome palette — neutral greys + a near-white accent. No hues. */
const ACC = '#e0e0e0'

/* Due dates are stored as a day-offset from "today" so the seeded board is
 * deterministic; the modal converts to/from a real ISO date for the picker. */
const DAY = 86400000
const TODAY = Date.UTC(2026, 5, 29)
const pad = (n: number) => String(n).padStart(2, '0')
const isoFromOffset = (off: number) => {
    const d = new Date(TODAY + off * DAY)
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate())
}
const offsetFromIso = (s: string) => {
    const p = s.split('-').map(Number)
    if (p.length < 3 || p.some(isNaN)) return 0
    return Math.round((Date.UTC(p[0], p[1] - 1, p[2]) - TODAY) / DAY)
}

export type Member = { id: number; name: string; initials: string; shade: string }
export type Label = { id: number; name: string }
export type Column = { id: string; title: string; wip?: number }
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low'
export type Card = {
    id: number
    title: string
    labels: number[]
    assignee: number
    priority: Priority
    points: number
    due: number          // day offset from today; negative = overdue
    comments: number
    attach: number
    done: number
    total: number
    col: string
}

const DEFAULT_MEMBERS: Member[] = [
    { id: 0, name: 'Ava Chen', initials: 'AC', shade: '#4a515f' },
    { id: 1, name: 'Marco Diaz', initials: 'MD', shade: '#3a4150' },
    { id: 2, name: 'Priya Nair', initials: 'PN', shade: '#545b69' },
    { id: 3, name: 'Sam Okoye', initials: 'SO', shade: '#2c3340' },
    { id: 4, name: 'Lena Voss', initials: 'LV', shade: '#5c6472' },
]

const DEFAULT_LABELS: Label[] = [
    { id: 0, name: 'Frontend' },
    { id: 1, name: 'Backend' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Bug' },
    { id: 4, name: 'Research' },
    { id: 5, name: 'Infra' },
]

const DEFAULT_COLUMNS: Column[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'In Progress', wip: 4 },
    { id: 'review', title: 'In Review', wip: 3 },
    { id: 'done', title: 'Done' },
]

const DEFAULT_PRIORITIES: Priority[] = ['Urgent', 'High', 'Medium', 'Low']

const TITLES = [
    'Wire up OAuth refresh-token rotation', 'Empty-state illustrations for dashboard',
    'Migrate billing tables to Postgres 16', 'Fix flaky checkout E2E on CI',
    'Design tokens: dark-mode contrast pass', 'Spike: edge caching for asset CDN',
    'Onboarding wizard step transitions', 'Reduce cold-start on auth lambda',
    'Audit log retention policy', 'Keyboard nav for command palette',
    'Skeleton loaders on slow connections', 'Rate-limit the public search API',
    'Refactor toast queue to a store', 'Investigate memory leak in chart view',
    'Localize date formatting (i18n)', 'Webhook retry with exponential backoff',
    'Accessibility: focus traps in modals', 'Compress hero textures to AVIF',
    'Add seat-based pricing to checkout', 'Telemetry for feature adoption',
    'Sticky table headers on scroll', 'Drag-to-reorder for saved views',
]

function buildCards(): Card[] {
    const r = makeRng(20260629)
    const colWeights: [string, number][] = [['backlog', 7], ['todo', 5], ['doing', 4], ['review', 3], ['done', 5]]
    const cards: Card[] = []
    let id = 1
    let ti = 0
    for (const [col, count] of colWeights) {
        for (let k = 0; k < count; k++) {
            const total = r() < 0.55 ? 2 + Math.floor(r() * 6) : 0
            const done = col === 'done' ? total : Math.floor(r() * (total + 1))
            cards.push({
                id: id++,
                title: TITLES[ti++ % TITLES.length],
                labels: r() < 0.3 ? [Math.floor(r() * DEFAULT_LABELS.length), Math.floor(r() * DEFAULT_LABELS.length)] : [Math.floor(r() * DEFAULT_LABELS.length)],
                assignee: Math.floor(r() * DEFAULT_MEMBERS.length),
                priority: col === 'done' ? 'Low' : DEFAULT_PRIORITIES[Math.floor(r() * (r() < 0.4 ? 2 : 4))],
                points: [1, 2, 3, 5, 8][Math.floor(r() * 5)],
                due: col === 'done' ? 0 : Math.floor(r() * 16) - 4,
                comments: r() < 0.6 ? 1 + Math.floor(r() * 7) : 0,
                attach: r() < 0.4 ? 1 + Math.floor(r() * 3) : 0,
                done,
                total,
                col,
            })
        }
    }
    return cards
}

const dueText = (d: number) => {
    if (d < 0) return { text: Math.abs(d) + 'd overdue', urgent: true }
    if (d === 0) return { text: 'Due today', urgent: true }
    if (d === 1) return { text: 'Due tomorrow', soon: true }
    return { text: 'Due in ' + d + 'd', soon: d <= 3 }
}

/* native <select> with a chevron, dark + monochrome */
const Select = ({ label, value, onChange, children }: { label: string; value: string | number; onChange: (v: string) => void; children: React.ReactNode }) => (
    <label style={css('display:flex;flex-direction:column;gap:6px')}>
        <span style={css('font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:#7c8597;font-weight:500')}>{label}</span>
        <span style={css('position:relative;display:block')}>
            <select value={value} onChange={(e) => onChange(e.target.value)}
                style={css("appearance:none;width:100%;background:#11141a;border:1px solid rgba(255,255,255,0.12);border-radius:9px;color:#e8ecf4;padding:9px 32px 9px 11px;font-size:13px;font-family:'Space Grotesk',sans-serif;cursor:pointer;outline:none;color-scheme:dark")}>
                {children}
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.4" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="m6 9 6 6 6-6" /></svg>
        </span>
    </label>
)

type Draft = { editingId: number | null; title: string; priority: Priority; assignee: number; label: number; points: number; due: number; col: string }
const EMPTY_DRAFT: Draft = { editingId: null, title: '', priority: 'Medium', assignee: 0, label: 0, points: 2, due: 7, col: 'todo' }

export type KanbanData = {
    /** Cards on the board. Omit to seed the built-in demo set. */
    cards?: Card[]
    members?: Member[]
    labels?: Label[]
    columns?: Column[]
    priorities?: Priority[]
}

export type KanbanBoardProps = {
    /** Feed your own board data. Any field omitted falls back to the demo set. */
    data?: KanbanData
    /** Fires on every card change (add / edit / drag) — wire to your API or store. */
    onCardsChange?: (cards: Card[]) => void
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ data, onCardsChange }) => {
    /* Props drive the board; each field falls back to the demo data when omitted,
     * so <KanbanBoard /> with no props still renders the full showcase. */
    const MEMBERS = data?.members ?? DEFAULT_MEMBERS
    const LABELS = data?.labels ?? DEFAULT_LABELS
    const COLUMNS = data?.columns ?? DEFAULT_COLUMNS
    const PRIORITIES = data?.priorities ?? DEFAULT_PRIORITIES

    /* Look up by id, not array index — custom data may have gaps or reordering.
     * Fall back to a placeholder so a stray id never crashes the board. */
    const FALLBACK_MEMBER: Member = { id: -1, name: 'Unassigned', initials: '—', shade: '#2c3340' }
    const FALLBACK_LABEL: Label = { id: -1, name: 'Uncategorized' }
    const memberById = (id: number) => MEMBERS.find((m) => m.id === id) ?? FALLBACK_MEMBER
    const labelById = (id: number) => LABELS.find((l) => l.id === id) ?? FALLBACK_LABEL

    const [cards, setCards] = useState<Card[]>(() => data?.cards ?? buildCards())

    /* Notify the consumer whenever cards change, but skip the initial mount. */
    const mounted = useRef(false)
    useEffect(() => {
        if (!mounted.current) { mounted.current = true; return }
        onCardsChange?.(cards)
    }, [cards, onCardsChange])
    const [query, setQuery] = useState('')
    const [activeMembers, setActiveMembers] = useState<number[]>([])
    const [dragId, setDragId] = useState<number | null>(null)
    const [overCol, setOverCol] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
    const nextId = useMemo(() => Math.max(0, ...cards.map((c) => c.id)) + 1, [cards])

    const q = query.trim().toLowerCase()
    const matches = (c: Card) => {
        if (q && !c.title.toLowerCase().includes(q)) return false
        if (activeMembers.length && !activeMembers.includes(c.assignee)) return false
        return true
    }

    const toggleMember = (id: number) =>
        setActiveMembers((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))

    const onDrop = (col: string) => {
        if (dragId == null) return
        setCards((cs) => cs.map((c) => (c.id === dragId ? { ...c, col } : c)))
        setDragId(null)
        setOverCol(null)
    }

    const openModal = (col: string) => { setDraft({ ...EMPTY_DRAFT, col }); setModalOpen(true) }
    const openEdit = (c: Card) => {
        setDraft({ editingId: c.id, title: c.title, priority: c.priority, assignee: c.assignee, label: c.labels[0] ?? 0, points: c.points, due: c.due, col: c.col })
        setModalOpen(true)
    }
    const submit = () => {
        const title = draft.title.trim()
        if (!title) return
        if (draft.editingId != null) {
            const id = draft.editingId
            setCards((cs) => cs.map((c) => (c.id === id
                ? { ...c, title, labels: [draft.label], assignee: draft.assignee, priority: draft.priority, points: draft.points, due: draft.due, col: draft.col }
                : c)))
        } else {
            setCards((cs) => [
                ...cs,
                { id: nextId, title, labels: [draft.label], assignee: draft.assignee, priority: draft.priority, points: draft.points, due: draft.due, comments: 0, attach: 0, done: 0, total: 0, col: draft.col },
            ])
        }
        setModalOpen(false)
        setDraft(EMPTY_DRAFT)
    }

    const total = cards.length
    const doneCount = cards.filter((c) => c.col === 'done').length
    const progress = total ? Math.round((doneCount / total) * 100) : 0

    return (
        <div style={{ fontFamily: "'Space Grotesk',system-ui,sans-serif", color: '#e8ecf4', background: '#060708', WebkitFontSmoothing: 'antialiased' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
                .kb-cols::-webkit-scrollbar{height:10px;}
                .kb-col-body::-webkit-scrollbar{width:8px;}
                .kb-cols::-webkit-scrollbar-thumb,.kb-col-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:5px;}
                .kb-cols::-webkit-scrollbar-track,.kb-col-body::-webkit-scrollbar-track{background:transparent;}
                .kb-card{transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease;}
                .kb-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,0.2)!important;box-shadow:0 8px 24px rgba(0,0,0,0.4);}
                .kb-card:active{cursor:grabbing;}
                .kb-edit{opacity:0;transition:opacity .12s ease,color .12s ease,border-color .12s ease;}
                .kb-card:hover .kb-edit{opacity:1;}
                .kb-edit:hover{color:#e8ecf4!important;border-color:rgba(255,255,255,0.25)!important;}
                .kb-add:hover{border-color:rgba(255,255,255,0.28)!important;color:#cdd5e3!important;}
                .kb-search::placeholder{color:#565d69;}
                .kb-overlay{animation:kbFade .14s ease;}
                .kb-modal{animation:kbRise .18s cubic-bezier(.4,0,.2,1);}
                @keyframes kbFade{from{opacity:0}to{opacity:1}}
                @keyframes kbRise{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
                @media (max-width:720px){.kb-root{padding:18px 14px 40px!important;}.kb-modal-grid{grid-template-columns:1fr!important;}}
            `}</style>

            <div className="kb-root" style={css('min-height:100vh;background:radial-gradient(1200px 480px at 78% -14%, rgba(255,255,255,0.05), transparent 56%);padding:26px 30px 56px;display:flex;flex-direction:column')}>

                {/* top bar */}
                <div style={css('display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:22px')}>
                    <div style={css('display:flex;align-items:center;gap:12px')}>
                        <svg width="27" height="27" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="2" fill="#e0e0e0" /><rect x="14" y="3" width="7" height="11" rx="2" fill="#6b7280" /></svg>
                        <div style={css('display:flex;flex-direction:column;line-height:1.12')}>
                            <span style={css('font-size:15px;font-weight:600;letter-spacing:-0.01em')}>Helio Tasks</span>
                            <span style={css('font-size:10px;color:#6b7280;font-weight:500;letter-spacing:0.1em;text-transform:uppercase')}>Sprint 24 · Web Platform</span>
                        </div>
                    </div>
                    <div style={css('display:flex;align-items:center;gap:8px')}>
                        {MEMBERS.map((m) => {
                            const on = activeMembers.includes(m.id)
                            return (
                                <button key={m.id} title={m.name} onClick={() => toggleMember(m.id)}
                                    style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '50%' }}>
                                    <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#dfe3ea', background: m.shade, border: on ? '2px solid #e0e0e0' : '2px solid transparent', opacity: activeMembers.length && !on ? 0.4 : 1, transition: 'all .15s' }}>{m.initials}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* title + controls */}
                <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:18px')}>
                    <div>
                        <h1 style={css('margin:0;font-size:27px;font-weight:600;letter-spacing:-0.025em')}>Engineering Board</h1>
                        <div style={css("margin-top:7px;display:flex;align-items:center;gap:12px;font-size:12.5px;color:#8b93a3;font-family:'JetBrains Mono',monospace")}>
                            <span>{total} tasks</span>
                            <span style={css('color:#454c58')}>·</span>
                            <span>{doneCount} done</span>
                            <span style={css('width:120px;height:6px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden;display:inline-block')}>
                                <span style={{ display: 'block', height: '100%', width: progress + '%', background: ACC, borderRadius: 3, transition: 'width .3s' }} />
                            </span>
                            <span style={css('color:#cdd5e3')}>{progress}%</span>
                        </div>
                    </div>
                    <div style={css('display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
                        <div style={css('display:flex;align-items:center;gap:8px;background:#0d0f13;border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:8px 12px')}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#565d69" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
                            <input className="kb-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…"
                                style={css("background:transparent;border:none;outline:none;color:#e8ecf4;font-size:13px;font-family:'Space Grotesk',sans-serif;width:160px")} />
                        </div>
                        {(activeMembers.length > 0 || q) && (
                            <button onClick={() => { setActiveMembers([]); setQuery('') }}
                                style={css("padding:8px 13px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#8b93a3;font-size:12.5px;font-weight:500;cursor:pointer;font-family:'Space Grotesk',sans-serif")}>Clear filters</button>
                        )}
                        <button onClick={() => openModal('todo')}
                            style={css("display:flex;align-items:center;gap:6px;padding:8px 15px;border-radius:10px;border:none;background:#e0e0e0;color:#0b0d11;font-size:12.5px;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif")}>+ New task</button>
                    </div>
                </div>

                {/* board */}
                <div className="kb-cols" style={css('display:flex;gap:16px;overflow-x:auto;padding-bottom:14px;flex:1;min-width:0;align-items:flex-start')}>
                    {COLUMNS.map((col) => {
                        const colCards = cards.filter((c) => c.col === col.id && matches(c))
                        const allInCol = cards.filter((c) => c.col === col.id)
                        const pts = colCards.reduce((s, c) => s + c.points, 0)
                        const overLimit = col.wip != null && allInCol.length > col.wip
                        const isOver = overCol === col.id
                        return (
                            <div key={col.id}
                                onDragOver={(e) => { e.preventDefault(); if (overCol !== col.id) setOverCol(col.id) }}
                                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol((o) => (o === col.id ? null : o)) }}
                                onDrop={() => onDrop(col.id)}
                                style={{ ...css('flex:1 1 0;min-width:230px;background:#0a0c10;border:1px solid rgba(255,255,255,0.07);border-radius:15px;padding:13px 11px;display:flex;flex-direction:column;max-height:100%'), borderColor: isOver ? ACC : 'rgba(255,255,255,0.07)', background: isOver ? 'rgba(255,255,255,0.04)' : '#0a0c10' }}>

                                {/* column header */}
                                <div style={css('display:flex;align-items:center;justify-content:space-between;padding:2px 5px 11px;margin-bottom:3px;border-bottom:1px solid rgba(255,255,255,0.05)')}>
                                    <div style={css('display:flex;align-items:center;gap:8px')}>
                                        <span style={css('font-size:13px;font-weight:600;color:#e8ecf4')}>{col.title}</span>
                                        <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 20, fontFamily: "'JetBrains Mono',monospace", color: overLimit ? '#f4f6fb' : '#8b93a3', background: overLimit ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)' }}>
                                            {allInCol.length}{col.wip != null ? '/' + col.wip : ''}
                                        </span>
                                    </div>
                                    <span style={css("font-size:11px;color:#565d69;font-family:'JetBrains Mono',monospace")}>{pts} pts</span>
                                </div>

                                {/* cards */}
                                <div className="kb-col-body" style={css('display:flex;flex-direction:column;gap:11px;overflow-y:auto;padding:4px 4px 4px;min-height:8px')}>
                                    {colCards.map((c) => {
                                        const m = memberById(c.assignee)
                                        const du = dueText(c.due)
                                        const dragging = dragId === c.id
                                        // Only the title is bright. Meta sits one clear tier down; overdue
                                        // gets a touch more light, nothing else competes with the title.
                                        const dueColor = du.urgent ? '#aab1bf' : '#565d69'
                                        return (
                                            <div key={c.id} className="kb-card" draggable title={c.priority + ' priority'}
                                                onDragStart={() => setDragId(c.id)}
                                                onDragEnd={() => { setDragId(null); setOverCol(null) }}
                                                style={{ ...css('position:relative;overflow:hidden;background:#0f1217;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:13px 14px 12px;cursor:grab;display:flex;flex-direction:column;gap:8px'), opacity: dragging ? 0.4 : 1 }}>

                                                {/* edit button — appears on hover */}
                                                <button className="kb-edit" title="Edit task"
                                                    onClick={(e) => { e.stopPropagation(); openEdit(c) }}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    style={{ position: 'absolute', top: 9, right: 9, padding: 4, lineHeight: 0, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: '#15181e', color: '#8b93a3', cursor: 'pointer' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                                </button>

                                                {/* category + priority eyebrow — quiet */}
                                                <span style={css('font-size:9.5px;text-transform:uppercase;letter-spacing:0.1em;color:#565d69;font-weight:600')}>{labelById(c.labels[0]).name} · {c.priority}</span>

                                                {/* title — the single focal point */}
                                                <span style={css('font-size:13.5px;font-weight:500;line-height:1.45;color:#f4f6fb')}>{c.title}</span>

                                                {/* meta — one quiet row */}
                                                <div style={css('display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:1px')}>
                                                    <span style={{ color: dueColor, fontSize: 10.5, fontFamily: "'JetBrains Mono',monospace" }}>{du.text}</span>
                                                    <div style={css('display:flex;align-items:center;gap:10px')}>
                                                        {c.comments > 0 && <span style={css("display:flex;align-items:center;gap:3px;font-size:10.5px;color:#565d69;font-family:'JetBrains Mono',monospace")}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#565d69" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>{c.comments}</span>}
                                                        {c.attach > 0 && <span style={css("display:flex;align-items:center;gap:3px;font-size:10.5px;color:#565d69;font-family:'JetBrains Mono',monospace")}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#565d69" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>{c.attach}</span>}
                                                        <span title={m.name} style={{ width: 21, height: 21, borderRadius: '50%', background: m.shade, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: '#aab1bf' }}>{m.initials}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <button className="kb-add" onClick={() => openModal(col.id)}
                                        style={css("margin-top:2px;padding:10px;border-radius:10px;border:1px dashed rgba(255,255,255,0.1);background:transparent;color:#565d69;font-size:12.5px;font-weight:500;cursor:pointer;text-align:left;font-family:'Space Grotesk',sans-serif;transition:all .15s")}>+ Add task</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Add Task modal ──────────────────────────────────────────── */}
            {modalOpen && (
                <div className="kb-overlay" onClick={() => setModalOpen(false)}
                    style={css('position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,6,8,0.72);backdrop-filter:blur(4px)')}>
                    <div className="kb-modal" onClick={(e) => e.stopPropagation()}
                        style={css('width:100%;max-width:460px;background:#0d0f13;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.5)')}>

                        <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
                            <h2 style={css('margin:0;font-size:17px;font-weight:600;letter-spacing:-0.01em')}>{draft.editingId != null ? 'Edit task' : 'New task'}</h2>
                            <button onClick={() => setModalOpen(false)} style={css('background:transparent;border:none;color:#8b93a3;cursor:pointer;padding:2px;line-height:0')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* title */}
                        <label style={css('display:flex;flex-direction:column;gap:6px;margin-bottom:14px')}>
                            <span style={css('font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:#7c8597;font-weight:500')}>Title</span>
                            <input autoFocus value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setModalOpen(false) }}
                                placeholder="What needs doing?"
                                style={css("background:#11141a;border:1px solid rgba(255,255,255,0.12);border-radius:9px;color:#e8ecf4;padding:10px 12px;font-size:13.5px;font-family:'Space Grotesk',sans-serif;outline:none")} />
                        </label>

                        {/* dropdown grid */}
                        <div className="kb-modal-grid" style={css('display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:14px')}>
                            <Select label="Status" value={draft.col} onChange={(v) => setDraft((d) => ({ ...d, col: v }))}>
                                {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </Select>
                            <Select label="Priority" value={draft.priority} onChange={(v) => setDraft((d) => ({ ...d, priority: v as Priority }))}>
                                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                            </Select>
                            <Select label="Assignee" value={draft.assignee} onChange={(v) => setDraft((d) => ({ ...d, assignee: Number(v) }))}>
                                {MEMBERS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                            <Select label="Category" value={draft.label} onChange={(v) => setDraft((d) => ({ ...d, label: Number(v) }))}>
                                {LABELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </Select>
                            <Select label="Story points" value={draft.points} onChange={(v) => setDraft((d) => ({ ...d, points: Number(v) }))}>
                                {[1, 2, 3, 5, 8, 13].map((p) => <option key={p} value={p}>{p} pts</option>)}
                            </Select>
                            <label style={css('display:flex;flex-direction:column;gap:6px')}>
                                <span style={css('font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;color:#7c8597;font-weight:500')}>Due date</span>
                                <input type="date" value={isoFromOffset(draft.due)} onChange={(e) => setDraft((d) => ({ ...d, due: offsetFromIso(e.target.value) }))}
                                    style={css("background:#11141a;border:1px solid rgba(255,255,255,0.12);border-radius:9px;color:#e8ecf4;padding:8px 11px;font-size:13px;font-family:'JetBrains Mono',monospace;color-scheme:dark;outline:none")} />
                            </label>
                        </div>

                        {/* footer */}
                        <div style={css('display:flex;justify-content:flex-end;gap:9px;margin-top:6px')}>
                            <button onClick={() => setModalOpen(false)} style={css("padding:9px 16px;border-radius:9px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:#cdd5e3;font-size:13px;font-weight:500;cursor:pointer;font-family:'Space Grotesk',sans-serif")}>Cancel</button>
                            <button onClick={submit} disabled={!draft.title.trim()}
                                style={{ ...css("padding:9px 18px;border-radius:9px;border:none;font-size:13px;font-weight:600;font-family:'Space Grotesk',sans-serif"), background: draft.title.trim() ? '#e0e0e0' : 'rgba(255,255,255,0.12)', color: draft.title.trim() ? '#0b0d11' : '#6b7280', cursor: draft.title.trim() ? 'pointer' : 'not-allowed' }}>{draft.editingId != null ? 'Save changes' : 'Add task'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default KanbanBoard
