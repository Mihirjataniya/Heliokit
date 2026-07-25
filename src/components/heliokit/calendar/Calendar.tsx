import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Plus, Trash2, X } from 'lucide-react'

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------ */

export type CalendarEventColor = 'violet' | 'sky' | 'emerald' | 'amber' | 'rose'

export interface CalendarEvent {
  id: string
  title: string
  /** Event start. Only the start day is rendered; a block is clipped at midnight. */
  start: Date
  end: Date
  color?: CalendarEventColor
  notes?: string
}

export interface CalendarProps {
  /** Controlled event list. Pair with `onEventsChange`. */
  events?: CalendarEvent[]
  /** Uncontrolled starting list. Ignored when `events` is passed. */
  defaultEvents?: CalendarEvent[]
  /** Fires on every create / edit / delete / drag, with the full next list. */
  onEventsChange?: (events: CalendarEvent[]) => void
  /** Any date inside the week to show first. */
  initialDate?: Date
  /** First hour rendered (0–23). */
  startHour?: number
  /** Last hour rendered (1–24). */
  endHour?: number
  /** Snapping granularity for drags, in minutes. */
  slotMinutes?: number
  /** Row height of one hour, in px. Drives the whole vertical scale. */
  hourHeight?: number
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1
  /** Hour the grid is scrolled to on mount. */
  scrollToHour?: number
  /** Floor width of a day column in px. Narrower viewports scroll sideways. */
  minDayWidth?: number
  className?: string
}

/** Width of the hour-label gutter. Header and grid share it. */
const GUTTER_WIDTH = 56
/** Pointer travel that turns a touch tap into a scroll gesture. */
const TAP_SLOP = 10

/* ---------------------------------------------------------------------------
 * Date helpers — kept local so the component stays dependency-free
 * ------------------------------------------------------------------------ */

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const pad = (value: number) => String(value).padStart(2, '0')

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, amount: number) => {
  const next = startOfDay(date)
  next.setDate(next.getDate() + amount)
  return next
}

const startOfWeek = (date: Date, weekStartsOn: 0 | 1) => {
  const day = startOfDay(date)
  return addDays(day, -((day.getDay() - weekStartsOn + 7) % 7))
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Minutes since midnight. */
const minutesOf = (date: Date) => date.getHours() * 60 + date.getMinutes()

const withMinutes = (day: Date, minutes: number) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minutes / 60), Math.round(minutes % 60))

const fmtTime = (minutes: number) => {
  const total = clamp(Math.round(minutes), 0, 24 * 60)
  const hour24 = Math.floor(total / 60) % 24
  const minute = total % 60
  const suffix = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return minute === 0 ? `${hour12} ${suffix}` : `${hour12}:${pad(minute)} ${suffix}`
}

const fmtRange = (from: number, to: number) => `${fmtTime(from)} – ${fmtTime(to)}`

const toTimeInput = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(Math.round(minutes % 60))}`
const fromTimeInput = (value: string) => {
  const [hour, minute] = value.split(':').map(Number)
  return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : null
}
const toDateInput = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const fromDateInput = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
    ? new Date(year, month - 1, day)
    : null
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/* ---------------------------------------------------------------------------
 * Palette — solid chips so blocks stay readable on light and dark themes
 * ------------------------------------------------------------------------ */

const COLORS: Record<CalendarEventColor, { chip: string; swatch: string; ring: string }> = {
  violet: { chip: 'bg-violet-600/90 border-violet-300/40', swatch: 'bg-violet-500', ring: 'ring-violet-400' },
  sky: { chip: 'bg-sky-600/90 border-sky-300/40', swatch: 'bg-sky-500', ring: 'ring-sky-400' },
  emerald: { chip: 'bg-emerald-600/90 border-emerald-300/40', swatch: 'bg-emerald-500', ring: 'ring-emerald-400' },
  amber: { chip: 'bg-amber-600/90 border-amber-300/40', swatch: 'bg-amber-500', ring: 'ring-amber-400' },
  rose: { chip: 'bg-rose-600/90 border-rose-300/40', swatch: 'bg-rose-500', ring: 'ring-rose-400' },
}
const COLOR_KEYS = Object.keys(COLORS) as CalendarEventColor[]

/* ---------------------------------------------------------------------------
 * Internal shapes
 * ------------------------------------------------------------------------ */

/** A pending selection, or an event being dragged, in week-local coordinates. */
interface Slot {
  day: number
  from: number
  to: number
}

interface PlacedEvent extends Slot {
  event: CalendarEvent
  lane: number
  lanes: number
}

/** Draft passed to the composer modal. `event` set means "editing". */
interface Composer extends Slot {
  event?: CalendarEvent
}

/**
 * Greedy lane packing: overlapping events form a cluster and split the column
 * width between them, so nothing is ever hidden behind another block.
 */
const packLanes = (items: (Slot & { event: CalendarEvent })[]): PlacedEvent[] => {
  const sorted = [...items].sort((a, b) => a.from - b.from || b.to - a.to)
  const placed: PlacedEvent[] = []
  let cluster: PlacedEvent[] = []
  let clusterEnd = -Infinity

  const closeCluster = () => {
    const lanes = cluster.reduce((max, item) => Math.max(max, item.lane + 1), 1)
    cluster.forEach((item) => { item.lanes = lanes })
    cluster = []
  }

  for (const item of sorted) {
    if (item.from >= clusterEnd) closeCluster()

    let lane = 0
    while (cluster.some((other) => other.lane === lane && other.to > item.from)) lane += 1

    const entry: PlacedEvent = { ...item, lane, lanes: 1 }
    cluster.push(entry)
    placed.push(entry)
    clusterEnd = Math.max(clusterEnd, item.to)
  }

  closeCluster()
  return placed
}

const uid = () => `evt-${Math.random().toString(36).slice(2, 9)}`

/* ---------------------------------------------------------------------------
 * Calendar
 * ------------------------------------------------------------------------ */

export const Calendar = ({
  events,
  defaultEvents = [],
  onEventsChange,
  initialDate,
  startHour = 0,
  endHour = 24,
  slotMinutes = 15,
  hourHeight = 56,
  weekStartsOn = 1,
  scrollToHour = 8,
  minDayWidth = 88,
  className = '',
}: CalendarProps) => {
  const dayStart = startHour * 60
  const dayEnd = endHour * 60
  const gridHeight = ((dayEnd - dayStart) / 60) * hourHeight

  const isControlled = events !== undefined
  const [internalEvents, setInternalEvents] = useState<CalendarEvent[]>(defaultEvents)
  const list = isControlled ? events! : internalEvents

  const commit = (next: CalendarEvent[]) => {
    if (!isControlled) setInternalEvents(next)
    onEventsChange?.(next)
  }

  const [weekStart, setWeekStart] = useState(() => startOfWeek(initialDate ?? new Date(), weekStartsOn))
  /** -1 / 1, so the week transition slides the way the user navigated. */
  const [direction, setDirection] = useState(1)
  const [now, setNow] = useState(() => new Date())

  const [draft, setDraft] = useState<Slot | null>(null)
  const [composer, setComposer] = useState<Composer | null>(null)
  const [dragged, setDragged] = useState<(Slot & { id: string }) | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<{ day: number; anchor: number } | null>(null)
  /** Pending touch taps — promoted to a composer open, or dropped on scroll. */
  const tapRef = useRef<{ x: number; y: number; day: number; minutes: number } | null>(null)
  const eventTapRef = useRef<{ id: string; x: number; y: number } | null>(null)
  const moveRef = useRef<{
    id: string
    mode: 'move' | 'resize'
    origin: Slot
    grabbedAt: { day: number; minutes: number }
    moved: boolean
  } | null>(null)

  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart])
  const weekKey = weekStart.getTime()

  /* Keep the "now" line honest without re-rendering every second. */
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  /* Open on the working day rather than at midnight. */
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    /* The grid starts right below the sticky header, so the header height
       cancels out and the target hour lands just under it. */
    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
    scroller.scrollTop = clamp((scrollToHour - startHour) * hourHeight, 0, maxScroll)
  }, [scrollToHour, startHour, hourHeight, gridHeight])

  /* ------------------------------------------------------------------
   * Geometry
   * ---------------------------------------------------------------- */

  const snap = (minutes: number) => Math.round(minutes / slotMinutes) * slotMinutes

  /** Pointer position -> day column + minutes since midnight, snapped to the grid. */
  const locate = (clientX: number, clientY: number) => {
    const rect = gridRef.current!.getBoundingClientRect()
    const day = clamp(Math.floor(((clientX - rect.left) / rect.width) * 7), 0, 6)
    const minutes = dayStart + ((clientY - rect.top) / hourHeight) * 60
    return { day, minutes: clamp(minutes, dayStart, dayEnd) }
  }

  const topOf = (minutes: number) => ((minutes - dayStart) / 60) * hourHeight
  const heightOf = (from: number, to: number) => Math.max(((to - from) / 60) * hourHeight, 16)

  /* ------------------------------------------------------------------
   * Drag to select an empty range
   * ---------------------------------------------------------------- */

  const onGridPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || composer) return

    const { day, minutes } = locate(event.clientX, event.clientY)
    const anchor = clamp(snap(minutes), dayStart, dayEnd - slotMinutes)

    /* On touch a drag belongs to the scroller, so only a tap opens the
       composer — capturing the pointer here would kill scrolling. */
    if (event.pointerType === 'touch') {
      tapRef.current = { x: event.clientX, y: event.clientY, day, minutes: anchor }
      return
    }

    selectRef.current = { day, anchor }
    setDraft({ day, from: anchor, to: anchor + slotMinutes })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onGridPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const tap = tapRef.current
    if (tap) {
      if (Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TAP_SLOP) tapRef.current = null
      return
    }

    const selection = selectRef.current
    if (!selection) return

    const edge = clamp(snap(locate(event.clientX, event.clientY).minutes), dayStart, dayEnd)
    const from = Math.min(selection.anchor, edge)
    const to = Math.max(selection.anchor, edge)

    setDraft({
      day: selection.day,
      from: Math.min(from, dayEnd - slotMinutes),
      to: Math.max(to, from + slotMinutes),
    })
  }

  const onGridPointerUp = () => {
    const tap = tapRef.current
    if (tap) {
      tapRef.current = null
      const slot = { day: tap.day, from: tap.minutes, to: Math.min(tap.minutes + 60, dayEnd) }
      setDraft(slot)
      setComposer(slot)
      return
    }

    if (!selectRef.current || !draft) return
    selectRef.current = null
    /* A plain click gets a sensible default block instead of one thin slot. */
    const isClick = draft.to - draft.from <= slotMinutes
    const to = isClick ? Math.min(draft.from + 60, dayEnd) : draft.to
    const slot = { ...draft, to }
    setDraft(slot)
    setComposer(slot)
  }

  /** Scroll took over (or the pointer was lost) — drop the pending gesture. */
  const abortGridGesture = () => {
    tapRef.current = null
    selectRef.current = null
    setDraft(null)
  }

  /* ------------------------------------------------------------------
   * Drag / resize an existing event
   * ---------------------------------------------------------------- */

  const beginEventDrag = (
    event: React.PointerEvent<HTMLElement>,
    placed: PlacedEvent,
    mode: 'move' | 'resize',
  ) => {
    if (event.button !== 0 || composer) return
    event.stopPropagation()

    /* Touch: tap edits, swipe scrolls. Move / resize stay pointer-driven. */
    if (event.pointerType === 'touch') {
      eventTapRef.current = { id: placed.event.id, x: event.clientX, y: event.clientY }
      return
    }

    moveRef.current = {
      id: placed.event.id,
      mode,
      origin: { day: placed.day, from: placed.from, to: placed.to },
      grabbedAt: locate(event.clientX, event.clientY),
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onEventPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const tap = eventTapRef.current
    if (tap) {
      if (Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TAP_SLOP) eventTapRef.current = null
      return
    }

    const drag = moveRef.current
    if (!drag) return

    const point = locate(event.clientX, event.clientY)
    const deltaMinutes = snap(point.minutes - drag.grabbedAt.minutes)
    const deltaDays = point.day - drag.grabbedAt.day

    if (deltaMinutes !== 0 || deltaDays !== 0) drag.moved = true
    if (!drag.moved) return

    const { origin } = drag

    if (drag.mode === 'resize') {
      const to = clamp(snap(point.minutes), origin.from + slotMinutes, dayEnd)
      setDragged({ id: drag.id, day: origin.day, from: origin.from, to })
      return
    }

    const length = origin.to - origin.from
    const from = clamp(origin.from + deltaMinutes, dayStart, dayEnd - length)
    setDragged({ id: drag.id, day: clamp(origin.day + deltaDays, 0, 6), from, to: from + length })
  }

  const onEventPointerUp = (placed: PlacedEvent) => {
    const tap = eventTapRef.current
    if (tap) {
      eventTapRef.current = null
      if (tap.id === placed.event.id) {
        setComposer({ day: placed.day, from: placed.from, to: placed.to, event: placed.event })
      }
      return
    }

    const drag = moveRef.current
    moveRef.current = null

    if (!drag) return

    if (!drag.moved || !dragged) {
      setDragged(null)
      setComposer({ day: placed.day, from: placed.from, to: placed.to, event: placed.event })
      return
    }

    const day = days[dragged.day]
    commit(list.map((item) => item.id === drag.id
      ? { ...item, start: withMinutes(day, dragged.from), end: withMinutes(day, dragged.to) }
      : item))
    setDragged(null)
  }

  /** Scroll took over mid-drag — snap the block back to where it started. */
  const abortEventGesture = () => {
    eventTapRef.current = null
    moveRef.current = null
    setDragged(null)
  }

  /* ------------------------------------------------------------------
   * Composer actions
   * ---------------------------------------------------------------- */

  const closeComposer = () => {
    setComposer(null)
    setDraft(null)
  }

  const saveComposer = (draftEvent: CalendarEvent) => {
    const exists = list.some((item) => item.id === draftEvent.id)
    commit(exists ? list.map((item) => (item.id === draftEvent.id ? draftEvent : item)) : [...list, draftEvent])
    closeComposer()
  }

  const deleteComposer = (id: string) => {
    commit(list.filter((item) => item.id !== id))
    closeComposer()
  }

  /* ------------------------------------------------------------------
   * Layout
   * ---------------------------------------------------------------- */

  const placed = useMemo(() => {
    const perDay: (Slot & { event: CalendarEvent })[][] = Array.from({ length: 7 }, () => [])

    for (const event of list) {
      const dayIndex = Math.round((startOfDay(event.start).getTime() - weekStart.getTime()) / 86_400_000)
      if (dayIndex < 0 || dayIndex > 6) continue

      const override = dragged?.id === event.id ? dragged : null
      const from = override ? override.from : minutesOf(event.start)
      /* An event ending at midnight, or running into the next day, is clipped. */
      const spillsOver = startOfDay(event.end).getTime() > startOfDay(event.start).getTime()
      const rawTo = override ? override.to : (spillsOver ? dayEnd : minutesOf(event.end) || dayEnd)
      const to = Math.max(clamp(rawTo, dayStart, dayEnd), from + slotMinutes)

      perDay[override ? override.day : dayIndex].push({ day: override ? override.day : dayIndex, from: clamp(from, dayStart, dayEnd), to, event })
    }

    return perDay.flatMap(packLanes)
  }, [list, weekStart, dragged, dayStart, dayEnd, slotMinutes])

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, index) => startHour + index),
    [startHour, endHour],
  )

  const nowDayIndex = days.findIndex((day) => isSameDay(day, now))
  const nowMinutes = minutesOf(now)
  const showNow = nowDayIndex !== -1 && nowMinutes >= dayStart && nowMinutes <= dayEnd

  const goToWeek = (offset: number) => {
    setDirection(offset)
    setWeekStart((current) => addDays(current, offset * 7))
  }

  const rangeLabel = (() => {
    const last = days[6]
    if (weekStart.getMonth() === last.getMonth()) return `${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`
    const sameYear = weekStart.getFullYear() === last.getFullYear()
    return `${MONTHS[weekStart.getMonth()].slice(0, 3)}${sameYear ? '' : ` ${weekStart.getFullYear()}`} – ${MONTHS[last.getMonth()].slice(0, 3)} ${last.getFullYear()}`
  })()

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border-primary bg-background-primary font-primary text-text-primary ${className}`}
    >
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-primary px-4 py-3">
        <div className="flex items-baseline gap-2 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h3
              key={rangeLabel}
              initial={{ y: direction * 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction * -14, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="font-heading text-lg font-semibold whitespace-nowrap"
            >
              {rangeLabel}
            </motion.h3>
          </AnimatePresence>
          <span className="hidden text-xs text-text-primary/40 sm:inline">Drag any empty slot</span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Dragging is pointer-only, so keyboard users get an explicit entry point. */}
          <button
            type="button"
            aria-label="New event"
            onClick={() => {
              const day = Math.max(nowDayIndex, 0)
              const from = clamp(snap(nowMinutes + 60), dayStart, dayEnd - 60)
              setComposer({ day, from, to: from + 60 })
            }}
            className="flex items-center gap-1 rounded-lg border border-border-primary px-2.5 py-1.5 font-navbar text-xs transition-colors hover:bg-text-primary/10"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
          <button
            type="button"
            onClick={() => {
              const target = startOfWeek(new Date(), weekStartsOn)
              setDirection(target.getTime() >= weekStart.getTime() ? 1 : -1)
              setWeekStart(target)
            }}
            className="rounded-lg border border-border-primary px-3 py-1.5 font-navbar text-xs transition-colors hover:bg-text-primary/10"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => goToWeek(-1)}
            className="rounded-lg border border-border-primary p-1.5 transition-colors hover:bg-text-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => goToWeek(1)}
            className="rounded-lg border border-border-primary p-1.5 transition-colors hover:bg-text-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* One scroller for both axes: the day header sticks to the top and the
          hour gutter sticks to the left, so narrow screens scroll the week
          sideways instead of squeezing seven columns into ~40px each. */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div style={{ width: `max(100%, ${GUTTER_WIDTH + 7 * minDayWidth}px)` }}>
          {/* Day header */}
          <div className="sticky top-0 z-[35] flex border-b border-border-primary bg-background-primary">
            <div className="sticky left-0 z-10 shrink-0 bg-background-primary" style={{ width: GUTTER_WIDTH }} />
            <div className="grid flex-1 grid-cols-7">
              {days.map((day) => {
                const today = isSameDay(day, now)
                return (
                  <div key={day.getTime()} className="flex flex-col items-center gap-0.5 border-l border-border-primary/60 py-2">
                    <span className="font-navbar text-[10px] uppercase tracking-[0.18em] text-text-primary/45">
                      {WEEKDAYS[day.getDay()]}
                    </span>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full font-heading text-sm font-semibold transition-colors ${
                        today ? 'bg-gradient-to-b from-purple-700 to-blue-600 text-white' : 'text-text-primary/80'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex" style={{ height: gridHeight }}>
            {/* Hour gutter */}
            <div className="sticky left-0 z-30 shrink-0 bg-background-primary" style={{ width: GUTTER_WIDTH }}>
              {hours.map((hour) => (
                <div key={hour} className="relative" style={{ height: hourHeight }}>
                  <span className="absolute -top-2 right-2 font-navbar text-[10px] text-text-primary/40">
                    {hour === startHour ? '' : fmtTime(hour * 60)}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div ref={gridRef} className="relative flex-1">
              {/* Static lines */}
              <div className="pointer-events-none absolute inset-0 grid grid-cols-7">
                {days.map((day) => (
                  <div key={day.getTime()} className="border-l border-border-primary/60" />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-t border-border-primary/45"
                    style={{ height: hourHeight }}
                  >
                    <div className="h-1/2 border-b border-dashed border-border-primary/20" />
                  </div>
                ))}
              </div>

              {/* Selection surface — events sit above this and stop propagation */}
              <div
                className="absolute inset-0 cursor-crosshair"
                onPointerDown={onGridPointerDown}
                onPointerMove={onGridPointerMove}
                onPointerUp={onGridPointerUp}
                onPointerCancel={abortGridGesture}
              />

              {/* Current time */}
              {showNow && (
                <div
                  className="pointer-events-none absolute z-20"
                  style={{
                    top: topOf(nowMinutes),
                    left: `${(nowDayIndex / 7) * 100}%`,
                    width: `${(1 / 7) * 100}%`,
                  }}
                >
                  <div className="relative h-px bg-rose-500">
                    <motion.span
                      className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-rose-500"
                      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.45, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}

              {/* Pending selection */}
              <AnimatePresence>
                {draft && (
                  <motion.div
                    className="pointer-events-none absolute z-20 px-1"
                    style={{
                      top: topOf(draft.from),
                      height: heightOf(draft.from, draft.to),
                      left: `${(draft.day / 7) * 100}%`,
                      width: `${(1 / 7) * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                  >
                    <div className="flex h-full w-full flex-col justify-start overflow-hidden rounded-lg border border-dashed border-violet-400/80 bg-violet-500/20 px-2 py-1 backdrop-blur-[1px]">
                      <span className="font-navbar text-[10px] leading-tight text-text-primary/80">
                        {fmtRange(draft.from, draft.to)}
                      </span>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Events — remounted per week so navigation animates */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={weekKey}
                /* Layer must not eat pointerdowns aimed at the selection surface. */
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0, x: direction * 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -18 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                {placed.map((item) => {
                  const color = COLORS[item.event.color ?? 'violet']
                  const isDragging = dragged?.id === item.event.id
                  const compact = item.to - item.from <= 30

                  return (
                    <motion.div
                      key={item.event.id}
                      layout={!isDragging}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      /* The wrapper is what stacks against sibling blocks, so the
                         lift has to live here rather than on the chip inside. */
                      className={`pointer-events-auto absolute px-[3px] ${isDragging ? 'z-[25]' : 'z-10'}`}
                      style={{
                        top: topOf(item.from),
                        height: heightOf(item.from, item.to),
                        left: `${((item.day + item.lane / item.lanes) / 7) * 100}%`,
                        width: `${(1 / (7 * item.lanes)) * 100}%`,
                      }}
                      onPointerDown={(event) => beginEventDrag(event, item, 'move')}
                      onPointerMove={onEventPointerMove}
                      onPointerUp={() => onEventPointerUp(item)}
                      onPointerCancel={abortEventGesture}
                      onHoverStart={() => setHoveredId(item.event.id)}
                      onHoverEnd={() => setHoveredId(null)}
                    >
                      <motion.div
                        animate={{
                          y: hoveredId === item.event.id && !isDragging ? -1 : 0,
                          boxShadow: isDragging
                            ? '0 18px 34px -12px rgba(0,0,0,0.6)'
                            : '0 0 0 0 rgba(0,0,0,0)',
                        }}
                        transition={{ duration: 0.16 }}
                        className={`group relative flex h-full w-full cursor-grab flex-col overflow-hidden rounded-lg border px-2 py-1 text-white active:cursor-grabbing ${color.chip} ${
                          isDragging ? 'opacity-95' : ''
                        }`}
                      >
                        <span className={`truncate font-navbar text-xs font-medium leading-tight ${compact ? '' : 'mb-0.5'}`}>
                          {item.event.title || 'Untitled'}
                        </span>
                        {!compact && (
                          <span className="truncate text-[10px] leading-tight text-white/75">
                            {fmtRange(item.from, item.to)}
                          </span>
                        )}

                        {/* Resize handle */}
                        <div
                          className="absolute inset-x-0 bottom-0 h-2 cursor-ns-resize"
                          onPointerDown={(event) => beginEventDrag(event, item, 'resize')}
                          onPointerMove={onEventPointerMove}
                          onPointerUp={() => onEventPointerUp(item)}
                          onPointerCancel={abortEventGesture}
                        >
                          <div className="mx-auto mt-0.5 h-[3px] w-6 rounded-full bg-white/0 transition-colors group-hover:bg-white/50" />
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Composer */}
      <AnimatePresence>
        {composer && (
          <EventComposer
            key={composer.event?.id ?? `${composer.day}-${composer.from}`}
            slot={composer}
            day={days[composer.day]}
            slotMinutes={slotMinutes}
            dayStart={dayStart}
            dayEnd={dayEnd}
            onCancel={closeComposer}
            onSave={saveComposer}
            onDelete={deleteComposer}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Composer modal
 * ------------------------------------------------------------------------ */

interface EventComposerProps {
  slot: Composer
  day: Date
  slotMinutes: number
  dayStart: number
  dayEnd: number
  onCancel: () => void
  onSave: (event: CalendarEvent) => void
  onDelete: (id: string) => void
}

const EventComposer = ({
  slot,
  day,
  slotMinutes,
  dayStart,
  dayEnd,
  onCancel,
  onSave,
  onDelete,
}: EventComposerProps) => {
  const [title, setTitle] = useState(slot.event?.title ?? '')
  const [notes, setNotes] = useState(slot.event?.notes ?? '')
  const [color, setColor] = useState<CalendarEventColor>(slot.event?.color ?? 'violet')
  const [date, setDate] = useState(toDateInput(slot.event ? startOfDay(slot.event.start) : day))
  const [from, setFrom] = useState(toTimeInput(slot.from))
  const [to, setTo] = useState(toTimeInput(slot.to))

  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  const submit = () => {
    const baseDate = fromDateInput(date) ?? day
    const fromMinutes = clamp(fromTimeInput(from) ?? slot.from, dayStart, dayEnd - slotMinutes)
    /* An end at or before the start is nudged forward rather than rejected. */
    const toMinutes = clamp(fromTimeInput(to) ?? slot.to, fromMinutes + slotMinutes, dayEnd)

    onSave({
      id: slot.event?.id ?? uid(),
      title: title.trim() || 'Untitled',
      notes: notes.trim() || undefined,
      color,
      start: withMinutes(baseDate, fromMinutes),
      end: withMinutes(baseDate, toMinutes),
    })
  }

  const field = 'w-full rounded-lg border border-border-primary bg-background-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-violet-400'

  return (
    <motion.div
      /* z-40: stays above the sticky header but below a typical app navbar (z-50). */
      className="absolute inset-0 z-40 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={slot.event ? 'Edit event' : 'New event'}
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-background-primary shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border-primary px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-primary/50" />
            <h4 className="font-heading text-sm font-semibold text-text-primary">
              {slot.event ? 'Edit event' : 'New event'}
            </h4>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="rounded-lg p-1 text-text-primary/60 transition-colors hover:bg-text-primary/10 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-3 px-4 py-4"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <input
            ref={titleRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a title"
            className={`${field} font-navbar`}
          />

          <div className="grid grid-cols-2 gap-2">
            <label className="col-span-2 space-y-1">
              <span className="font-navbar text-[10px] uppercase tracking-[0.16em] text-text-primary/45">Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={field} />
            </label>
            <label className="space-y-1">
              <span className="font-navbar text-[10px] uppercase tracking-[0.16em] text-text-primary/45">Starts</span>
              <input type="time" value={from} onChange={(event) => setFrom(event.target.value)} className={field} />
            </label>
            <label className="space-y-1">
              <span className="font-navbar text-[10px] uppercase tracking-[0.16em] text-text-primary/45">Ends</span>
              <input type="time" value={to} onChange={(event) => setTo(event.target.value)} className={field} />
            </label>
          </div>

          <div className="space-y-1">
            <span className="font-navbar text-[10px] uppercase tracking-[0.16em] text-text-primary/45">Colour</span>
            <div className="flex gap-2">
              {COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  aria-pressed={color === key}
                  onClick={() => setColor(key)}
                  className={`h-6 w-6 rounded-full transition-transform ${COLORS[key].swatch} ${
                    color === key ? `scale-110 ring-2 ring-offset-2 ring-offset-background-primary ${COLORS[key].ring}` : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            placeholder="Notes (optional)"
            className={`${field} resize-none`}
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            {slot.event ? (
              <button
                type="button"
                onClick={() => onDelete(slot.event!.id)}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 px-3 py-2 font-navbar text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            ) : (
              <span className="font-navbar text-xs text-text-primary/40">{fmtRange(slot.from, slot.to)}</span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-border-primary px-3 py-2 font-navbar text-xs text-text-primary/80 transition-colors hover:bg-text-primary/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-b from-purple-700 to-blue-600 px-4 py-2 font-navbar text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                {slot.event ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Calendar
